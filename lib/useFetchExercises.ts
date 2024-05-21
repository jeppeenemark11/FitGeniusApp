import { useState } from 'react';

export interface Exercise {
    id: string;
    name: string;
    bodyPart: string;
    gifUrl: string;
    secondaryMuscles: string[];
    instructions: string[];
}
type ExerciseCallback = (result: Exercise) => void;

export const useFetchExercises = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const shuffleArray = (array: Exercise[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const isEmptyObject = (obj: object) => {
        return Object.keys(obj).length === 0;
    };

    const fetchExercises = async (
        query: string | string[],
        all = true,
        id = false,
        callback?: ExerciseCallback
    ) => {
        if (!query) return;

        setLoading(true);
        setError('');

        try {
            if (all && !id) {
                const response = await fetch(`/api/exercises?q=${query}`);
                const data = await response.json();

                if (!response.ok || isEmptyObject(data)) throw new Error('Failed to load data');

                setExercises(data);
            } else if (!all && Array.isArray(query) && !id) {
                // Use map to fetch exercises for specific body parts
                const fetchPromises = query.map(bodyPart =>
                    fetch(`/api/exercisebodypart?q=${bodyPart}`)
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(data => Promise.reject(data.message || 'Failed to load data'));
                            }
                            return response.json();
                        })
                );

                // Combine results from all fetched promises
                const exercisesArrays = await Promise.all(fetchPromises);
                const combinedExercises = exercisesArrays.flat();

                // Shuffle the combined array
                const shuffledExercises = shuffleArray(combinedExercises);
                setExercises(shuffledExercises);
            } else if (id) {
                const response = await fetch(`/api/exerciseid?q=${query}`);
                const data = await response.json();

                if (!response.ok || isEmptyObject(data)) throw new Error('Failed to load data');

                setExercises([data]);

                if (callback) {
                    callback(data);
                }
            }
        } catch (err: any) {
            setError(err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        exercises,
        loading,
        error,
        fetchExercises,
    };
};
