import { useState } from "react";
import { resetPasswordWithEmail } from "@/lib/authFunctions";
import Link from "next/link";
import clsx from "clsx";
import Head from "next/head";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  // Email regex for simple validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleError = (message: string) => {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handlePasswordReset = async () => {
    if (!emailRegex.test(email)) {
      setInvalidEmail(true);
      handleError("Please enter a valid email address.");
      return;
    }

    try {
      await resetPasswordWithEmail(email);
      setMessage("A password reset email has been sent to your inbox.");
      setError("");
    } catch (error) {
      handleError("Unable to send the password reset email. Try again later.");
    }
  };

  return (
    <div className="flex items-center p-4 justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
       <Head>
        <title>Reset Password | FitGeniusApp</title>
        </Head>
      <div
        className={clsx(
          "w-full max-w-xs md:max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl p-6 md:p-8 space-y-4 md:space-y-6 text-center text-gray-800",
          { "animate-shake": shake }
        )}
      >
        <h1 className="text-3xl md:text-4xl mb-4 md:mb-6 font-bold text-gray-900">Reset Your Password</h1>
        <div>
          <label className="block mb-2 text-left text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setInvalidEmail(false);
            }}
            className={clsx(
              "block w-full mb-2 md:mb-4 border rounded-lg p-2 focus:ring focus:ring-blue-500",
              { "border-gray-300": !invalidEmail, "border-red-600": invalidEmail }
            )}
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
        <button
          onClick={handlePasswordReset}
          className="w-full bg-blue-600 hover:bg-blue-800 text-white py-2 rounded-xl mb-2 md:mb-4 transition-colors"
        >
          Send Reset Email
        </button>
        <p className="text-sm font-medium text-gray-700">
          Remembered your password?{" "}
          <Link href="/login" passHref legacyBehavior>
            <a className="text-blue-600 hover:text-blue-800 font-semibold underline">Go back to login</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PasswordResetPage;
