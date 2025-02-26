"use client";
import Link from "@/components/Link";
import { useState } from "react";
import { FaHome, FaScroll } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineMenuAlt2 } from "react-icons/hi";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        className={"fixed top-0 left-0 p-4"}
        aria-label="Open Menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HiOutlineMenu size={48} />
      </button>
      <nav
        className={
          isOpen
            ? "absolute transition-all duration-500 flex  -translate-x-0 flex-col h-full bg-red-500"
            : "absolute transition-all duration-500  -translate-x-full flex-col h-full bg-red-500"
        }
      >
        <ul className="flex flex-col gap-4 p-4">
          <li>
            <button onClick={() => setIsOpen(!isOpen)}>
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
    </div>
  );
}
