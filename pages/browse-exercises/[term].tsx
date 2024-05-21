import { useRouter } from 'next/router';
import React, {useState} from 'react';
import Head from 'next/head';
import { useExercises } from '@/context/ExerciseContext';
import SearchGrid from '@/components/SearchGrid';
import DetailedCard from '@/components/DetailedCard';
import { LuCornerUpLeft } from "react-icons/lu";



interface ExerciseForSearchGrid {
    id: string;
    name: string;
    bodyPart: string;
    gifUrl: string;
    secondaryMuscles: string[];
    instructions: string[];
  }
  
  // Mapping body parts to target muscle groups
  const bodyPartMapping: Record<string, string[]> = {
    cardio: ['cardiovascular system'],
    abs: ['abs'],
    glutes: ['glutes', 'abductors'],
    legs: ['quads', 'hamstrings', 'adductors'],
    calves: ['calves'],
    chest: ['pectorals'],
    back: ['lats', 'spine', 'upper back'],
    neck: ['levator scapulae', 'traps'],
    shoulder: ['serratus anterior', 'delts'],
    triceps: ['triceps'],
    biceps: ['biceps'],
    forearm: ['forearms'],
  };
  
  const ExercisesByTerm: React.FC = () => {
    const router = useRouter();
    const { term } = router.query;
    const { exercises, loading } = useExercises();
    const [ currentExercise, setCurrentExercise ] = useState<ExerciseForSearchGrid | null>(null);
    const [ scrollToBottom, setScrollToBottom ] = useState(false);
  
    const handleClose = () => {
        setCurrentExercise(null);
        setScrollToBottom(false);
    };

    const onClickBack = () => {
      router.push(`/browse-exercises`);
    };

    if (loading) {
      return <div className='h-screen'>Loading exercises...</div>;
    }
  
    if (!term || !exercises) {
      return <div className='h-screen'>No exercises found.</div>;
    }
  
    const lowerTerm = (term as string).toLowerCase();
    let filteredExercises = [];
  
    // Check if the term matches any body part categories
    if (bodyPartMapping[lowerTerm]) {
      const targets = bodyPartMapping[lowerTerm];
  
      // Filter by matching target muscles
      filteredExercises = exercises.filter((exercise) =>
        targets.some((target) => exercise.target?.toLowerCase().includes(target))
      );
    } else {
      // Perform a comprehensive search across multiple fields, with null checking
      filteredExercises = exercises.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(lowerTerm) ||
          exercise.bodyPart?.toLowerCase().includes(lowerTerm) ||
          exercise.target?.toLowerCase().includes(lowerTerm) ||
          exercise.equipment?.toLowerCase().includes(lowerTerm) ||
          String(exercise.id).toLowerCase().includes(lowerTerm)
      ).slice(0, 100);
    }

  
    // Map the filtered results to conform to the ExerciseForSearchGrid interface
    const exercisesForSearchGrid: ExerciseForSearchGrid[] = filteredExercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart ?? 'Unknown',
      gifUrl: exercise.gifUrl ?? '',
      secondaryMuscles: exercise.secondaryMuscles ?? [],
      instructions: exercise.instructions ?? [],
    }));
  
    return (
      <div className="container mx-auto p-4 pt-20 items-center">
        <Head>
        <title>{term} Exercises | FitGeniusApp</title>
        <meta name="description" content={`Discover the best ${term} exercises with detailed instructions and videos on FitGeniusApp.`} />
        <meta name="keywords" content={`${term}, fitness, exercises, workout, training, health, gym`} />
        <meta property="og:title" content={`${term} Exercises | FitGeniusApp`} />
        <meta property="og:description" content={`Discover the best ${term} exercises with detailed instructions and videos on FitGeniusApp.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.fitgeniusapp.com/${term}`} />
        <meta property="og:image" content="https://www.fitgeniusapp.com/fitgenius.png" />
        <link rel="canonical" href={`https://www.fitgeniusapp.com/${term}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${term} Exercises`,
            "description": `Discover the best ${term} exercises with detailed instructions and videos on FitGeniusApp.`,
            "url": `https://www.fitgeniusapp.com/${term}`,
            "image": "https://www.fitgeniusapp.com/fitgenius.png"
          })}
        </script>
      </Head>
        <LuCornerUpLeft onClick={onClickBack} size={30} color="red" className="hover:cursor-pointer absolute text-center flex justify-center items-center hover:scale-125"/>
       <h1 className="text-3xl font-bold mb-6 text-center flex justify-center items-center space-x-2">
  <span>Exercises for {term}</span>
  <span className="text-4xl">🏋️</span>
</h1>
        <ul className="list-disc ">
          {exercisesForSearchGrid.length > 0 ? (
            <SearchGrid search={exercisesForSearchGrid} setCurrentExercise={setCurrentExercise} setScrollToBottom={setScrollToBottom}/>
          ) : (
            <li className='h-screen'>No exercises found for this category.</li>
          )}
        </ul>
        {currentExercise && <DetailedCard 
        name={currentExercise.name}
        bodyPart={currentExercise.bodyPart} 
        gifUrl={currentExercise.gifUrl}
        secondaryMuscles={currentExercise.secondaryMuscles} 
        instructions={currentExercise.instructions} 
        closeDetailedCard={handleClose}
        scrollToBottom={scrollToBottom}
        />}
      </div>
    );
  };
  
  export default ExercisesByTerm;