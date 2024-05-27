"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setIsLoggedIn(true);
      } else {
        // No user is signed in.
        setIsLoggedIn(false);
      }
    });

    // Cleanup function to unsubscribe from the auth state listener
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignupClick = () => {
    router.push("/sign_up");
  };

  return (
    <div className="flex flex-col items-center w-full h-full text-center p-14">
      <div className="p-4">
        <h1 className="font-bold text-white uppercase text-7xl">
          Welcome to the quest <br /> hunt the treasure
        </h1>
        <p className="mt-4 text-4xl font-bold text-white">
          Win big <br />
          $500, $1000, $1500
        </p>
        {!isLoggedIn && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handleLoginClick}
              className="px-6 py-3 text-xl font-bold text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Login
            </button>
            <button
              onClick={handleSignupClick}
              className="px-6 py-3 text-xl font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
