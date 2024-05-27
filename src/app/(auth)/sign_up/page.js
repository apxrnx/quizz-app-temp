"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../../firebase";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, []);

  // async function addQuestions() {
  //   const questions = [];

  //   const questionsCollection = collection(db, "questions");

  //   for (const question of questions) {
  //     await addDoc(questionsCollection, question);
  //   }

  //   console.log("Questions added to Firestore");
  // }

  // useEffect(() => {
  //   addQuestions();
  // }, [db]);

  const handleGoogle = (e) => {
    toast.info("Coming Soon!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      toast.success("Sign up successful!");

      // Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
        score: 0,
      });

      // Clear input fields
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <Card className="max-w-sm mx-auto bg-white border-4 border-white rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#002e5d]">
            Sign Up
          </CardTitle>
          <CardDescription className="text-[#2a639b]">
            Fill in the information below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-[#002e5d]">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-[#002e5d]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#002e5d]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-[#002e5d]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[#002e5d]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-[#002e5d]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-[#002e5d]">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="text-[#002e5d]"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 font-bold text-white bg-[#002e5d] border-2 border-[#002e5d] rounded-md hover:bg-[#2a639b]"
              >
                Sign Up
              </Button>
              <Button
                onClick={handleGoogle}
                className="w-full py-2 font-bold text-[#002e5d] bg-white border-2 border-[#002e5d] rounded-md hover:bg-[#2a639b]"
              >
                Sign Up with Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-sm text-center text-[#002e5d]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#002e5d] underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
