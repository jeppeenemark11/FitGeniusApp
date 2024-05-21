import React, {useState, useEffect} from 'react';
import { getVisitorCount} from '@/lib/visitors'
import Head from 'next/head';

const RunAds: React.FC = () => {
    const [visitorCount7d, setVisitorCount7d] = useState<number | null>(null);
    useEffect(() => {
        
        // Fetch the visitor count for the last 24 hours
        const fetchVisitorCounts = async () => {
          const count24h = await getVisitorCount(24 * 60 * 60 * 1000 * 7); // 24 hours * 7
     
    
          setVisitorCount7d(count24h);
        
        };
    
        fetchVisitorCounts();
      }, []);
    


  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
       <Head>
        <title>Ads | FitGeniusApp</title>
        </Head>
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Advertise with FitGenius</h1>
        <div className="text-center my-8">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl shadow-md">
            <p className="text-5xl font-bold">{visitorCount7d === null ? 'Loading...' : visitorCount7d}</p>
          </div>
          <p className="text-xl font-medium text-gray-600 mt-4">unique page visitors in the past 7 days</p>
        </div>
        <p className="text-gray-700 text-lg mb-6 text-center">
        FitGenius is positioned as an ideal platform for promoting your products or services. If you want to reach a wide and engaged audience, consider advertising with us.</p>
        <p className="text-gray-700 text-lg mb-6 text-center">
          To promote your product or service on our page, please contact us at:
        </p>
        <p className="text-gray-800 text-lg font-semibold text-center">
          <a href="mailto:jeppeenemarkweb@gmail.com" className="text-blue-500 hover:underline">jeppeenemarkweb@gmail.com</a>
        </p>
        <div className="mt-12 flex justify-center">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=jeppeenemarkweb@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 text-white py-3 px-8 rounded shadow text-lg hover:bg-red-600 transition-colors flex items-center"
          >
            <svg className="h-6 w-6 mr-2" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 24L0 8v32z" />
              <path fill="#34A853" d="M24 24l24-16v32z" />
              <path fill="#FBBC05" d="M24 24L0 8h48z" />
              <path fill="#4285F4" d="M24 24L0 40h48z" />
            </svg>
            Contact Us via Gmail
          </a>
        </div>
      </div>
    </div>
  );
};

export default RunAds;
