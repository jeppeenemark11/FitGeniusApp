import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';


interface Exercise {
    id: string;
    name: string;
    bodyPart: string;
    gifUrl: string;
    secondaryMuscles: string[];
    instructions: string[];
    target: string;
    equipment: string;
}


interface ErrorResponse {
    message: string;
    details?: string;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Exercise[] | ErrorResponse>
) {

    try {
        const { data } = await axios.request<Exercise[]>({
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',
            params: {limit: '-1'},
            headers: {
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        });
   
        res.status(200).json(data);
    } catch (error: any) { 
        console.error('Error fetching exercises:', error);

        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message: 'Failed to fetch exercises', details: errorMessage });
    }
}
