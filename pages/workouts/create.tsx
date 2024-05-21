
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useExercises } from '@/context/ExerciseContext';
import { db } from '@/utils/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Head from 'next/head';

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

const WorkoutCreate: React.FC = () => {
  const { user } = useAuth();
  const { exercises, loading } = useExercises();
  const router = useRouter();
  const [selectedExercises, setSelectedExercises] = useState<ExerciseForm[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [isWorkoutNameInvalid, setIsWorkoutNameInvalid] = useState(false);
  const [isWorkoutLength0, setIsWorkoutLength0] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter exercises based on search term
  const filteredExercises = exercises
    ? exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Select an exercise to add to the list (only if not already selected)
const handleExerciseSelect = (exercise: any) => {
  setIsWorkoutLength0(false);
  
    const alreadySelected = selectedExercises.some((item) => item.id === exercise.id);
  
    // If not already selected, proceed to add it to the list
    if (!alreadySelected) {
      const isCardio = exercise.bodyPart.toLowerCase() === 'cardio';
      const sets = isCardio ? [{ time: '0:00' }] : [{ weight: 0, reps: 0 }];
      setSelectedExercises((prev) => [
        ...prev,
        {
          id: exercise.id,
          name: exercise.name,
          gifUrl: exercise.gifUrl,
          type: isCardio ? 'time' : 'kg-reps',
          sets,
        },
      ]);
    }
    
    setSearchVisible(false);
  };

  // Adjust the number of sets for each exercise
  const handleSetCountChange = (index: number, count: number) => {
    const setsCount = Math.max(1, Math.min(10, count));
    const newSets = new Array(setsCount).fill(null).map(() =>
      selectedExercises[index].type === 'time'
        ? { time: "0:00" }
        : { weight: 0, reps: 0 }
    );

    setSelectedExercises((prev) =>
      prev.map((exercise, i) => (i === index ? { ...exercise, sets: newSets } : exercise))
    );
  };

  // Change exercise type between kg/reps and time
  const handleTypeChange = (index: number, newType: 'kg-reps' | 'time') => {
    setSelectedExercises((prev) =>
      prev.map((exercise, i) =>
        i === index
          ? {
              ...exercise,
              type: newType,
              sets:
                newType === 'time'
                  ? [{ time: "0:00" }]
                  : [{ weight: 0, reps: 0 }],
            }
          : exercise
      )
    );
  };

  // Remove an exercise from the list
  const handleRemoveExercise = (index: number) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle drag-and-drop functionality
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Ensure the destination is valid
    if (!destination) return;

    const reorderedExercises = Array.from(selectedExercises);
    const [movedItem] = reorderedExercises.splice(source.index, 1);
    reorderedExercises.splice(destination.index, 0, movedItem);

    setSelectedExercises(reorderedExercises);
  };

  // Save the workout to Firestore
  const handleSaveWorkout = async () => {
    if (selectedExercises.length === 0){
      setIsWorkoutLength0(true);
      return;

    }
    
    if (!workoutName.trim()) {
      setIsWorkoutNameInvalid(true);
      return;
    }

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        workouts: arrayUnion({
          name: workoutName,
          times: [],
          timesUsed: 0,
          exercises: selectedExercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            type: exercise.type,
            sets: exercise.sets, 
          })),
          
        }),
      });
      router.push('/workouts');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center relative pt-24">
       <Head>
        <title>Workout Creator | FitGeniusApp</title>
        </Head>
      {/* Top Buttons */}
      <div className="absolute top-28 left-0 w-full flex justify-between px-4 sm:px-8">
        <button
          onClick={() => router.push('/workouts')}
          className="bg-red-500 text-white py-2 px-4 rounded-xl shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveWorkout}
          className="bg-green-500 text-white py-2 px-4 rounded-xl shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Save Workout
        </button>
      </div>

      {/* Centered Heading */}
      <h1 className="text-4xl font-bold mb-12 text-center text-blue-600 mt-16 sm:mt-24">Create Workout 🏋️‍♀️</h1>

      {/* Workout Name Input */}
      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => {
          setWorkoutName(e.target.value);
          setIsWorkoutNameInvalid(false);
        }}
        className={`mb-8 p-3 rounded-xl border ${
          isWorkoutNameInvalid ? 'border-red-600 shake-animation' : 'border-gray-400'
        } w-full max-w-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {isWorkoutNameInvalid && (
        <p className="text-red-600 mb-4">Please provide a name for the workout.</p>
      )}
       {isWorkoutLength0 && (
        <p className="text-red-600 mb-4">Add 1 or more exercises to your Workout!</p>
      )}


      {/* Selected Exercises List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="selected-exercises">
          {(provided) => (
            <div
              className="mb-6 w-full max-w-xl space-y-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {selectedExercises.map((exercise, index) => (
                <Draggable
                  key={`draggable-${exercise.id}`}
                  draggableId={`draggable-${exercise.id}`}
                  index={index}
                >
                  {(draggableProvided) => (
                    <div
                      className="bg-blue-100 text-blue-900 p-6 rounded-xl shadow-lg flex flex-col space-y-4"
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold">
                          {exercise.name} {exercise.type === 'kg-reps' ? '🏋️‍♂️' : '🏃‍♂️'}
                        </h3>
                        <div className="flex space-x-2">
                          <select
                            value={exercise.type}
                            onChange={(e) =>
                              handleTypeChange(index, e.target.value as 'kg-reps' | 'time')
                            }
                            className="rounded-xl p-1 border border-gray-300 bg-white pr-8"
                          >
                            <option value="kg-reps">kg/reps</option>
                            <option value="time">Time</option>
                          </select>
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="bg-red-500 text-white py-1 px-2 rounded-xl shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-blue-300 rounded-xl p-2 shadow-sm flex justify-center">
                        <img
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="mb-2 flex flex-col">
                        <label className="mr-2 font-semibold">Number of Sets:</label>
                        <select
    value={exercise.sets.length}
    onChange={(e) => handleSetCountChange(index, parseInt(e.target.value))}
    className="rounded-xl p-2 border border-gray-500 shadow-md w-20 text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
      <option key={number} value={number}>
        {number}
      </option>
    ))}
  </select>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
       {/* Exercise Search Section */}
       {searchVisible && (
        <div className="max-h-64 overflow-auto bg-white p-4 rounded-xl shadow-lg mb-8 border border-gray-300 w-full max-w-xl">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-3 rounded-xl border border-gray-400 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loading ? (
            <div>Loading...</div>
          ) : (
            filteredExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => handleExerciseSelect(exercise)}
                className="flex items-center p-3 mb-2 rounded-lg text-left w-full hover:bg-gray-100"
              >
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-16 h-16 rounded-xl mr-2 object-cover border border-gray-400"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{exercise.name}</p>
                  <p className="text-sm text-gray-600">{exercise.bodyPart}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Add Exercise Button */}
      <button
        onClick={() => setSearchVisible(!searchVisible)}
        className="bg-purple-500 text-white py-3 px-6 mb-4 rounded-xl shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        Add Exercise ➕
      </button>

     
    </div>
  );
};

export default WorkoutCreate;
