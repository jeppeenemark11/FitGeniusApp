import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import AuthPromptCard from '@/components/AuthPromtCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { format } from 'date-fns';
import Head from 'next/head';

interface HistoryItem {
  id: string;
  date: any; 
  name: string;
  time: string; 
  workoutNum: number;
}


const workoutEmojis = ['🔥', '🏃‍♂️', '💪', '🚴‍♀️', '🤸‍♂️', '🏋️‍♀️', '⛹️‍♂️', '🏊‍♀️', '🤼‍♀️'];
const getRandomEmoji = () => workoutEmojis[Math.floor(Math.random() * workoutEmojis.length)];

const WorkoutHistory: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (loading) return; 

    const fetchHistory = async () => {
      if (user) {
        const historyRef = collection(db, 'users', user.uid, 'history');
        const querySnapshot = await getDocs(historyRef);
        if (!querySnapshot.empty) {
          let historyData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            date: doc.data().date.toDate(), 
            name: doc.data().name,
            time: formatTime(doc.data().time), 
            workoutNum: doc.data().workoutNum
          }));
          historyData = historyData.sort((a, b) => b.workoutNum - a.workoutNum);

          setHistory(historyData);
        } else {
          setHistory([]);
        }
      }
    };

    fetchHistory();
  }, [user, loading]);

  useEffect(() => {
    if (router.query.success) {
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        router.replace('/workout-history', undefined, { shallow: true });
      }, 3000);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="text-xl font-semibold">Loading your workout history...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 pt-24">
       <Head>
        <title>Workout History | FitGeniusApp</title>
        </Head>
      {user ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-700 mb-6">Your Workout History 🏋️</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {history.map((item, index) => (
              <div key={item.id} className="bg-red-600 p-6 rounded-xl shadow-lg transform hover:scale-110 transition duration-500 ease-out hover:shadow-xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-75 transition duration-500 hover:opacity-85"></div>
                <div className="absolute top-0 right-0 bg-white text-red-600 p-2 rounded-bl-xl text-lg">Workout {item.workoutNum}</div>
                <h2 className="text-2xl font-bold z-10 relative">{item.name}</h2>
                <p className="text-lg z-10 relative"><span role="img" aria-label="calendar">📅</span> {format(item.date, 'MMM do yyyy \'at\' h:mm a')}</p>
                <p className="text-lg z-10 relative"><span role="img" aria-label="timer">⏱</span> {item.time}</p>
                <div className="text-right z-10 relative">
                  <span className="text-6xl">{getRandomEmoji()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AuthPromptCard />
      )}
      {showAlert && (
       <div className="fixed top-5 left-1/2 transform -translate-x-1/2 pt-24">
       <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg animate-pulse max-w-md text-center">
           🎉 Congratulations on completing your workout! 🏋️‍♂️
       </div>
   </div>
      )}
    </div>
  );
}

// Helper function to format time from "hh:mm:ss" to a more readable format
function formatTime(timeStr: string): string {
  if (!timeStr) return ""; 
  const parts = timeStr.split(':').map(part => parseInt(part, 10));
  const hours = parts[0];
  const minutes = parts[1];
  const seconds = parts[2];
  
  return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${seconds ? `${seconds}s` : ''}`.trim();
}

export default WorkoutHistory;
