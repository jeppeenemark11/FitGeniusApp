import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';

import WorkoutWizard from '@/components/WorkoutWizard';


interface FormState {
  gender: string;
  age: string;
  experienceLevel: string;
  goal: string;
  daysPerWeek: string;
  workoutLength: string;
  style: string;
  focusArea?: string;
}

const defaultFormState: FormState = {
  gender: '',
  age: '',
  experienceLevel: '',
  goal: '',
  daysPerWeek: '',
  workoutLength: '',
  style: '',
  focusArea: ''
};


const Workouts: React.FC = () => {
    const { user } = useAuth();
  const [inProgress, setInProgress] = useState(false);
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [triesLeft, setTriesLeft] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div>
      <Head>
        <title>AI Workout Creator | FitGeniusApp</title>
        <meta name="description" content="Get a personalized workout plan tailored to your goals and preferences with our AI Workout Creator. Answer a few questions and start your fitness journey today!" />
        <meta name="keywords" content="AI workout, custom workout, fitness plan, personalized workout, fitness AI, AI workout generator, free workout plan" />
        <meta property="og:title" content="AI Workout Creator | FitGeniusApp" />
        <meta property="og:description" content="Get a personalized workout plan tailored to your goals and preferences with our AI Workout Creator. Answer a few questions and start your fitness journey today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.fitgeniusapp.com/AIWizard.png" />
        <meta property="og:image" content="https://www.fitgeniusapp.com/fitgenius.png" />
        <link rel="canonical" href="https://www.fitgeniusapp.com/ai-workout-wizard" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AI Workout Creator",
            "description": "Get a personalized workout plan tailored to your goals and preferences with our AI Workout Creator. Answer a few questions and start your fitness journey today!",
            "url": "https://www.fitgeniusapp.com/ai-workout-wizard",
            "image": "https://www.fitgeniusapp.com/fitgenius.png"
          })}
        </script>
      </Head>
        <WorkoutWizard />
    </div>
  );

}

export default Workouts;

