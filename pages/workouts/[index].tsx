import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useExercises } from '@/context/ExerciseContext';
import { db } from '@/utils/firebase';
import { doc, updateDoc, getDoc, runTransaction, serverTimestamp, collection } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import DetailedCard from '@/components/DetailedCard';
import SetInput from '@/components/SetInput';
import Head from 'next/head';

interface Exercise {
  id: string;
  name: string;
  bodyPart?: string;
  gifUrl?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

interface ExerciseForDetailedCard {
  id: string;
  name: string;
  bodyPart?: string;
  gifUrl?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

interface WorkoutExercise {
  id: string;
  type: 'kg-reps' | 'time';
  sets: SetData[];
}

type SetData = {
  weight?: number;
  reps?: number;
  time?: string;
};

type ExerciseForm = {
  id: string;
  name: string;
  gifUrl: string;
  type: 'kg-reps' | 'time';
  sets: SetData[];
};

const WorkoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { exercises, loading } = useExercises();
  const index = parseInt(router.query.index as string, 10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseForm[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [currentExercise, setCurrentExercise] = useState<ExerciseForDetailedCard | null>(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && exercises) {
        const data = userDoc.data();
        const workouts = data.workouts ?? [];
        if (index >= 0 && workouts[index]) {
          const workout = workouts[index];
          const updatedExercises = workout.exercises.map((wExercise: WorkoutExercise) => ({
            ...wExercise,
            ...exercises.find(e => e.id === wExercise.id),
          }));
          setSelectedExercises(updatedExercises);
          setWorkoutName(workout.name);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    if (!loading && user) {
      fetchWorkout();
    }
  }, [user, index, exercises, loading, router]);

  useEffect(() => {
    let interval: number;
    if (timerActive) {
      interval = window.setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [timerActive]);

  useEffect(() => {
    setTimerActive(true);
    return () => setTimerActive(false);
  }, []);


  if (isLoading) {
    return <div className='h-screen items-center flex justify-center'>Loading...</div>;
  }

  if (!selectedExercises.length && !isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-center h-screen">
        <div className="justify-center">
          <p>No workout found.</p>
          <button onClick={() => router.push('/workouts')} className="bg-blue-500 text-white p-3 rounded">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedExercises = Array.from(selectedExercises);
    const [movedItem] = reorderedExercises.splice(source.index, 1);
    reorderedExercises.splice(destination.index, 0, movedItem);

    setSelectedExercises(reorderedExercises);
  };

  const handleVideoOrInstructionsClick = (id: string) => {
    if (exercises && exercises.length) {
      const exercise: Exercise | undefined = exercises.find(ex => ex.id === id);
  
      if (exercise) {
        const { id, name, bodyPart, gifUrl, secondaryMuscles, instructions } = exercise;
        setScrollToBottom(true);
        setCurrentExercise({ id, name, bodyPart, gifUrl, secondaryMuscles, instructions })

       
      } else {
        console.log("No exercise found for the given ID.");
      }
    }
  };

  const handleSaveWorkout = async () => {
    if (!user) return;
  
    const userRef = doc(db, 'users', user.uid);
  
    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) throw new Error("Document does not exist!");
  
        let userData = userDoc.data();
        let workouts = userData.workouts ?? [];
  
        // Ensure the index is valid
        if (index < 0 || index >= workouts.length) throw new Error("Invalid workout index!");
  
        // Updating the workout details
        workouts[index] = {
          ...workouts[index], 
          times: [...(workouts[index]?.times || []), timeElapsed], 
          timesUsed: (workouts[index]?.timesUsed || 0) + 1, 
          exercises: selectedExercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            type: exercise.type,
            sets: exercise.sets,
          }))
        };
  

        const newTotal = (userData.total || 0) + 1;
  
        // Prepare the history entry to be added
        const historyRef = doc(collection(db, `users/${user.uid}/history`));
        const workoutHistory = {
          date: new Date(), // Client-side timestamp reflecting the local time
          time: new Date(timeElapsed * 1000).toISOString().substr(11, 8), // HH:MM:SS format
          name: workoutName,
          workoutNum: newTotal
        };
  
        // Set the updated data in the transaction
        transaction.set(userRef, { 
          ...userData, 
          workouts, 
          total: newTotal 
        });
  
        // Add the history entry
        transaction.set(historyRef, workoutHistory);
      });
  
