"use client";
import Link from "@/components/Link";
import React, { useEffect, useState } from "react";
import { FaGithub, FaHome, FaScroll } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoReloadCircle } from "react-icons/io5";

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
  function openMenu(e: React.MouseEvent | React.TouchEvent) {
    console.log("openMenu", e.type);
    e.preventDefault();
    setIsOpen(true);
  }
  function closeMenu(e: React.MouseEvent | React.TouchEvent) {
    console.log("closeMenu", e.type);
    e.preventDefault();
    setIsOpen(false);
  }
  function preventDefault(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
  }
  return (
    <>
      <button
        className={"fixed top-0 left-0 p-4"}
        aria-label="Open Menu"
        // onClick={openMenu}
        onMouseDown={openMenu}
        onTouchStart={openMenu}
        onTouchEnd={preventDefault}
        onTouchCancel={preventDefault}
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
          `fixed z-20 top-0 left-0 transition-all duration-300 w-20 flex ${
            isOpen ? "-translate-x-0" : "-translate-x-full md:-translate-x-0"
          } flex-col justify-start h-full bg-red-500`
          // "fixed z-20 top-0 left-0 transition-all duration-500 flex -translate-x-full flex-col h-full bg-red-500"
        }
      >
        <ul className="flex flex-col items-center gap-4 p-4 text-[#ededed]">
          <li>
            <button
              aria-label="Close Menu"
              title="Close Menu"
              onClick={closeMenu}
              onMouseDown={closeMenu}
              onTouchStart={closeMenu}
              onTouchCancel={preventDefault}
              onTouchEnd={preventDefault}
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
            <Link href="https://github.com/sethnine/freedom-units">
              <FaGithub
                className="cursor-pointer"
                id="source-code"
                aria-label="source-code"
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
                // onClick={reloadPage}
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
