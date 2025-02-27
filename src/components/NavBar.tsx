"use client";
import Link from "@/components/Link";
import { useState } from "react";
import { FaHome, FaScroll } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineMenuAlt2 } from "react-icons/hi";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className={"fixed top-0 left-0 p-4"}
        aria-label="Open Menu"
        onClick={() => setIsOpen(true)}
      >
        <HiOutlineMenu size={48} />
      </button>
      <div
        onClick={() => setIsOpen(false)}
        aria-label="Close Menu"
        className={`fixed ${
          !isOpen ? "hidden" : ""
        } top-0 left-0 w-full h-full`}
      ></div>

      <nav
        className={
          `fixed z-20 top-0 left-0 transition-all duration-500 flex ${
            isOpen ? "-translate-x-0" : "-translate-x-full"
          } flex-col h-full bg-red-500`
          // "fixed z-20 top-0 left-0 transition-all duration-500 flex -translate-x-full flex-col h-full bg-red-500"
        }
      >
        <ul className="flex flex-col gap-4 p-4">
          <li>
            <button onClick={() => setIsOpen(false)}>
              <HiOutlineMenuAlt2 size={48} />
            </button>
          </li>
          <li>
            <Link prefetch={true} href="/">
              <FaHome
                className="cursor-pointer"
                id="home"
                aria-label="Home"
                size={48}
              />
            </Link>
          </li>
          <li>
            <Link href="/licences">
              <FaScroll
                className="cursor-pointer"
                id="licences"
                aria-label="Licences"
                size={48}
              />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
