import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const getLevel = (total: number): string => {
  if (total < 10) return '🐣';
  if (total < 20) return '🚶';
  if (total < 50) return '🏃';
  if (total < 100) return '🚴';
  if (total < 200) return '🏋️';
  return '🏆';
};

const getLevelName = (total: number): string => {
  if (total < 10) return 'Fitness Newbie';
  if (total < 20) return 'Active Walker';
  if (total < 50) return 'Running Rookie';
  if (total < 100) return 'Cycling Enthusiast';
  if (total < 200) return 'Weight Lifter';
  return 'Fitness Champion';
};

// Function to calculate visual progress (30% to 100%)
const calculateVisualProgress = (actualProgress: number): number => {
  const visualStart = 30;
  const visualEnd = 100;
  return visualStart + (actualProgress / 100) * (visualEnd - visualStart);
};

const getProgress = (total: number): { progress: number, levelThreshold: number } => {
  if (total < 10) return { progress: calculateVisualProgress((total / 10) * 100), levelThreshold: 10 };
  if (total < 20) return { progress: calculateVisualProgress(((total - 10) / 10) * 100), levelThreshold: 20 };
  if (total < 50) return { progress: calculateVisualProgress(((total - 20) / 30) * 100), levelThreshold: 50 };
  if (total < 100) return { progress: calculateVisualProgress(((total - 50) / 50) * 100), levelThreshold: 100 };
  if (total < 200) return { progress: calculateVisualProgress(((total - 100) / 100) * 100), levelThreshold: 200 };
  return { progress: 100, levelThreshold: 200 };
};

const TotalWorkouts: React.FC = () => {
  const { user } = useAuth();
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);

  useEffect(() => {
    const fetchTotalWorkouts = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const total = docSnap.data().total || 0;
          setTotalWorkouts(total);
        }
      } else {
        setTotalWorkouts(0);
      }
    };

    fetchTotalWorkouts();
  }, [user]);

  const level = getLevel(totalWorkouts);
  const levelName = getLevelName(totalWorkouts);
  const { progress, levelThreshold } = getProgress(totalWorkouts);

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 md:p-6 rounded-xl shadow-lg relative max-w-md mx-auto w-3/5 md:w-full text-white">
      <div className="flex items-center mb-4 md:mb-6 space-x-2 md:space-x-4 w-full">
        <span className="text-4xl lg:text-6xl font-extrabold">{level}</span>
        <div className="flex-1 text-center md:text-left">
          <div className="flex justify-left items-center text-white">
            <span className="text-sm md:text-base lg:text-lg">Total Workouts</span>
            <span className="ml-1 md:ml-2 lg:ml-3 flex items-center bg-black bg-opacity-50 px-1 md:px-2 lg:px-3 py-1 rounded-full">🔥
              <span className="text-xs md:text-sm lg:text-md font-semibold ml-1">{totalWorkouts}</span>
            </span>
          </div>
          <div className="text-base md:text-lg lg:text-2xl font-bold flex justify-left mt-1 md:mt-2 text-yellow-300">
            {levelName}
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-6 md:h-5 lg:h-6 relative overflow-hidden">
        <div
          className="bg-green-400 h-full rounded-full flex items-center justify-center transition-all duration-300"
          style={{ width: `${progress}%` }}
        >
          <span className="text-xs md:text-sm lg:text-md font-semibold">
            XP {totalWorkouts} / {levelThreshold}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalWorkouts;
