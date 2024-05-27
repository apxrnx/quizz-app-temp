"use client";
import { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getQuestions, db, auth } from "../../../firebase";
import { toast } from "react-toastify";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Quiz = ({ level, onQuizEnd, quizzNum }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(null);

  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  const TIMER_VALUES = {
    easy: { default: 15, bonus: 10 },
    medium: { default: 20, bonus: 10 },
    hard: { default: 30, bonus: 15 },
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitAnswer(); // Auto submit answer when time runs out
    }

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const startQuiz = async () => {
    try {
      const fetchedQuestions = await getQuestions(level, 10);
      setQuestions(fetchedQuestions);
      setQuizStarted(true);
      setQuizEnded(false);
      setTimeLeft(TIMER_VALUES[level].default);
      setQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
    } catch (error) {
      console.log(error, "Failed to fetch questions");
    }
  };

  const endQuiz = async () => {
    setQuizEnded(true);
    setQuizStarted(false);
    console.log("Quiz ended. Updating leaderboard...");
    onQuizEnd(quizzNum + 1);
  };

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = async () => {
    let points = 0;
    let isCorrect = selectedAnswer === questions[questionIndex].correctAnswer;

    if (isCorrect) {
      if (level === "easy") points = 10;
      if (level === "medium") points = 15;
      if (level === "hard") points = 20;

      if (timeLeft >= TIMER_VALUES[level].bonus) {
        points += 5; // Award bonus points
      }

      setScore(score + points);
      correctSoundRef.current.play();
    } else {
      incorrectSoundRef.current.play();
    }

    setShowAnswerFeedback(isCorrect);

    // Delay the next question or ending the quiz by 2 seconds
    setTimeout(async () => {
      setShowAnswerFeedback(null);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          score: increment(points),
        });
      }

      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(questionIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(TIMER_VALUES[level].default); // Reset timer for next question
      } else {
        console.log("Quiz ended. Updating leaderboard...");

        onQuizEnd(quizzNum + 1);
        setQuizEnded(true);
        setQuizStarted(false);
        endQuiz();
      }
    }, 2000); // Show feedback for 2 seconds
  };

  return (
    <div className="p-8 rounded-lg shadow-md bg-[#002e5d]">
      <audio ref={correctSoundRef} src="/correct.mp3" />
      <audio ref={incorrectSoundRef} src="/incorrect.mp3" />

      {!quizStarted ? (
        !quizEnded ? (
          <div className="flex flex-col items-center">
            <img src="/question.png" height={400} width={400} />
            <button
              onClick={startQuiz}
              className="py-6 text-xl font-bold text-white bg-green-500 rounded-md px-14 hover:bg-green-600"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold">Quiz Ended</h2>
            <p className="text-xl">
              Your Score: {score} / {questions.length * 10}{" "}
              {/* Adjusted score calculation based on levels */}
            </p>
            <button
              onClick={startQuiz}
              className="px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Restart Quiz
            </button>
          </div>
        )
      ) : (
        <TransitionGroup>
          <CSSTransition key={questionIndex} timeout={300} classNames="fade">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 text-white">
                <h2 className="text-2xl font-bold ">Time Left: {timeLeft}s</h2>
                <h3 className="text-xl">
                  Question {questionIndex + 1} / {questions.length}
                </h3>
                <h3 className="text-xl">Score: {score}</h3>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="mb-4 text-xl font-bold">
                  {questions[questionIndex].question}
                </h3>
                <div className="space-y-2">
                  {questions[questionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(option)}
                      className={`w-full px-4 py-2 text-left rounded-lg border ${
                        selectedAnswer === option
                          ? "bg-yellow-200 border-black"
                          : "hover:bg-yellow-100"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleSubmitAnswer}
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={endQuiz}
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    End Quiz
                  </button>
                </div>
                {showAnswerFeedback !== null && (
                  <div className="mt-4">
                    {showAnswerFeedback ? (
                      <div className="flex items-center">
                        <span className="text-green-600">Correct!</span>
                        <div className="correct-answer"></div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-red-600">Incorrect!</span>
                        <div className="incorrect-answer"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CSSTransition>
        </TransitionGroup>
      )}
    </div>
  );
};

export default Quiz;
