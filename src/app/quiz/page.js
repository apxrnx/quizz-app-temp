"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Leaderboard from "../components/Leaderboard";
import Quiz from "../components/Quiz";
import { auth, getLeaderboard } from "../../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level");
  const [currentUser, setCurrentUser] = useState(null);
  const [quizEnd, setQuizEnd] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <Suspense>
      <div className="flex flex-col min-h-screen p-8">
        <h1 className="py-2 mb-8 text-5xl font-bold text-center text-white border-4 border-white bg-[#002e5d]">
          Quiz Level: <span className="uppercase">{level}</span>
        </h1>
        <div className="flex">
          <div className="w-1/4 pr-4">
            <Leaderboard
              level={level}
              currentUser={currentUser}
              quizState={quizEnd}
            />
          </div>
          <div className="w-3/4 pl-4">
            <Quiz level={level} onQuizEnd={setQuizEnd} quizzNum={quizEnd} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
