import React from 'react';
import Head from 'next/head';

const HaveAQuestion: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
       <Head>
        <title>Questions | FitGeniusApp</title>
        </Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Have a Question?</h1>
        <p className="text-gray-700 mb-4">
          If you have any questions about our services or need assistance, feel free to reach out to us. You can contact us at:
        </p>
        <p className="text-gray-700 mb-4">
          Email: <a href="mailto:jeppeenemarkweb@gmail.com" className="text-red-500">jeppeenemarkweb@gmail.com</a>
        </p>
        <p className="text-gray-700 mb-4">
          We appreciate your interest and will do our best to respond to your inquiries as quickly as possible. Thank you for choosing FitGenius!
        </p>
      </div>
    </div>
  );
};

export default HaveAQuestion;
