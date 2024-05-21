import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { logout } from '@/lib/authFunctions';

const ProfileDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close the dropdown with a delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!dropdownVisible && shouldFadeOut) {
      timer = setTimeout(() => setShouldFadeOut(false), 300);
    }
    return () => clearTimeout(timer);
  }, [dropdownVisible, shouldFadeOut]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => {
        setDropdownVisible(true);
        setShouldFadeOut(true);
      }}
      onMouseLeave={() => setDropdownVisible(false)}
    >
      {/* Profile Image */}
      <Image
        src="/profileIMG.png" 
        alt="Profile"
        width={40}
        height={40}
        className="rounded-full cursor-pointer border border-gray-200 shadow-lg"
      />

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 ring-1 ring-black ring-opacity-5 transition-opacity duration-200 ${
          dropdownVisible ? 'opacity-100' : 'opacity-0'
        } ${shouldFadeOut ? '' : 'hidden'}`}
      >
        <ul className="py-2">
          <li
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer transition-all"
          >
            <Link href="/favorites" passHref legacyBehavior>
              <a className="block text-lg">Favorites ❤️</a>
            </Link>
          </li>
          <li
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer transition-all"
          >
            <Link href="/settings" passHref legacyBehavior>
              <a className="block text-lg">Settings ⚙️</a>
            </Link>
          </li>
          <li
            className="block px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-800 rounded-lg cursor-pointer transition-all"
            onClick={handleLogout}
          >
            Log Out 👋
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
