import React, { createContext, useContext, useEffect, useState } from 'react';


interface Exercise {
  id: string;
  name: string;
  bodyPart?: string;
  gifUrl?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  target?: string;
  equipment?: string;
}


type ExerciseContextType = {
  exercises: Exercise[] | null;
  loading: boolean;
};


const ExerciseContext = createContext<ExerciseContextType>({ exercises: null, loading: true });


export const ExerciseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (exercises){
        return;
    }

    function loadFromSessionStorage(): Exercise[] | null {
      const storedExercises = sessionStorage.getItem('exercises');
      return storedExercises ? JSON.parse(storedExercises) : null;
    }


    async function fetchExercisesFromAPI() {
      try {
        const response = await fetch('/api/exercises'); 
        const data = await response.json();
        sessionStorage.setItem('exercises', JSON.stringify(data)); 
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    }

   
    const storedExercises = loadFromSessionStorage();
    if (storedExercises && !exercises) {
      setExercises(storedExercises);
      setLoading(false);
    } else if (!storedExercises && !exercises){
      fetchExercisesFromAPI();
    }
  }, [exercises]);

  return (
    <ExerciseContext.Provider value={{ exercises, loading }}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercises = () => useContext(ExerciseContext);
