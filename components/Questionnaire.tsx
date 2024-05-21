import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { createWorkoutInFirebase } from '@/lib/fromAPIobjectTOfirebase'
import { useAuth } from '@/context/AuthContext';
import { LuX } from "react-icons/lu";
import Link from 'next/link';
import { Button } from '@/components/ui/button';


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

interface QuestionnaireProps {
    setInProgress: (inProgress: boolean) => void;
    setLoading: (loading: boolean) => void;
    setWorkouts: (workouts: Workout[]) => void;
    setaiActivated: (aiActivated: boolean) => void;
    decrementaiLeft: () => void;
    setUserTimeChoice: (userTimeChoice: string) => void;
    

}

interface FormData {
    gender: string;
    age: string;
    experienceLevel: string;
    goal: string;
    daysPerWeek: string;
    workoutLength: string;
    style: string;
    focusArea: string;
}

interface OptionValues {
    [key: string]: string[];
}
interface LoginSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
const LoginSignupModal: React.FC<LoginSignupModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
        <div className="bg-white p-8 rounded-xl shadow-md">
        <LuX className='text-red-600 hover:scale-125' onClick={onClose}/>
          <h2 className="text-xl font-semibold mb-4 text-center text-black">Please log in</h2>
          <p className="mb-4 text-black" >You need to be logged in to use this feature.</p>
          <div className="flex justify-around space-x-4">
          <Link href="/login" passHref>
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-800 text-white rounded-xl">Log In</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-800 text-white rounded-xl">Sign Up</Button>
            </Link> </div>
        </div>
      </div>
    );
  };

const options: OptionValues = {
    gender: ['Male', 'Female'],
    age: Array.from({ length: 99 }, (_, i) => `${i + 1} years old`),
    experienceLevel: ['Beginner', 'Intermediate', 'Advanced'],
    goal: ['Weight Loss', 'Muscle Gain', 'Toning'],
    daysPerWeek: Array.from({ length: 7 }, (_, i) => `${i + 1} Days`),
    workoutLength: ['20-30 min', '30-45 min', '45-60 min', '60-75 min', '75-90 min'],
    style: ['Bodyweight Only', 'Equipment Inclusive', 'Mix of Both Bodyweight and Equipment'],
    focusArea: ['Cardio', 'Abs', 'Back', 'Chest', 'Glutes', 'Upper Legs', 'Lower Legs', 'Shoulders', 'Arms']
};

const Questionnaire: React.FC<QuestionnaireProps> = ({ setInProgress, setLoading, setWorkouts, setaiActivated, decrementaiLeft, setUserTimeChoice}) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        gender: '',
        age: '',
        experienceLevel: '',
        goal: '',
        daysPerWeek: '',
        workoutLength: '',
        style: '',
        focusArea: ''
    });
    const [errorFields, setErrorFields] = useState<string[]>([]);
    const { user } = useAuth();

    const handleSubmit = async () => {
        const requiredFields = ['gender', 'age', 'experienceLevel', 'goal', 'daysPerWeek', 'workoutLength', 'style'];
        const missingFields = requiredFields.filter(field => formData[field as keyof FormData] === '');
        
        if (missingFields.length > 0) {
            setErrorFields(missingFields);
            return;
        }

        if (!user) {
            setShowModal(true);
            return;
        }
        setInProgress(false);
        setaiActivated(true);

    try {
        const response = await fetch('https://us-central1-exercise-app-15021.cloudfunctions.net/longRunningTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput: JSON.stringify(formData) })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        setInProgress(false);
        setaiActivated(true);
        const data = await response.json();
 
    if (data.workouts && user){
  
           decrementaiLeft()
           createWorkoutInFirebase(data.workouts, user.uid)
            setWorkouts(data.workouts);
            setUserTimeChoice(formData.workoutLength);
           setLoading(false);
           
    }
    } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorFields(['API failed']);
        setInProgress(false);
    }
    };

    const formatLabel = (text: string) => {
        if (text === "focusArea") return "Focus Area (Optional)";
        return text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

   

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen w-full text-white">
            <div className="absolute top-20 lg:top-28 left-5">
                <button onClick={() => setInProgress(false)} className="text-white p-2 bg-red-500 rounded-full shadow-xl hover:bg-red-700 transition duration-200">
                    ←
                </button>
            </div>
            <div className="w-full max-w-4xl mx-auto mt-28 mb-20 md:mb-0 md:mt-0">
                <h2 className="text-2xl md:text-3xl font-bold text-center my-4 mr-2 ml-2">Customize Your Workout Plan</h2>
                <form className="grid grid-cols-2 gap-4 p-6 bg-white bg-opacity-20 backdrop-blur-md rounded-xl" onSubmit={e => e.preventDefault()}>
                {Object.keys(options).map((key, index, arr) => (
    <Listbox key={key} value={formData[key as keyof FormData]} onChange={(value: string) => setFormData({ ...formData, [key]: value })}>
        {({ open }) => (
        <>
            <Listbox.Label className="block text-sm font-medium text-white">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Listbox.Label>
            <div className={`relative mt-1 ${errorFields.includes(key) ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-black bg-opacity-30 rounded-xl shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 sm:text-sm">
                    {formData[key as keyof FormData] || `Select ${formatLabel(key)}`}
                </Listbox.Button>
                <Listbox.Options className={`absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-xl shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10 ${index === arr.length - 1 ? 'bottom-full mb-1' : ''}`}>
                    <Listbox.Option key="placeholder" value="" className="cursor-default select-none relative py-2 pl-10 pr-4 text-gray-500">
                        Select
                    </Listbox.Option>
                    {options[key].map((option: string) => (
                        <Listbox.Option key={option} value={option} className={({ active }) => `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'} cursor-default select-none relative py-2 pl-10 pr-2`}>
                            {({ selected, active }) => (
                            <>
                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{option}</span>
                                {selected && (
                                <span className={`${active ? 'text-amber-600' : 'text-amber-600'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                    ✓
                                </span>
                                )}
                            </>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </>
        )}
    </Listbox>
                    ))}
                    <div className="col-span-2">
                        <button type="submit" onClick={handleSubmit} className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition ease-in-out duration-300 transform hover:scale-105">
                        Send to the Workout Wizard ⭐
                        </button>
                    </div>
                </form>
            </div>
            <LoginSignupModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
    
};

export default Questionnaire;
