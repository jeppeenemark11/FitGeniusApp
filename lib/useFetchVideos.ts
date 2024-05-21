import { useState } from 'react';

export interface Video {
    videoId: string;
}

export const useFetchVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchVideos = async (query: string) => {
        if (!query) return; 

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/youtube?q=${query}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Failed to load data');

            const videoObjects = data.videoIds.map((videoId: string) => ({ videoId }));
            setVideos(videoObjects); 

        } catch (err: any) {
            setError(err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        videos,
        loading,
        error,
        fetchVideos
    };
};
