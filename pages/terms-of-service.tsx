import React from 'react';
import Head from 'next/head';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
       <Head>
        <title>Terms Of Service | FitGeniusApp</title>
        </Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
        <p className="text-gray-700 mb-4">
          Last Updated: 17. May 2024
        </p>
        <p className="text-gray-700 mb-4">
          Welcome to FitGenius! By accessing or using our website (fitgeniusapp.com) and services, you agree to comply with and be bound by the following terms and conditions. Please read these Terms of Service ({'"'}Terms{'"'}) carefully before using our site and services. If you do not agree with any part of these Terms, you must not use our services.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mb-4">
          By accessing FitGenius, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must stop using our services immediately.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">2. Changes to Terms</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting the revised Terms on our website. Your continued use of the services after such changes constitute your acceptance of the new Terms.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">3. Use of Services</h2>
        <p className="text-gray-700 mb-4">
          FitGenius provides fitness-related content, including exercises, tutorials, and workout tracking. You agree to use the services only for lawful purposes and in accordance with these Terms.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">4. User Accounts</h2>
        <p className="text-gray-700 mb-4">
          To access certain features, you may need to create an account. You agree to provide accurate, complete, and up-to-date information. You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">5. Intellectual Property</h2>
        <p className="text-gray-700 mb-4">
          All content on FitGenius, including text, graphics, logos, and software, is the property of FitGenius or its licensors and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our prior written permission.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">6. Prohibited Activities</h2>
        <p className="text-gray-700 mb-4">
          You agree not to:
          <ul className="list-disc ml-6 mt-2">
            <li>Use the services for any unlawful purpose.</li>
            <li>Upload or distribute viruses or other malicious code.</li>
            <li>Interfere with the operation of the services.</li>
            <li>Attempt to gain unauthorized access to any part of the services.</li>
          </ul>
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">7. Termination</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to terminate or suspend your account and access to the services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or us.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">8. Disclaimers</h2>
        <p className="text-gray-700 mb-4">
          The services are provided {'"'}as is{'"'} and {'"'}as available{'"'} without warranties of any kind, either express or implied. We do not warrant that the services will be uninterrupted or error-free.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">9. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          To the fullest extent permitted by law, FitGenius shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the services.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">10. Indemnification</h2>
        <p className="text-gray-700 mb-4">
          You agree to indemnify, defend, and hold harmless FitGenius, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the services or your violation of these Terms.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">11. Governing Law</h2>
        <p className="text-gray-700 mb-4">
          These Terms shall be governed by and construed in accordance with the laws of Denmark, without regard to its conflict of laws principles.
        </p>
        <h2 className="text-2xl font-bold mt-6 mb-2">12. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions or concerns about these Terms, please contact us at:
        </p>
        <p className="text-gray-700 mb-4">
          Email: <a href="mailto:jeppeenemarkweb@gmail.com" className="text-red-500">jeppeenemarkweb@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
