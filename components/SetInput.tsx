import { useState, useEffect } from 'react';

interface SetData {
  weight?: number;
  reps?: number;
  time?: string;
}

interface SetInputProps {
  set: SetData;
  index: number;
  onUpdate: (index: number, updatedSet: SetData) => void;
}

const SetInput: React.FC<SetInputProps> = ({ set, index, onUpdate }) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timeInputValue, setTimeInputValue] = useState<string>(set.time || '');
  const [weightInputValue, setWeightInputValue] = useState<string>(set.weight?.toString() || '');
  const [repsInputValue, setRepsInputValue] = useState<string>(set.reps?.toString() || '');

  useEffect(() => {
    setTimeInputValue(formatTime(set.time));
    setWeightInputValue(set.weight?.toString() || '');
    setRepsInputValue(set.reps?.toString() || '');
  }, [set]);

  const formatTime = (inputTime: string | undefined): string => {
    const nums = (inputTime || '').replace(/\D/g, '').substring(0, 6);
    return nums.split('').reduce((acc, curr, idx) => {
      if (idx !== 0 && idx % 2 === 0) acc += ':';
      return acc + curr;
    }, '');
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedTime = formatTime(event.target.value);
    setTimeInputValue(formattedTime);
    onUpdate(index, { ...set, time: formattedTime });
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const weight = event.target.value;
    setWeightInputValue(weight);
    onUpdate(index, { ...set, weight: weight ? Number(weight) : undefined });
  };

  const handleRepsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reps = event.target.value;
    setRepsInputValue(reps);
    onUpdate(index, { ...set, reps: reps ? Number(reps) : undefined });
  };

  return (
    <div className={`transition duration-500 ease-in-out transform ${isCompleted ? 'bg-red-300' : 'bg-white'} p-3 rounded-xl flex items-center justify-between hover:shadow-md space-x-2 md:space-x-4`}>
      <span className="text-sm md:text-lg font-semibold">{index + 1}🏋️</span>
      {set.time !== undefined ? (
        <div className="flex items-center">
          <span className='mr-1 md:mr-2'>⏱</span>
          <input
            type="text"
            placeholder="hh:mm:ss"
            value={timeInputValue}
            onChange={handleTimeChange}
            className="appearance-none bg-transparent border-b-2 border-red-500 text-red-500 text-sm md:text-lg font-semibold w-16 md:w-32 text-center rounded-xl"
          />
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <span className='mr-1 md:mr-2'>⚖️</span>
            <input
              type="number"
              placeholder="Weight"
              value={weightInputValue}
              onChange={handleWeightChange}
              className="appearance-none bg-transparent border-b-2 border-red-300 p-1 md:p-2 text-red-500 text-sm md:text-lg font-semibold w-16 md:w-24 text-center rounded-xl"
            />
          </div>
          <div className="flex items-center">
            <span className='mr-1 md:mr-2'>🔢</span>
            <input
              type="number"
              placeholder="Reps"
              value={repsInputValue}
              onChange={handleRepsChange}
              className="appearance-none bg-transparent border-b-2 border-red-300 p-1 md:p-2 text-red-500 text-sm md:text-lg font-semibold w-16 md:w-24 text-center rounded-xl"
            />
          </div>
        </>
      )}
      <button onClick={() => setIsCompleted(!isCompleted)} className={`p-1 md:p-2 ${isCompleted ? 'bg-red-500' : 'bg-green-500'} text-white rounded-xl hover:bg-${isCompleted ? 'red' : 'green'}-600 transition duration-300`}>
        <span className='text-sm md:text-md'>{isCompleted ? '✓ Completed' : 'Mark as Complete'}</span>
      </button>
    </div>
  );
};

export default SetInput;
