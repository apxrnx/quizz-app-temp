"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const NavigationMenu = () => {
  const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);
  const [navigationMenu, setNavigationMenu] = useState("");
  const [navigationMenuCloseTimeout, setNavigationMenuCloseTimeout] =
    useState(null);
  const navigationDropdownRef = useRef(null);

  const router = useRouter();
  const [user, setUser] = useState(null);

  // Firebase authentication instance
  const auth = getAuth();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Unsubscribe to the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const navigationMenuLeave = () => {
    const timeout = setTimeout(() => {
      navigationMenuClose();
    }, 200);
    setNavigationMenuCloseTimeout(timeout);
  };

  const navigationMenuReposition = (navElement) => {
    if (navigationMenuCloseTimeout) clearTimeout(navigationMenuCloseTimeout);
    const dropdown = navigationDropdownRef.current;
    if (dropdown) {
      dropdown.style.left = `${navElement.offsetLeft}px`;
      dropdown.style.marginLeft = `${navElement.offsetWidth / 2}px`;
    }
  };

  const navigationMenuClearCloseTimeout = () => {
    if (navigationMenuCloseTimeout) clearTimeout(navigationMenuCloseTimeout);
  };

  const navigationMenuClose = () => {
    setNavigationMenuOpen(false);
    setNavigationMenu("");
  };

  return (
    <nav className="relative z-10 w-auto">
      <div className="relative">
        <ul className="flex items-center justify-center flex-1 p-1 space-x-1 list-none rounded-md bg-[#002e5d] text-white">
          <li className="">
            <Link
              href="/#"
              className="inline-flex items-center justify-center h-10 px-4 py-2 mr-2 text-sm font-medium transition-colors rounded-md hover:bg-white hover:text-gray-700 focus:outline-none"
            >
              Home
            </Link>
          </li>
          <li>
            <button
              className={`inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                navigationMenu === "choose-level"
                  ? "bg-white text-gray-700"
                  : "hover:bg-white hover:text-gray-700"
              } focus:outline-none disabled:opacity-50 disabled:pointer-events-none group w-max`}
              onMouseOver={(e) => {
                setNavigationMenuOpen(true);
                navigationMenuReposition(e.currentTarget);
                setNavigationMenu("choose-level");
              }}
              onMouseLeave={navigationMenuLeave}
            >
              <span>Choose Level</span>
              <svg
                className={`relative top-[1px] ml-1 h-3 w-3 ease-out duration-300 ${
                  navigationMenuOpen && navigationMenu === "choose-level"
                    ? "-rotate-180"
                    : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </li>
          <li>
            <button
              className={`inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                navigationMenu === "learn-more"
                  ? "bg-white text-gray-700"
                  : "hover:bg-white hover:text-gray-700"
              } focus:outline-none disabled:opacity-50 disabled:pointer-events-none group w-max`}
              onMouseOver={(e) => {
                setNavigationMenuOpen(true);
                navigationMenuReposition(e.currentTarget);
                setNavigationMenu("learn-more");
              }}
              onMouseLeave={navigationMenuLeave}
            >
              <span>Explore More</span>
              <svg
                className={`relative top-[1px] ml-1 h-3 w-3 ease-out duration-300 ${
                  navigationMenuOpen && navigationMenu === "learn-more"
                    ? "-rotate-180"
                    : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </li>
          <li>
            <Link
              href="#_"
              className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-white hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:pointer-events-none group w-max"
            >
              Documentation
            </Link>
          </li>
          {user ? (
            // If user is logged in, show logout option
            <li className="ml-auto">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center h-10 px-4 py-2 mr-2 text-sm font-medium transition-colors rounded-md hover:bg-white hover:text-gray-700 focus:outline-none"
              >
                Logout
              </button>
            </li>
          ) : (
            // If user is not logged in, show login and signup options
            <li className="ml-auto">
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-10 px-4 py-2 mr-2 text-sm font-medium transition-colors rounded-md hover:bg-white hover:text-gray-700 focus:outline-none"
              >
                Login
              </Link>
              <Link
                href="/sign_up"
                className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 border-2 border-blue-500 rounded-md hover:bg-blue-600 hover:border-blue-600 focus:outline-none"
              >
                Signup
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div
        ref={navigationDropdownRef}
        className={`absolute top-0 pt-3 duration-200 ease-out -translate-x-1/2 translate-y-11 ${
          navigationMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onMouseOver={navigationMenuClearCloseTimeout}
        onMouseLeave={navigationMenuLeave}
      >
        <div className="flex justify-center w-auto h-auto overflow-hidden bg-gray-100 border border-gray-200 rounded-md shadow-sm">
          {navigationMenu === "choose-level" && (
            <div className="flex items-stretch justify-center w-full max-w-2xl p-6 gap-x-3">
              <div className="flex-shrink-0 w-48 pt-20 rounded pb-7 bg-gradient-to-br from-neutral-800 to-black">
                <div className="relative px-7 space-y-1.5 text-white">
                  <img src="/randomlogo.png" />
                  <span className="block text-2xl font-bold">Choose Level</span>
                  <span className="block text-sm opacity-60">
                    BE THE FIRST TO CRACK THE CODE TO FIND THE HIDDEN TREASURE
                  </span>
                </div>
              </div>
              <div className="w-72">
                <Link
                  href="/quiz?level=easy"
                  onClick={navigationMenuClose}
                  className="block px-3.5 py-3 text-sm rounded hover:bg-gray-200 border border-black"
                >
                  <span className="block mb-1 text-2xl font-bold text-black">
                    Easy
                  </span>
                  <span className="block text-sm font-bold">Win $500</span>
                </Link>
                <Link
                  href="/quiz?level=medium"
                  onClick={navigationMenuClose}
                  className="block px-3.5 py-3 text-sm rounded hover:bg-gray-200 border border-black my-2"
                >
                  <span className="block mb-1 text-2xl font-bold text-black">
                    Medium
                  </span>
                  <span className="block text-sm font-bold">Win $1000</span>
                </Link>
                <Link
                  href="/quiz?level=hard"
                  onClick={navigationMenuClose}
                  className="block px-3.5 py-3 text-sm rounded hover:bg-gray-200 border border-black"
                >
                  <span className="block mb-1 text-2xl font-bold text-black">
                    Hard
                  </span>
                  <span className="block text-sm font-bold">Win $1500</span>
                </Link>
              </div>
            </div>
          )}

          {navigationMenu === "learn-more" && (
            <div className="flex items-stretch justify-center w-full p-6">
              <div className="w-72">
                <Link
                  href="#_"
                  onClick={navigationMenuClose}
                  className="block px-3.5 py-3 text-sm rounded hover:bg-gray-200 border border-black m-1"
                >
                  <span className="block mb-1 font-medium text-black ">
                    Chess
                  </span>
                  <span className="block font-light leading-5 opacity-50">
                    Play Chess
                  </span>
                </Link>
                <Link
                  href="#_"
                  onClick={navigationMenuClose}
                  className="block px-3.5 py-3 text-sm rounded hover:bg-gray-200 border border-black m-1"
                >
                  <span className="block mb-1 font-medium text-black">
                    Sudoko
                  </span>
                  <span className="block font-light leading-5 opacity-50">
                    Play Sudoko
                  </span>
                </Link>
              </div>
              <div className="w-72">
                <Link
                  href="#_"
                  onClick={navigationMenuClose}
                  className="block px-3.5 py-3 text-sm rounded hover:bg-gray-200 border border-black m-1"
                >
                  <span className="block mb-1 font-medium text-black">
                    {" "}
                    Chess
                  </span>
                  <span className="block font-light leading-5 opacity-50">
                    Play Chess
                  </span>
                </Link>
                <Link
                  href="#_"
                  onClick={navigationMenuClose}
                  className="block px-3.5 py-3 text-sm rounded hover:bg-gray-200 border border-black m-1"
                >
                  <span className="block mb-1 font-medium text-black">
                    Chess
                  </span>
                  <span className="block leading-5 opacity-50">Play Chess</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
