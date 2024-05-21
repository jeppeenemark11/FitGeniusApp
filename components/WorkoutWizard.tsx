import React, { useState, useEffect } from 'react';
import Questionnaire from './Questionnaire';
import Image from 'next/image';
import AiComponent from '@/components/AIComponent';
import { useAuth } from '@/context/AuthContext';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/utils/firebase';

type Exercise = {
    name: string;
    id: string;
    sets: number;
    type: string;
};

type Workout = {
    name: string;
    exercises: Exercise[];
};

const WorkoutWizard: React.FC = () => {
    const [inProgress, setInProgress] = useState(false);
    const [aiActivated, setaiActivated] = useState(false);
    const [triesLeft, setTriesLeft] = useState(0);
    const { user } = useAuth();
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userTimeChoice, setUserTimeChoice] = useState("");


    useEffect(() => {
        if (!user) return;
    
        const docRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setTriesLeft(doc.data()?.aiLeft ?? 0);
          }
        });
    
        return () => unsubscribe();
      }, [user]);


      const decrementAiLeft = async () => {
        if (!user) return;
        const userDocRef = doc(db, "users", user.uid);

        try {
         
            await updateDoc(userDocRef, {
              aiLeft: increment(-1)
            });
          } catch (error) {
            console.error("Error updating document: ", error);
          }
      };

      const triggerAlert = () => {
        setShowErrorAlert(true);
        setTimeout(() => {
            setShowErrorAlert(false);
        }, 5000); 
    };

      const tryWorkoutWizardClick =  () => {
        if (!user) {
            setInProgress(true);
        } else if (triesLeft <= 0) {
            triggerAlert();
           
        } else {
            setInProgress(true);
        }
      }

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-50 to-blue-100">
           {user &&
            <span className="absolute top-24 right-4 text-gray-800 text-sm">{triesLeft} use left</span>
           }
            {!inProgress && !aiActivated && (
                <div className="text-center w-full">
                    <div className="relative w-72 h-72 mx-auto my-5 animate-alive">  
                        <Image src="/AIWizard.png" alt="AI Wizard" layout='fill' objectFit='contain' />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome to the AI Workout Wizard!</h1>
                    <p className="text-gray-700 mb-5">Get ready to transform your fitness journey with a tailored workout plan.</p>
                    <button
                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-xl transition duration-300 ease-in-out transform hover:scale-110"
                        onClick={tryWorkoutWizardClick}
                    >
                        Try Workout Wizard!
                    </button>
                </div>
            )} 
            {inProgress && !aiActivated && (
                <Questionnaire setInProgress={setInProgress} setLoading={setLoading} setWorkouts={setWorkouts} setaiActivated={setaiActivated} decrementaiLeft={decrementAiLeft} setUserTimeChoice={setUserTimeChoice}/>
            )}
            {aiActivated && !inProgress && (
                <AiComponent workouts={workouts} loading={loading} userTimeChoice={userTimeChoice}/>
            )}
             {showErrorAlert && (
                <div className="absolute top-50 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
                    Sorry, you don{"'"}t have any more tries left.
                </div>
            )}
        </div>
    );
};

export default WorkoutWizard;
