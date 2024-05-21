import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LuX } from "react-icons/lu";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  gifUrl: string;
  secondaryMuscles: string[];
  instructions: string[];
}

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  exercise: Exercise;
  onSelect: (exercise: Exercise, section?: 'instructions' | 'video') => void;
  setScrollToBottom: (bool: boolean) => void;
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
        <h2 className="text-xl font-semibold mb-4 text-center">Please log in</h2>
        <p className="mb-4">You need to be logged in to use this feature.</p>
        <div className="flex justify-around space-x-4">
        <Link href="/login" passHref>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-800 text-white rounded-xl">Log In</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-800 text-white rounded-xl">Sign Up</Button>
          </Link></div>
      </div>
    </div>
  );
};

export const CardDemo: React.FC<CardProps> = ({ className, exercise, onSelect, setScrollToBottom, ...props }) => {
  const { user, addFavoriteExercise, removeFavoriteExercise, getFavoriteExercises } = useAuth();
  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const favoriteIds = await getFavoriteExercises();
        setLiked(favoriteIds.includes(exercise.id));
      }
    };
    checkFavoriteStatus();
  }, [user, exercise.id, getFavoriteExercises]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      if (!liked) {
        await addFavoriteExercise(exercise.id);
      } else {
        await removeFavoriteExercise(exercise.id);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  return (
    <>
      <Card
        onClick={() => onSelect(exercise)}
        className={cn('hover:cursor-pointer flex flex-col aspect-w-1 aspect-h-1 w-full bg-white shadow-lg hover:shadow-xl rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out', className)}
        {...props}
      >
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-bold text-center">{exercise.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center p-4 grow">
          <div className="relative w-full" style={{ paddingBottom: '100%', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <Image src={exercise.gifUrl} unoptimized={true} fill objectFit="cover" alt={exercise.name} />
          </div>
          <div className="text-left w-full mt-4 flex justify-between items-center">
            <div className="bg-blue-100 text-blue-800 font-semibold rounded-full px-3 py-1 inline-block">
              💪 Body Part: {exercise.bodyPart}
            </div>
            <button onClick={toggleLike} aria-label="Toggle Like">
              {liked ? <AiFillHeart className="text-red-500 text-2xl" /> : <AiOutlineHeart className="text-gray-500 text-2xl" />}
            </button>
          </div>
          {exercise.secondaryMuscles.length > 0 && (
            <div className="text-gray-600 mt-2 w-full ">
              <span className='font-bold'>🏋️ Secondary Muscles: </span>
              <ul className="list-disc list-inside">
                {exercise.secondaryMuscles.map(muscle => (
                  <li key={muscle} className="ml-6">{muscle}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="mt-auto p-4 flex justify-around">
          <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl" onClick={(e) => { e.stopPropagation(); onSelect(exercise, 'instructions'); }}>Instructions</Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl" onClick={(e) => { e.stopPropagation(); onSelect(exercise, 'video'); setScrollToBottom(true); }}>Video</Button>
        </CardFooter>
      </Card>

      <LoginSignupModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default CardDemo;
