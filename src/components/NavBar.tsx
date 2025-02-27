"use client";
import Link from "@/components/Link";
import { useEffect, useState } from "react";
import { FaArrowCircleUp, FaHome, FaScroll } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoReloadCircle } from "react-icons/io5";
import { set } from "zod";

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  function reloadPage() {
    console.log("reloading page");
    if (!navigator.onLine) {
      alert("No internet connection");
      console.warn("No internet connection");
      return;
    }
    console.log("a");
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      console.log("b");
      navigator.serviceWorker.controller.postMessage("reload");
      window.location.reload();
      // navigator.serviceWorker.dispatchEvent(new Event("reload"));
    } else window.location.reload();
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);
  return (
    <>
      <button
        className={"fixed top-0 left-0 p-4"}
        aria-label="Open Menu"
        onClick={() => setIsOpen(true)}
        onMouseDown={() => setIsOpen(true)}
        onTouchStart={() => setIsOpen(true)}
      >
        <HiOutlineMenu size={48} />
      </button>
      <div
        onClick={() => setIsOpen(false)}
        onMouseDown={() => setIsOpen(false)}
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
            <button
              aria-label="Close Menu"
              title="Close Menu"
              onClick={() => setIsOpen(false)}
              onMouseDown={() => setIsOpen(false)}
              onTouchStart={() => setIsOpen(false)}
              className="cursor-pointer"
            >
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
          <li>
            <button>
              <IoReloadCircle
                className="cursor-pointer"
                id="reload-page"
                aria-label="reload-page"
                onClick={reloadPage}
                onMouseDown={reloadPage}
                onTouchStart={reloadPage}
                size={48}
              />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
