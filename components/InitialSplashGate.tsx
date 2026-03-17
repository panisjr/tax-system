"use client";

import { useEffect, useState } from "react";
import AppSplashScreen from "@/components/AppSplashScreen";

type InitialSplashGateProps = {
  children: React.ReactNode;
};

const SPLASH_DURATION_MS = 1000;

export default function InitialSplashGate({ children }: InitialSplashGateProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {children}
      {showSplash && <AppSplashScreen />}
    </>
  );
}
