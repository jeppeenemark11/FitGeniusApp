import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import ProfileDropdown from "./ProfilePicDropdown";

const Navbar = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray-800 text-white w-full p-2 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center pl-4 pr-4 mx-auto">
        {/* Mobile Menu Toggle */}
        <button className="text-white md:hidden" onClick={handleMobileMenuToggle}>
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Logo */}
        <div className="ml-auto md:ml-0 flex items-center">
          <Link href="/" passHref legacyBehavior>
            <Image
              src="/FitGeniusTransparent.png"
              alt="FitGenius"
              width={50}
              height={50}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        <NavigationMenu className="hidden md:block flex-grow ml-4">
          <NavigationMenuList className="flex justify-center gap-6">
            <NavigationMenuItem>
              <Link href="/browse-exercises" passHref legacyBehavior>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} flex flex-col items-center`}
                >
                  <span>🏋️‍♂️</span>
                  <span>Browse Exercises</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/workouts" passHref legacyBehavior>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} flex flex-col items-center`}
                >
                  <span>🤸‍♀️</span>
                  <span>Workouts</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/workout-history" passHref legacyBehavior>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} flex flex-col items-center`}
                >
                  <span>📅</span>
                  <span>History</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/ai-workout-wizard" passHref legacyBehavior>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} flex flex-col items-center`}
                >
                  <span>🤖</span>
                  <span>AI Workout Wizard</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Profile Icon or Log in / Join Free */}
        <div className="hidden md:flex gap-4 items-center ml-8">
          {user ? (
           <ProfileDropdown />
          ) : (
            <>
              <Link href="/login" passHref legacyBehavior>
                <a className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-all">
                  Log in
                </a>
              </Link>
              <Link href="/signup" passHref legacyBehavior>
                <a className="px-4 py-2 rounded-full border border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white transition-all">
                  Join Free
                </a>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 p-2">
          <div className="flex flex-col gap-4">
            <Link href="/browse-exercises" passHref legacyBehavior>
              <a className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <span>🏋️‍♂️</span> Browse Exercises
              </a>
            </Link>
            <Link href="/workouts" passHref legacyBehavior>
              <a className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <span>🤸‍♀️</span> Workouts
              </a>
            </Link>
            <Link href="/workout-history" passHref legacyBehavior>
              <a className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <span>📅</span> History
              </a>
            </Link>
            <Link href="/ai-workout-wizard"  passHref legacyBehavior>
              <a className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <span>🤖</span> AI Workout Wizard
              </a>
            </Link>
            {user ? (
              <>
                <Link href="/settings"  passHref legacyBehavior>
                  <a className="block text-lg" onClick={() => setIsMobileMenuOpen(false)}>Settings</a>
                </Link>
                <Link href="/logout"  passHref legacyBehavior>
                  <a className="block text-lg" onClick={() => setIsMobileMenuOpen(false)}>Logout</a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login"  passHref legacyBehavior>
                  <a className="block text-lg" onClick={() => setIsMobileMenuOpen(false)}>Log in</a>
                </Link>
                <Link href="/signup"  passHref legacyBehavior>
                  <a className="block text-lg" onClick={() => setIsMobileMenuOpen(false)}>Join Free</a>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
