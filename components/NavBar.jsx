"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo-white.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  return (
    <nav className="bg-green-700 border-b border-green-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* <!-- Logo --> */}
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image className="h-10 w-auto" src={logo} alt="Visor League" />

              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                Visor League
              </span>
            </Link>
            {/* <!-- Desktop Menu Hidden below md screens --> */}
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-2">
                <Link
                  href="/"
                  className={`${
                    pathname === "/" ? "bg-black" : ""
                  } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                >
                  Home
                </Link>
                <Link
                  href="/rules"
                  className={`${
                    pathname === "/rules" ? "bg-black" : ""
                  } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                >
                  Rules
                </Link>
                <Link
                  href="/history"
                  className={`${
                    pathname === "/history" ? "bg-black" : ""
                  } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                >
                  History
                </Link>
                <Link
                  href="/classic"
                  className={`${
                    pathname === "/classic" ? "bg-black" : ""
                  } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                >
                  Classic
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {isMobileMenuOpen && (
        <div id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "bg-black" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
            >
              Home
            </Link>
            <Link
              href="/rules"
              className={`${
                pathname === "/rules" ? "bg-black" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
            >
              Rules
            </Link>
            <Link
              href="/history"
              className={`${
                pathname === "/history" ? "bg-black" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
            >
              History
            </Link>
            <Link
              href="/classic"
              className={`${
                pathname === "/classic" ? "bg-black" : ""
              } text-white block rounded-md px-3 py-2 text-base font-medium`}
            >
              Classic
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
