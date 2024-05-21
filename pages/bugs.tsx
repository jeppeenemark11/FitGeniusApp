import React from 'react';
import Head from 'next/head';

const FoundABug: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
       <Head>
        <title>Bugs | FitGeniusApp</title>
        </Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Found a Bug?</h1>
        <p className="text-gray-700 mb-4">
          If you{"'"}ve encountered a bug or issue while using our site, we would love to hear from you. Please contact us at:
        </p>
        <p className="text-gray-700 mb-4">
          Email: <a href="mailto:jeppeenemarkweb@gmail.com" className="text-red-500">jeppeenemarkweb@gmail.com</a>
        </p>
        <p className="text-gray-700 mb-4">
          Thank you in advance for your help and time. Your feedback is valuable to us and helps us improve FitGenius for everyone.
        </p>
      </div>
    </div>
  );
};

export default FoundABug;