      setTimerActive(false);
      router.push({
        pathname: '/workout-history',
        query: { success: true }
      });
    } catch (error) {
      console.error("Failed to save workout:", error);

    }
  };

  const handleDiscardChanges = () => {
    setTimerActive(false);
    router.push('/workouts');
  };

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, updatedSet: SetData) => {
    setSelectedExercises(prevExercises => {
      const newExercises = [...prevExercises];
      const updatedExercise = { ...newExercises[exerciseIndex] };
      updatedExercise.sets[setIndex] = updatedSet;
      newExercises[exerciseIndex] = updatedExercise;
      return newExercises;
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center relative pt-24">
       <Head>
        <title>Modify {workoutName}| FitGeniusApp</title>
        </Head>
    <div className="absolute top-28 left-4">
      <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" onClick={handleDiscardChanges}>Cancel</Button>
    </div>
    <div className="absolute top-28 right-4">
      <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" onClick={handleSaveWorkout}>Finish</Button>
    </div>
    <div className="text-center">
  <h1 className="text-2xl font-semibold text-red-600 mb-4">{workoutName} 💪</h1>
  <div className="text-lg text-gray-600 flex justify-center items-center gap-2 mb-8 p-4 border rounded-xl shadow">
    <span>⏳</span>
    <span>{new Date(timeElapsed * 1000).toISOString().substr(11, 8)}</span>
  </div>
</div>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="selected-exercises">
        {(provided) => (
          <div className="mb-6 w-full max-w-4xl space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
            {selectedExercises.map((exercise, exerciseIndex) => (
              <Draggable key={`draggable-${exercise.id}`} draggableId={`draggable-${exercise.id}`} index={exerciseIndex}>
                {(draggableProvided) => (
                  <div className="bg-white text-red-900 p-6 rounded-xl shadow-lg flex flex-col space-y-4" ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps}>
                    <h3 className="text-xl font-semibold text-center">{exercise.name} {exercise.type === 'kg-reps' ? '🏋️‍♂️' : '🏃‍♂️'}</h3>
                    <div className="flex justify-center">
    <img src={exercise.gifUrl} alt={exercise.name} className="w-40 h-40 object-cover rounded-lg" />
  </div>
  <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl" onClick={() => handleVideoOrInstructionsClick(exercise.id)}>Instructions</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl" onClick={() => handleVideoOrInstructionsClick(exercise.id)}>Video</Button>
                    {exercise.sets.map((set, index) => (
                      <SetInput
                        key={`set-${exercise.id}-${index}`}
                        set={set}
                        index={index}
                        onUpdate={(setIndex, updatedSet) => {
                          handleUpdateSet(exerciseIndex, setIndex, updatedSet);
                        }}
                      />
                    ))}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
      {currentExercise && <DetailedCard
        name={currentExercise.name}
        bodyPart={currentExercise.bodyPart || ''}
        gifUrl={currentExercise.gifUrl || ''}
        secondaryMuscles={currentExercise.secondaryMuscles || []}
        instructions={currentExercise.instructions || []}
        closeDetailedCard={() => {
          setCurrentExercise(null)
           setScrollToBottom(false)}}
        scrollToBottom={scrollToBottom}
      />}
     <div className="relative bottom-10 mt-10  ">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" onClick={handleSaveWorkout}>Finish Workout</Button>
      </div>
    </div>
  );
  
};

export default WorkoutPage;
