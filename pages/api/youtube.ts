import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface Thumbnail {
    height: number;
    url: string;
    width: number;
}

interface Video {
    channelId: string;
    channelName: string;
    description: string;
    lengthText: string;
    publishedTimeText: string;
    thumbnails: Thumbnail[];
    title: string;
    videoId: string;
    viewCountText: string;
}

interface VideoContainer {
    video: Video;
}

interface ApiResponse {
    contents: VideoContainer[];
    estimatedResults: string;
    next: string;
}

interface ErrorResponse {
    message: string;
    details?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ videoIds: string[] } | ErrorResponse>
) {
    const query = req.query.q as string;
    if (!query) {
        res.status(400).json({ message: 'Query parameter is required' });
        return;
    }

    try {
        const { data } = await axios.request<ApiResponse>({
            method: 'GET',
            url: 'https://youtube-search-and-download.p.rapidapi.com/search',
            params: { query: query, hl: 'en', gl: 'US', type: 'v', duration: 's', sort: 'r' },
            headers: {
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
            }
        });

        // Checking if we have at least two videos to return their IDs
        if (data.contents.length >= 2) {
            const videoIds = data.contents.slice(0, 2).map(container => container.video.videoId);
            res.status(200).json({ videoIds });
        } else {
            res.status(404).json({ message: 'Not enough videos found.' });
        }
    } catch (error: any) {
        console.error('Failed to fetch videos:', error);
        res.status(500).json({ message: 'Failed to fetch videos', details: error.message });
    }
}
