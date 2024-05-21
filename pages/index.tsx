import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import useTypewriter from '@/lib/useTypeWriter';
import TotalWorkouts from '@/components/TotalWorkouts';
 
const Landing: React.FC = () => {
  // to write out real time
  const typewriterText = useTypewriter('Browse instructional videos, create custom workouts, track your progress, and get help from the AI workout wizard.');

  return (
    <div className="bg-gray-100">
      <Head>
        <title>FitGeniusApp | AI-Powered Fitness and Workouts</title>
        <meta name="description" content="FitGeniusApp offers AI-powered fitness solutions, including personalized workout plans, a vast library of exercise videos, and tools to create and track custom workouts. Start your fitness journey today!" />
        <meta name="keywords" content="fitness, AI workout, custom workout, exercise videos, workout tracker, personalized fitness plan, fitness app, exercise library, workout plan, progress tracker" />
        <meta property="og:title" content="FitGeniusApp | AI Workouts, Custom Plans, and Exercise Tracking" />
        <meta property="og:description" content="FitGeniusApp offers AI-powered fitness solutions, including personalized workout plans, a vast library of exercise videos, and tools to create and track custom workouts. Start your fitness journey today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.fitgeniusapp.com" />
        <meta property="og:image" content="https://www.fitgeniusapp.com/fitgenius.png" />
        <link rel="canonical" href="https://www.fitgeniusapp.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "FitGeniusApp",
            "description": "FitGeniusApp offers AI-powered fitness solutions, including personalized workout plans, a vast library of exercise videos, and tools to create and track custom workouts. Start your fitness journey today!",
            "url": "https://www.fitgeniusapp.com",
            "image": "https://www.fitgeniusapp.com/fitgenius.png"
          })}
        </script>
      </Head>

     {/* Header Section */}
     <section className="relative h-screen flex flex-col items-center justify-center text-center bg-gray-100">
    
          <TotalWorkouts />
      
        <div className="relative text-gray-800 z-10 p-4 text-center">
         
 
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center">Fitness Made Fun 💪</h1>
          <p className="text-lg md:text-2xl mb-8 pl-4 pr-4 text-center">{typewriterText}</p>
          <div className="flex justify-center space-x-8">
            <Link href="#browse-exercises" passHref legacyBehavior>
              <a className="flex flex-col items-center w-28 md:w-48 transition-transform transform hover:scale-110">
                <div className="w-28 h-28 md:w-48 md:h-48 ">
                  <Image src="/landingpage/browse.gif" alt="Browse" layout="fill" objectFit="contain" className="rounded-full" />
                </div>
                <span className="mt-20 md:mt-6 text-blue-600 text-xl font-bold text-center">Browse Exercises</span>
              </a>
            </Link>
            <Link href="#create-workouts" passHref legacyBehavior>
              <a className="flex flex-col items-center w-28 md:w-48 transition-transform transform hover:scale-110">
                <div className="w-28 h-28 md:w-48 md:h-48">
                  <Image src="/landingpage/workout.png" alt="Create" layout="fill" objectFit="contain" className="rounded-full" />
                </div>
                <span className="mt-20 md:mt-6 text-purple-600 text-xl font-bold text-center">Create Workouts</span>
              </a>
            </Link>
            <Link href="#ai-workout-creator" passHref legacyBehavior>
              <a className="flex flex-col items-center w-28 md:w-48 transition-transform transform hover:scale-110">
                <div className="w-28 h-28 md:w-48 md:h-48 ">
                  <Image src="/landingpage/AI.png" alt="AI" layout="fill" objectFit="contain" className="rounded-full" />
                </div>
                <span className="mt-20 md:mt-6 text-pink-600 text-xl font-bold text-center">AI Workout Creator</span>
              </a>
            </Link>
          </div>
        </div>
      </section>


   {/* Browse Exercises Section */}
<section id="browse-exercises" className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-8 text-center">
  <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4 text-center">Browse Exercises 🏋️</h2>
  <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-2xl">
    Explore a wide range of exercises with detailed instructions and videos. From weightlifting to cardio, find the perfect exercises for you.
  </p>
  <div className="relative w-80 h-80 mb-8">
    <Image src="/LandingPageItems/browsing.gif" alt="Browse Exercises" layout="fill" objectFit="contain"  />
  </div>
  <Link href="/browse-exercises" passHref legacyBehavior>
    <a className="bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-bold hover:bg-blue-700 transition text-center">Explore Now</a>
  </Link>
</section>

   {/* Create Workouts Section */}
<section id="create-workouts" className="min-h-screen flex flex-col items-center justify-center bg-purple-50 p-8">
  <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-4 text-center">Create Workouts 🏋️‍♀️</h2>
  <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-2xl">
    Create your own workout plans. Track your progress and stay motivated with our easy-to-use workout creator.
  </p>
  <div className="flex space-x-4 mb-8">
    <div className="relative w-52 h-52 md:w-80 md:h-80">
      <Image src="/LandingPageItems/workout1.png" alt="Workout 1" layout="fill" objectFit="contain" />
    </div>
    <div className="relative w-52 h-52 md:w-80 md:h-80">
      <Image src="/LandingPageItems/workout2.png" alt="Workout 2" layout="fill" objectFit="contain" />
    </div>
  </div>
  <Link href="/workouts" passHref legacyBehavior>
    <a className="bg-red-600 text-white py-3 px-6 rounded-full text-lg font-bold hover:bg-red-700 transition">Start Creating</a>
  </Link>
</section>


      {/* AI Workout Creator Section */}
<section id="ai-workout-creator" className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-8">
  <h2 className="text-4xl md:text-5xl font-bold text-purple-600 mb-4 text-center">AI Workout Creator 🤖</h2>
  <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-2xl">
    Let our AI design a personalized workout plan just for you. Answer a few questions and get started on your fitness journey.
  </p>
  <div className="relative w-80 h-80 mb-8">
    <Image src="/LandingPageItems/AI.png" alt="AI Workout Creator" layout="fill" objectFit="contain"  />
  </div>
  <Link href="/ai-workout-wizard" passHref legacyBehavior>
    <a className="bg-purple-600 text-white py-3 px-6 rounded-full text-lg font-bold hover:bg-purple-700 transition">Get Started</a>
  </Link>
</section>


      {/* Reviews Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">What Our Users Say 💬</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <img src="/profilePictures/person1.jpg" alt="User 1" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="text-lg font-bold">Jake Doe</h4>
                <p className="text-gray-600">Fitness Enthusiast</p>
              </div>
            </div>
            <p className="text-gray-700 text-center">{'"'}This platform has transformed my workout routine. The AI suggestions are much fun!{'"'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <img src="/profilePictures/person2.jpg" alt="User 2" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="text-lg font-bold">Katherine Smith</h4>
                <p className="text-gray-600">Gym Regular</p>
              </div>
            </div>
            <p className="text-gray-700 text-center">{'"'}Creating custom workouts has never been easier. Highly recommend this site!{'"'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <img src="/profilePictures/person3.jpg" alt="User 3" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h4 className="text-lg font-bold">Emil Johnson</h4>
                <p className="text-gray-600">Yoga Practitioner</p>
              </div>
            </div>
            <p className="text-gray-700 text-center">{'"'}I love the variety of exercises available. There{"'"}s something for everyone.{'"'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
