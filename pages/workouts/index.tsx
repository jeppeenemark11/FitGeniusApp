import { useState, useEffect, Fragment } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import AuthPromptCard from '@/components/AuthPromtCard';
import { Dialog, Transition } from '@headlessui/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Head from 'next/head';

const workoutEmojis = ['🔥', '🏃‍♂️', '💪', '🚴‍♀️', '🤸‍♂️', '🏋️‍♀️', '⛹️‍♂️', '🏊‍♀️', '🤼‍♀️'];
const getRandomEmoji = () => workoutEmojis[Math.floor(Math.random() * workoutEmojis.length)];

type Workout = {
  id: string;
  name: string;
  estimatedDuration: string;
  timesUsed: number;
};

const Workouts: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.workouts) {
            let workoutsWithEstimatedTime = userData.workouts.map((workout: any, index: number) => {
              let estimatedDuration = '0 min';
  
              // Calculate from times array
              if (workout.times && workout.times.length > 0) {
                const totalSeconds = workout.times.reduce((acc: number, curr: number) => acc + curr, 0);
                const averageSeconds = totalSeconds / workout.times.length;
                const averageMinutes = Math.round(averageSeconds / 60);
                estimatedDuration = `${averageMinutes} min`;
              }
              // Calculate from exercises array if times array is not available
              else if (workout.exercises && workout.exercises.length > 0) {
                const totalSets = workout.exercises.reduce((acc: number, exercise: { sets: Array<any> }) => acc + exercise.sets.length, 0);
                estimatedDuration = `${totalSets * 3} min`; 
              }
  
              return {
                ...workout,
                id: workout.id || `workout${index}`, // now 'index' is defined within the scope
                estimatedDuration
              };
            })
         
            setWorkouts(workoutsWithEstimatedTime);
          }
        }
      }
    };

    fetchWorkouts();
  }, [user]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return; // Dropped outside the list
    const items = Array.from(workouts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWorkouts(items);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { workouts: items });
    }
  };

  const handleOpenModal = (workout: Workout) => {
    setSelectedWorkout(workout);
    setDropdown(false);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleModifyClick = (index: number) => {
    router.push(`/workouts/modify/${index}`);
  };

  const handleDelete = async () => {
    if (user && selectedWorkout) {
      const userRef = doc(db, 'users', user.uid);
      const updatedWorkouts = workouts.filter(workout => workout.id !== selectedWorkout.id);
      await updateDoc(userRef, {
        workouts: updatedWorkouts
      });
      setWorkouts(updatedWorkouts);
      setIsOpen(false);
    }
  };

  const handleStartWorkout = (index: number) => {
    router.push(`/workouts/${index}`);
  };

  return (
    <div onClick={() => setDropdown(false)}>
       <Head>
        <title>Workouts | FitGeniusApp</title>
        </Head>
      {user ? (
        <div className="min-h-screen bg-gray-100 p-8 pt-24" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Your Workouts 🏋️‍♀️</h1>
            <button onClick={() => router.push('/workouts/create')} className="bg-red-500 text-white py-3 px-8 rounded-full shadow-lg text-lg hover:bg-red-600 transition-transform transform hover:scale-105">Create New Workout ➕</button>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="workouts">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {workouts.map((workout, index) => (
                    <Draggable key={workout.id} draggableId={workout.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative bg-red-400 text-white p-6 rounded-xl shadow-lg hover:bg-red-500 hover:cursor-pointer transform hover:scale-105 transition-transform flex flex-col justify-between"
                         
                        >
                          <div className="mb-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-3xl font-bold mb-2">{workout.name} {getRandomEmoji()}</h3>
                              <button onClick={(e) => { e.stopPropagation(); setDropdown(selectedWorkout?.id === workout.id ? !dropdown : true); setSelectedWorkout(workout); }} className="absolute top-0 right-5 text-2xl hover:scale-110 transition-transform">...</button>
                              {(dropdown && selectedWorkout?.id === workout.id) && (
                                <div className="absolute top-10 -right-2 bg-white p-2 rounded-xl shadow-lg z-10">
                                  <button onClick={() => handleModifyClick(index)} className="block w-full text-left py-2 px-4 hover:bg-gray-200 text-black">Modify</button>
                                  <button onClick={() => handleOpenModal(workout)} className="block w-full text-left py-2 px-4 hover:bg-red-600 text-red-600 hover:text-black">Delete</button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-lg mb-2">
                              <span>⏳</span>
                              <span>{workout.estimatedDuration}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-lg">
                              <span>📋</span>
                              <span>Times Used: {workout.timesUsed}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center bg-red-600 hover:bg-red-900 text-white py-2 px-4 rounded-xl text-lg scale-100 hover:scale-105 transition-transform duration-300"  onClick={() => handleStartWorkout(index)}>Start Workout 🚀</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <AuthPromptCard/>
      )}

      {/* Deletion Confirmation Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Confirm Deletion</Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Are you sure you want to delete this workout? This action cannot be undone.</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button type="button" className="inline-flex justify-center rounded-xl border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2" onClick={handleCloseModal}>Cancel</button>
                    <button type="button" className="inline-flex justify-center rounded-xl border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2" onClick={handleDelete}>Delete</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Workouts;
