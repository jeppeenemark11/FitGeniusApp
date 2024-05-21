import React from 'react';
import Head from 'next/head';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
       <Head>
        <title>Privacy Policy | FitGeniusApp</title>
        </Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-gray-700 mb-4 text-center">
          Last Updated: 17. May 2024
        </p>
        <p className="text-gray-700 mb-4">
          FitGenius ({'"'}we,{'"'} {'"'}our,{'"'} or {'"'}us{'"'}) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (fitgeniusapp.com) and use our services. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">1. Information We Collect</h2>
        <p className="text-gray-700 mb-4">We may collect and process the following types of information:</p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li><strong>Personal Information:</strong></li>
          <ul className="list-disc ml-6 mb-2">
            <li>Name</li>
            <li>Email address</li>
          </ul>
          <li><strong>Non-Personal Information:</strong></li>
          <ul className="list-disc ml-6 mb-2">
            <li>Browser type</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Device information</li>
            <li>Usage data</li>
          </ul>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">2. How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">We use the information we collect for various purposes, including:</p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>Providing, operating, and maintaining our services</li>
          <li>Improving, personalizing, and expanding our services</li>
          <li>Communicating with you, including for customer service, support, and updates</li>
          <li>Processing sending related information</li>
          <li>Analyzing usage and trends to improve user experience</li>
          <li>Detecting and preventing fraudulent or illegal activities</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">3. How We Share Your Information</h2>
        <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li><strong>With Service Providers:</strong> We may share your information with third-party vendors and service providers who perform services on our behalf.</li>
          <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
          <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-6 mb-2">4. Cookies and Tracking Technologies</h2>
        <p className="text-gray-700 mb-4">
          We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that are placed on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">5. Data Security</h2>
        <p className="text-gray-700 mb-4">
          We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">6. Your Data Protection Rights</h2>
        <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
        <ul className="list-disc ml-6 mb-4 space-y-2">
          <li>The right to access – You have the right to request copies of your personal data.</li>
          <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
          <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        <p className="text-gray-700 mb-4">
          If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our contact details provided below.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">7. Children{"'"}s Privacy</h2>
        <p className="text-gray-700 mb-4">
          Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information from our records.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">8. Changes to This Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>

        <h2 className="text-2xl font-bold mt-6 mb-2">9. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions or concerns about this Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-700 mb-4">
          Email: <a href="mailto:jeppeenemarkweb@gmail.com" className="text-red-500 hover:underline">jeppeenemarkweb@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
