"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Logged in successfully
      toast.success("Logged in successfully!");
      // Redirect to home page or any other page after login
      router.push("/");
    } catch (error) {
      // Handle login errors
      const errorMessage = error.message;
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Login with Google coming soon!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <Card className="max-w-sm mx-auto bg-white border-4 border-white rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#002e5d]">
            Login
          </CardTitle>
          <CardDescription className="text-[#2a639b]">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password" className="text-[#002e5d]">
                  Password
                </Label>
                <Link
                  href="#"
                  className="inline-block ml-auto text-sm text-[#002e5d] underline"
                >
                  Forgot your password?
                </Link>
              </div>
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
              <Button
                className="w-full py-2 font-bold text-white bg-[#002e5d] border-2 border-[#002e5d] rounded-md hover:bg-[#2a639b]"
                onClick={handleSubmit}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full py-2 font-bold text-[#002e5d] border-2 border-[#002e5d] rounded-md hover:bg-[#2a639b]"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-sm text-center text-[#002e5d]">
              Don&apos;t have an account?{" "}
              <Link href="/sign_up" className="text-[#002e5d] underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
