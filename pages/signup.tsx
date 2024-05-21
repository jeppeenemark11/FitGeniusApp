import { useState, useEffect } from "react";
import { signUpWithEmail, signInWithGoogle, logout } from "@/lib/authFunctions";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);
  const [emojiState, setEmojiState] = useState<boolean>(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  // Regular expressions for email and password validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\/:;"'<>,.?|\\~`])[A-Za-z\d!@#$%^&*()_\-+={}[\]\/:;"'<>,.?|\\~`]{8,}$/;

  // Toggle between two emojis every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiState((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle sign-up errors
  const handleSignUpError = (message: string, invalidField: "email" | "password" | "confirmPassword") => {
    setError(message);
    setInvalidEmail(invalidField === "email");
    setInvalidPassword(invalidField === "password");
    setInvalidConfirmPassword(invalidField === "confirmPassword");
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Sign up with email/password
  const handleSignUp = async () => {
    if (!emailRegex.test(email)) {
      handleSignUpError("Invalid email format.", "email");
      return;
    }

    if (!passwordRegex.test(password)) {
      handleSignUpError("Password must contain uppercase, lowercase, number, and special character.", "password");
      return;
    }

    if (password !== confirmPassword) {
      handleSignUpError("Passwords do not match.", "confirmPassword");
      return;
    }

    try {
      await signUpWithEmail(email, password);
      router.push("/");
    } catch (error) {
      handleSignUpError("Unable to create an account. Please try again later.", "email");
    }
  };

  // Sign up with Google
  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      handleSignUpError("Google sign-up failed. Try again later.", "email");
    }
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/signup');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Display message if already logged in
  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
        <Head>
        <title>Sign Up | FitGeniusApp</title>
        </Head>
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl p-8 space-y-6 text-center text-gray-800">
          <span className="text-4xl md:text-6xl animate-bounce">{emojiState ? "🌟" : "🎯"}</span>
          <h1 className="text-2xl md:text-4xl mb-4 font-bold text-gray-900">You are already logged in</h1>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-800 text-white py-2 rounded-xl transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // Normal sign-up page rendering
  return (
    <div className="flex pt-24 items-center p-3 justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
      <Head>
        <title>Sign Up | FitGeniusApp</title>
        </Head>
      <div
        className={clsx(
          "w-full max-w-xs sm:max-w-sm md:max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl p-4 sm:p-6 md:p-7 space-y-4 md:space-y-5 text-center text-gray-800",
          { "animate-shake": shake }
        )}
      >
        <div className="mb-3 sm:mb-2 md:mb-4">
          {/* Switching Emoji */}
          <span className="text-3xl sm:text-4xl md:text-5xl animate-bounce">{emojiState ? "🌟" : "🎯"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 md:mb-5 font-bold text-gray-900">Create an Account</h1>
        <div>
          <label className="block mb-1 sm:mb-2 text-left text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setInvalidEmail(false);
            }}
            className={clsx(
              "block w-full mb-2 sm:mb-3 md:mb-4 border rounded-lg p-2 focus:ring focus:ring-blue-500",
              { "border-gray-300": !invalidEmail, "border-red-600": invalidEmail }
            )}
          />
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-left text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setInvalidPassword(false);
            }}
            className={clsx(
              "block w-full mb-2 sm:mb-3 md:mb-4 border rounded-lg p-2 focus:ring focus:ring-blue-500",
              { "border-gray-300": !invalidPassword, "border-red-600": invalidPassword }
            )}
          />
        </div>
        <div>
          <label className="block mb-1 sm:mb-2 text-left text-gray-700">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setInvalidConfirmPassword(false);
            }}
            className={clsx(
              "block w-full mb-2 sm:mb-3 md:mb-4 border rounded-lg p-2 focus:ring focus:ring-blue-500",
              { "border-gray-300": !invalidConfirmPassword, "border-red-600": invalidConfirmPassword }
            )}
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={handleSignUp}
          className="w-full bg-green-600 hover:bg-green-800 text-white py-2 rounded-xl mb-2 sm:mb-3 md:mb-4 transition-colors"
        >
          Sign up
        </button>
        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-800 text-white py-2 rounded-xl transition-colors"
        >
          <Image
            src="/google.webp"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign up with Google
        </button>
        <p className="mt-3 text-sm text-gray-700">
          Already have an account?{" "}
          <Link href="/login" passHref legacyBehavior>
            <a className="text-blue-600 hover:text-blue-800 font-semibold underline">Log in</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
