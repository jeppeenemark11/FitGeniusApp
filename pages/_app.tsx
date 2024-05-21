import React, { useEffect } from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ExerciseProvider } from '../context/ExerciseContext';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { trackVisitor } from "@/lib/visitors";
import { useRouter } from 'next/router';
import { SpeedInsights } from "@vercel/speed-insights/next"


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    // Track the visitor on initial load
    trackVisitor();
  }, []);

    // List of routes that should not display the footer
    const noFooterRoutes = ['/ai-workout-wizard'];

    // Check if the current route is in the noFooterRoutes array
    const showFooter = !noFooterRoutes.includes(router.pathname);

  return (
    <AuthProvider >
<ExerciseProvider>
      <SpeedInsights />
      <Navbar />
      <Component {...pageProps} />
      {showFooter && <Footer />}
</ExerciseProvider>
</AuthProvider>
  );
}