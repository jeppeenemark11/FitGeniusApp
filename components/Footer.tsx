import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto flex flex-wrap justify-between text-center md:text-left">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <div className="flex items-center justify-center md:justify-start">
          <Image
              src="/FitGeniusTransparent.png"
              alt="FitGenius"
              width={40}
              height={40}
              className="cursor-pointer"
            />
            <span className="ml-2 text-xl font-bold">FitGenius</span>
          </div>
          <p className="mt-2 text-sm text-gray-300">
            Copyright © 2024 - All rights reserved
          </p>
          <p className="mt-2 text-sm pr-2">
          FitGenius: Explore exercises, watch tutorials, create workouts, and track your progress.
          </p>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="font-semibold">LINKS</h4>
          <ul className="mt-2">
            <li className="mt-2">
            <Link href="/login" passHref legacyBehavior>
              <a className="hover:underline">Login</a>
              </Link>
            </li>
          
          </ul>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="font-semibold">LEGAL</h4>
          <ul className="mt-2">
            <li className="mt-2">
            <Link href="/terms-of-service" passHref legacyBehavior>
              <a className="hover:underline">Terms of Service</a>
              </Link>
            </li>
            <li className="mt-2">
            <Link href="/privacy-policy" passHref legacyBehavior>
              <a  className="hover:underline">Privacy Policy</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="font-semibold">Contackt Us</h4>
          <ul className="mt-2">
            <li className="mt-2">
            <Link href="/ads" passHref legacyBehavior>
              <a  className="hover:underline">Want to run ads on this page?</a>
              </Link>
            </li>
            <li className="mt-2">
            <Link href="/bugs" passHref legacyBehavior>
              <a  className="hover:underline">Found a bug?</a>
              </Link>
            </li>
            <li className="mt-2">
            <Link href="/questions" passHref legacyBehavior>
              <a className="hover:underline">Have a question?</a>
              </Link>
            </li>
           
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
