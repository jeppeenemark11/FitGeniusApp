import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useTypewriter from '@/lib/useTypeWriter';


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

interface AiComponentProps {
    workouts: Workout[];
    loading: boolean;
    userTimeChoice: string;
}

const messages = [
    "Your workout plan is being created right now, and I'm excited to share it with you. Begin at a comfortable pace and gradually ramp up the intensity each week. Take 1 to 2 minutes to rest between sets. I can't wait to see your progress! 💪🏋️‍♂️",
    "I'm in the process of crafting your workout plan, and I can't wait for you to see it. Start slow and increase your intensity weekly. Remember to rest for 1 to 2 minutes between sets. Looking forward to your progress! 🏋️‍♂️🤸‍♂️",
    "Your workout plan is on the way, and I'm thrilled to present it to you. Begin with an easy intensity and gradually boost the intensity every week. Take 1-2 minute breaks between sets. Can't wait to see your progress! 🏋️‍♀️💪",
    "Currently, I'm putting together your workout plan and I’m excited for you to see it. Start with an easy intensity and up the intensity as you go. Rest for 1-2 minutes between sets. Eager to see your progress! 🤸‍♀️🏋️‍♂️",
    "I'm generating your workout plan now and can’t wait to share it with you. Start off easy and gradually increase the intensity each week. Take 1-2 minutes to rest between sets. Looking forward to seeing your progress! 💪🤼‍♂️",
    "Your workout plan is almost ready, and I’m excited for you to get started. Begin with a gentle pace and raise the intensity each week. Take 1 to 2 minutes to rest between sets. Can't wait to watch your progress! 🏋️‍♂️🤸‍♂️",
    "I'm preparing your workout plan and can’t wait to unveil it to you. Start slowly and build up the intensity every week. Rest for 1 to 2 minutes between sets. Excited to see your progress! 🏋️‍♀️💪",
    "Your workout plan is being finalized, and I can’t wait for you to see it. Begin with an easy pace and gradually intensify each week. Take a 1 to 2-minute rest between sets. Eager to see your progress! 🤼‍♂️🏋️‍♂️",
    "I'm working on your workout plan and am excited to show you soon. Start easy and steadily increase the intensity week by week. Rest for 1-2 minutes between sets. Looking forward to your progress! 🏋️‍♀️💪",
    "Your workout plan is coming together, and I can't wait to share it. Start at a comfortable level and increase the intensity each week. Take 1 to 2 minutes to rest between sets. Excited to see your progress! 🤸‍♀️🏋️‍♂️"
];

const AiComponent: React.FC<AiComponentProps> = ({workouts, loading, userTimeChoice}) => {
    const [done, setDone] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [randomMessage, setRandomMessage] = useState<string>('');

  const typewriterText = useTypewriter(randomMessage, 50, () => setDone(true));

    const router = useRouter();

    useEffect(() => {
        setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, []);

    const workoutEmojis = ['🔥', '🏃‍♂️', '💪', '🚴‍♀️', '🤸‍♂️', '🏋️‍♀️', '⛹️‍♂️', '🏊‍♀️', '🤼‍♀️'];
    const getRandomEmoji = () => workoutEmojis[Math.floor(Math.random() * workoutEmojis.length)];











    const closeModal = () => {
        setShowModal(false);
    };

    const handleWorkoutClick = (workout: Workout) => {
        setSelectedWorkout(workout);
        setShowModal(true);
    };

 return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-b from-purple-300 via-pink-300 to-red-200 overflow-auto pt-14">
            <div className="text-center w-full pt-4 pb-2">
            <div className="relative w-48 h-48 mx-auto">
            <Image src="/AIWizard.png" alt="AI Wizard" layout='fill' objectFit='contain' />
        </div>
                <h1 className="text-4xl font-bold text-red-700 mb-5 -mt-5">Your Results Are In<span className='align-middle text-2xl'>🧬</span></h1>
                <div className="flex justify-center w-full mb-10">
                    <div className="text-left max-w-3xl mx-auto pl-4 pr-4">
                        <p className="text-xl font-medium">
                            <span role="img" aria-label="wizard">🧙‍♂️</span> <strong>Wizard:</strong>
                        </p>
                        <p className="text-xl ml-8">{typewriterText}</p>
                    </div>
                </div>
            </div>
            {loading || !done ? (
                <div className="flex justify-center items-center flex-col mt-4">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
                    <p className="text-center text-gray-400 text-lg mt-3">Please stay on this page.</p>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-4 px-4 mb-4">
                    {workouts.map(workout => (
                        <div key={workout.name} className="bg-red-400 text-white rounded-xl shadow-lg hover:bg-red-500 hover:cursor-pointer transform hover:scale-105 transition-transform flex flex-col justify-between p-4 m-5" style={{ minWidth: '250px', maxWidth: '300px', height: '150px' }} onClick={() => handleWorkoutClick(workout)}>
                            <div className="mb-2">
                                <h3 className="text-2xl font-bold mb-1">{workout.name} {getRandomEmoji()}</h3>
                                <div className="flex items-center justify-between space-x-2 text-base mb-1" >
                                    
                                    <span> <span>⏳</span> {userTimeChoice}</span>
                                    <div className="flex items-center justify-center text-white py-1 px-3 rounded-xl text-lg" style={{ fontSize: '2.5rem' }}>
                                <span role="img" aria-label="robot" style={{ lineHeight: '1' }}>🤖</span>
                            </div>
                    
                                </div>
                            </div>
                           
                        </div>
                    ))}
                    <p className="w-full text-center mt-4 text-lg text-gray-700">Your workouts are saved to the Workouts page 🥳</p>
                    <button
                        onClick={() => router.push('/workouts')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-5"
                    >
                        Go to Workouts 🏄‍♂️
                    </button>
                    <p className="w-full text-center relative bottom-0 pb-2 bg-gradient-to-b from-transparent to-red-200 text-sm">
                        <strong>Please note:</strong> this AI assistant is not liable for any injuries you may sustain during your workout. Use the workouts at your own risk.
                    </p>
                </div>
            )}
       {showModal && selectedWorkout && (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center animate-fade-in">
        <div className="bg-gradient-to-br from-purple-600 to-blue-400 rounded-xl p-6 relative shadow-xl transition-all transform scale-95 hover:scale-100" style={{ width: '80%', maxWidth: '640px' }}>
            <button onClick={closeModal} className="absolute top-3 right-3 text-4xl text-white hover:text-red-700">&#x2715;</button>
            <h2 className="text-4xl font-bold text-center mb-5 text-white">{selectedWorkout.name}</h2>
            <div className="space-y-3">
                {selectedWorkout.exercises.map(exercise => (
                    <div key={exercise.id} className="flex items-center">
                        <span className="text-2xl mr-2">🏋️</span>
                        <p className="text-xl font-bold text-white">
                            {exercise.name} - <span className="font-normal">Sets: {exercise.sets}</span>
                        </p>
                    </div>
                ))}
            </div>
            <p className="mt-5 py-2 text-center italic text-white rounded bg-white bg-opacity-10">Created by the AI Workout Wizard</p>
        </div>
    </div>
)}
        </div>
    );
};

export default AiComponent;