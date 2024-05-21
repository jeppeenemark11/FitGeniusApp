import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useFetchVideos } from '@/lib/useFetchVideos';



interface DetailedCardProps {
    name: string;
    bodyPart: string;
    gifUrl: string;
    secondaryMuscles: string[];
    instructions: string[];
    closeDetailedCard: () => void;
    scrollToBottom: boolean;
}

export const DetailedCard: React.FC<DetailedCardProps> = ({
    name,
    bodyPart,
    gifUrl,
    secondaryMuscles,
    instructions,
    closeDetailedCard,
    scrollToBottom
}) => {
    const cardContentRef = useRef<HTMLDivElement>(null);
    const { videos, loading, error, fetchVideos } = useFetchVideos();
    const [prevName, setPrevName] = useState<string | null>(null);
  
        useEffect(() => {
            if (scrollToBottom && cardContentRef.current) {
                setTimeout(() => {
                    cardContentRef.current?.scrollIntoView({ behavior: 'smooth' });
            
                }, 1200); 
            }
            if (name !== prevName) {
                fetchVideos(name);
                setPrevName(name);
            }
        return () => {
            console.log('Cleaning up resources');
        };
    }, [fetchVideos, name, prevName, scrollToBottom]);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50">
            <Card className="flex flex-col w-full max-w-4xl bg-white shadow-xl rounded-xl transform transition duration-300 ease-in-out max-h-[95%] ">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl text-center">
                    <CardTitle className="text-2xl md:text-3xl font-bold">{name}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto p-4 text-left" style={{ maxHeight: '75vh' }}>
                    <div className="flex flex-col md:flex-row md:items-stretch gap-4">
                        <Image src={gifUrl} alt={name} className="rounded-xl shadow-md"width={400} height={400} unoptimized={true} />
                        <div className="flex-grow flex flex-col justify-between">
                            <div className="bg-blue-100 text-blue-800 font-semibold rounded-full px-3 py-1 inline-block mb-2">
                                💪 Body Part: {bodyPart}
                            </div>
                            {secondaryMuscles.length > 0 && (
                                <div className="text-gray-700 mt-2">
                                    🏋️ <span className="font-semibold">Secondary Muscles:</span>
                                    <ul className="list-disc list-inside pl-5">
                                        {secondaryMuscles.map(muscle => (
                                            <li key={muscle}>{muscle}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {instructions.length > 0 && (
                                <div className="text-gray-700 mt-4">
                                    🔱 <span className="font-semibold">Instructions:</span>
                                    <ol className="pl-5 space-y-2 mt-2">
                                        {instructions.map((instruction, index) => (
                                            <li key={index} className="bg-gray-100 rounded-md p-1 shadow text-sm font-medium">
                                                <span className="font-bold">Step {index + 1}: </span>{instruction}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="mt-4 mb-2 text-xl font-semibold text-center" >Instructional Videos</h3>
                    <div className="flex flex-wrap justify-center gap-4" ref={cardContentRef}>
                        {videos.map((video, index) => (
                            <>
                            
                            <VideoThumbnail key={index} videoId={video.videoId} name={name} />
                            </>
                        ))}
                        {videos.length === 0 && (
                            <p className="text-gray-700 text-center">No videos found for this exercise</p>
                        )}
                    </div>
                   
                </CardContent>
                <CardFooter className="bg-gray-100 p-4 rounded-b-xl flex justify-end" >
                    
                    <Button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300" onClick={closeDetailedCard}>Close</Button>
                </CardFooter>
            
            </Card>
        </div>
    );
}
interface VideoThumbnailProps {
    videoId: string;
    name: string;
}

// VideoThumbnail Component for lazy loading videos
const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoId, name }) => {
    const [loadVideo, setLoadVideo] = useState(false);

    const handleThumbnailClick = () => {
        setLoadVideo(true);
    };

    return (
        <div className="relative cursor-pointer border-2 border-black rounded-xl overflow-hidden" style={{ width: '320px', height: '180px' }} onClick={handleThumbnailClick}>
        {!loadVideo ? (
            <>
                <Image
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={`Thumbnail for ${name}`}
                    fill
                    objectFit="cover"  
                    objectPosition="center"  
                    unoptimized={true}
                    className="opacity-90"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                    <svg className="w-12 h-12 text-youtube-red" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11.75l6 3.75-6 3.75V6.25z" clipRule="evenodd" />
                    </svg>
                </div>
                </>
            ) : (
                <iframe
                    width="320"
                    height="180"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video for ${name}`}
                ></iframe>
            )}
        </div>
    );
};

export default DetailedCard;
