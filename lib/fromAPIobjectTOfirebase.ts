import { db } from '@/utils/firebase'; 
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';


interface SetDetails {
  time?: string;
  reps?: number;
  weight?: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: SetDetails[];
  type: string;
}

interface Workout {
  name: string;
  exercises: Exercise[];
  times: any[];
  timesUsed: number;
  ai?: boolean;
}

interface ApiWorkout {
  name: string;
  exercises: Array<{
    id: string;
    name: string;
    sets: number;
    type: string;
  }>;
}

export const createWorkoutInFirebase = async (apiWorkouts: ApiWorkout[], userId: string) => {
  const userDocRef = doc(db, 'users', userId);
  await Promise.all(apiWorkouts.map(async (workout) => {
    const exercises = workout.exercises.map(exercise => {
      const setsArray: SetDetails[] = [];
      for (let i = 0; i < exercise.sets; i++) {
        if (exercise.type === 'time') {
          setsArray.push({ time: '0:00' });
        } else {
          setsArray.push({ reps: 0, weight: 0 });
        }
      }
      return {
        id: exercise.id,
        name: exercise.name,
        sets: setsArray,
        type: exercise.type,
      };
    });

    const newWorkout: Workout = {
      name: workout.name,
      exercises,
      times: [],
      timesUsed: 0,
    };

    console.log(newWorkout);
    // Update the document to add the new workout to the 'workouts' array field
    return updateDoc(userDocRef, {
      workouts: arrayUnion(newWorkout)
    })
    .then(() => console.log(`Workout ${workout.name} added to array successfully`))
    .catch((error) => console.error(`Error adding workout ${workout.name} to array:`, error));
  }));
}
