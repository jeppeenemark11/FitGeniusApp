import Link from 'next/link';
import { useRouter } from 'next/router';
import { LuX } from "react-icons/lu";

const AuthPromptCard = () => {
  const router = useRouter();
  return (
    <div className='h-screen'>
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
      <LuX className='text-red-600 hover:scale-125' onClick={() => router.push('/')}  />
        <h2 className="text-2xl font-semibold mb-4">You need to be logged in</h2>
        <p className="text-gray-700 mb-6">To see this page, please log in or sign up.</p>
        <div className="flex justify-around">
          <Link href="/login" passHref legacyBehavior>
            <a className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition">
              Log In
            </a>
          </Link>
          <Link href="/signup" passHref legacyBehavior>
            <a className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition">
              Sign Up
            </a>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AuthPromptCard;
