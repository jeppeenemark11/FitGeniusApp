import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { signInWithEmail, signInWithGoogle, logout } from "@/lib/authFunctions";
import Head from "next/head";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const router = useRouter();
  const [logoState, setLogoState] = useState<boolean>(true);
  const { user, loading } = useAuth();

  // Toggle animated emoji every sec
  useEffect(() => {
    const interval = setInterval(() => setLogoState((prev) => !prev), 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle login errors
  const handleLoginError = (message: string, invalidField: "email" | "password") => {
    setError(message);
    setInvalidEmail(invalidField === "email");
    setInvalidPassword(invalidField === "password");
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Handle email login
  const handleEmailLogin = async () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      handleLoginError("Invalid email format.", "email");
      return;
    }

    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (error) {
      handleLoginError("Incorrect email or password.", "password");
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      handleLoginError("Google login failed. Try again later.", "email");
    }
  };

  // Render logout message if the user is already logged in
  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
         <Head>
        <title>Login | FitGeniusApp</title>
        </Head>
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl p-8 space-y-6 text-center text-gray-800">
          <span className="text-4xl md:text-6xl animate-bounce">{logoState ? "💪" : "🦾"}</span>
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

  // Normal login page rendering
  return (
    <div className="flex pt-16 items-center p-4 justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
       <Head>
        <title>Login | FitGeniusApp</title>
        </Head>
      <div
        className={clsx(
          "w-full max-w-sm sm:max-w-xs md:max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl p-5 sm:p-4 md:p-8 space-y-4 md:space-y-6 text-center text-gray-800",
          { "animate-shake": shake }
        )}
      >
        <div className="mb-3 sm:mb-2 md:mb-6">
          {/* Animated Logo */}
          <span className="text-4xl sm:text-3xl md:text-6xl animate-bounce">{logoState ? "💪" : "🦾"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 md:mb-6 font-bold text-gray-900">Exercise App Login</h1>
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
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={handleEmailLogin}
          className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded-xl mb-2 sm:mb-3 md:mb-4 transition-colors"
        >
          Sign in
        </button>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-red-600 hover:bg-red-800 text-white py-2 rounded-xl transition-colors"
        >
          <Image
            src="/google.webp"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign in with Google
        </button>
        <p className="mt-2 text-sm text-gray-700">
          <Link href="/passwordreset" passHref legacyBehavior>
            <a className="text-blue-600 hover:text-blue-800 font-semibold underline">Forgot your password?</a>
          </Link>
        </p>
        <p className="mt-4 text-sm font-medium text-gray-700">
          New to our community?{" "}
          <Link href="/signup" passHref legacyBehavior>
            <a className="text-blue-600 hover:text-blue-800 font-semibold underline">Create an account</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
