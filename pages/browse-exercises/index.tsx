'use client';

import React, { useEffect } from 'react';
import Image from "next/image";
import Head from 'next/head';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import ImageGrid from '@/components/ImageGrid';
import { FormDefault } from '@/components/FormDefault';
import { useRouter } from 'next/router';
  
  const images: string[] = [
      "/musclegroups/cardio.png",
    "/musclegroups/abs.png",
    "/musclegroups/glutes.png",
    "/musclegroups/legs.png",
    "/musclegroups/calves.png",
    "/musclegroups/chest.png",
    "/musclegroups/back.png",
    "/musclegroups/neck.png",
    "/musclegroups/shoulder.png",
    "/musclegroups/triceps.png",
    "/musclegroups/biceps.png",
    "/musclegroups/forearm.png",
  ];



const BrowseExercises: React.FC = () => {
  const router = useRouter();

  const onBodyPartClick = (bodyPart: string) => {
    router.push(`/browse-exercises/${bodyPart}`);
  };

  return (
    <div className="inset-0 bg-[#efefef]">
    <Head>
        <title>Browse Exercises | FitGeniusApp</title>
        <meta name="description" content="Browse through 1350+ exercises, see instructional videos, search for specific exercises, and save your favorite exercises." />
        <meta name="keywords" content="fitness, exercises, workout, training, health, gym" />
        <meta property="og:title" content="Browse Exercises | FitGeniusApp" />
        <meta property="og:description" content="Browse through 1350+ exercises, see instructional videos, search for specific exercises, and save your favorite exercises." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.fitgeniusapp.com/browse-exercises" />
        <meta property="og:image" content="https://www.fitgeniusapp.com/fitgenius.png" />
        <link rel="canonical" href="https://www.fitgeniusapp.com/browse-exercises" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Browse Exercises",
            "description": "Browse through 1350+ exercises, see instructional videos, search for specific exercises, and save your favorite exercises.",
            "url": "https://www.fitgeniusapp.com/browse-exercises",
            "image": "https://www.fitgeniusapp.com/fitgenius.png"
          })}
        </script>
      </Head>
    <div className="relative w-full h-[35vh] sm:h-[35vh] md:h-[40vh] lg:h-[50vh]">
      {/* Image Container */}
      <div className="absolute inset-0 mt-10 sm:mt-10">
        <Image
          src="/funnyfitness.png"
          alt="Exercise Image"
          fill
          className="rounded-md object-cover"
        />
      </div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 " />
      {/* Heading Overlay */}
      <div className="absolute flex flex-col justify-center text-center mt-4 p-4 w-full h-full"  >
        <h1 className="text-white text-4xl  md:text-5xl lg:text-6xl font-extrabold mb-2 md:mb-4" style={{ textShadow: '0 0 10px rgba(0,0,0,1)'}}>
          Explore Exercises
        </h1>
        <p className="text-white text-sm md:text-xl lg:text-2xl leading-relaxed" style={{ textShadow: '0 0 10px rgba(0,0,0,1)'}}>
          Explore a diverse range from <span className="text-3xl lg:text-4xl" style={{ textShadow: '0 0 10px rgba(0,0,0,1)'}}>🏋️</span> lifting to <span className="text-2xl md:text-3xl lg:text-4xl" style={{ textShadow: '0 0 10px rgba(0,0,0,1)'}}>🚴</span> cycling
        </p>
      </div>
    </div>
    <div className=' w-full h-auto flex flex-row justify-center items-center space-x-10 p-1 bg-slate-200'>

    <p className="text-xs md:text-sm lg:text-lg font-semibold text-slate-500 text-center"><span className="text-red-500 text-lg md:text-xl lg:text-2xl">1300+</span><br />Exercises</p>
    <Separator orientation="vertical" className='bg-slate-300 h-8 '/>
        <p className="text-xs md:text-sm lg:text-lg font-semibold text-slate-500 text-center"><span className="text-red-500 text-lg md:text-xl lg:text-2xl">VIDEO</span><br />Tutorials</p>
        <Separator orientation="vertical" className='bg-slate-300 h-8 '/>
        <p className="text-xs md:text-sm lg:text-lg font-semibold text-slate-500 text-center"><span className="text-red-500 text-lg md:text-xl lg:text-2xl">SAVE</span><br />Favorites</p>

    </div>
    <div className="w-full flex flex-col items-center justify-center gap-0.5 mt-14 ">
    <h1 className="text-black text-xl md:text-2xl lg:text-4xl font-extrabold mb-2 md:mb-4">
          Search for your next exercise!
        </h1>
        <div className="relative w-full flex flex-col items-center">
        <FormDefault onSubmitCallback={onBodyPartClick} 
       />
    
    </div>
    </div>
   <ImageGrid  images={images} onBodyPartClick={onBodyPartClick}/>
 
  </div>
);
};

export default BrowseExercises;