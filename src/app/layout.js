import { Inter } from "next/font/google";
import "./globals.css";
import NavigationMenu from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseProvider } from "@/context/firebaseContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <NavigationMenu />
          <div className="bg-image">{children}</div>
        </FirebaseProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
