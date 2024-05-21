import React from 'react';

import { CardDemo } from './CardDemo';

interface Exercise {
    id: string;
    name: string;
    bodyPart: string;
    gifUrl: string;
    secondaryMuscles: string[];
    instructions: string[];
}

interface SearchGridProps {
    search: Exercise[];
    setCurrentExercise: (exercise: Exercise | null) => void;
    setScrollToBottom: (bool: boolean) => void;
}

const SearchGrid: React.FC<SearchGridProps> = ({ search, setCurrentExercise, setScrollToBottom}) => {

    return (
        <div className="flex justify-center items-center m-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {search.map((object, index) => (
                 <CardDemo exercise={object} key={index} onSelect={setCurrentExercise} setScrollToBottom={setScrollToBottom} />

                
            ))}
        </div>
        </div>
    );
};

export default SearchGrid;