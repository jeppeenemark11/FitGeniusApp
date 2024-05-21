import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useExercises } from '@/context/ExerciseContext';
import SearchGrid from '@/components/SearchGrid';
import DetailedCard from '@/components/DetailedCard';
import { LuCornerUpLeft } from 'react-icons/lu';
import Head from 'next/head';

// Interface for exercises
interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

const FavoritesPage = () => {
  const { user, getFavoriteExercises } = useAuth();
  const { exercises, loading: loadingExercises } = useExercises();
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  // Handle closing the detailed card
  const handleClose = () => {
    setCurrentExercise(null);
    setScrollToBottom(false);
  };

  // Fetch user's favorite exercises
  useEffect(() => {
    const fetchFavorites = async () => {
      if (loadingExercises || !exercises) return;

      const favoriteIds = await getFavoriteExercises();

      // Filter and map the favorite exercises from the main list
      const matchedFavorites = exercises
        .filter(exercise => favoriteIds.includes(exercise.id))
        .map(({ id, name, bodyPart = '', gifUrl = '', secondaryMuscles = [], instructions = [] }) => ({
          id,
          name,
          bodyPart,
          gifUrl,
          secondaryMuscles,
          instructions
        }));

      setFavoriteExercises(matchedFavorites);
      setIsLoading(false);
    };

    fetchFavorites();
  }, [user, getFavoriteExercises, exercises, loadingExercises]);

  if (isLoading || loadingExercises) return <div className='h-screen items-center text-center flex justify-center'><p>Loading...</p></div>;


  return (
    <div className="container mx-auto p-4 pt-20 h-screen">
      <Head>
        <title>Favorite Exercises | FitGeniusApp</title>
        </Head>
      <h1 className="text-3xl font-bold mb-6 text-center flex justify-center items-center space-x-2">
        <span>Favorites</span>
        <span className="text-4xl">❤️</span>
      </h1>
      {favoriteExercises.length > 0 ? (
        <SearchGrid
          search={favoriteExercises}
          setCurrentExercise={setCurrentExercise}
          setScrollToBottom={setScrollToBottom}
        />
      ) : (
        <p className="text-center text-xl font-semibold">No favorite exercises found.</p>
      )}
      {currentExercise && (
        <DetailedCard
          name={currentExercise.name}
          bodyPart={currentExercise.bodyPart}
          gifUrl={currentExercise.gifUrl}
          secondaryMuscles={currentExercise.secondaryMuscles}
          instructions={currentExercise.instructions}
          closeDetailedCard={handleClose}
          scrollToBottom={scrollToBottom}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
