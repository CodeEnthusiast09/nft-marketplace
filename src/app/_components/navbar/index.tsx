"use client";

import { Button } from "@/components/button";
import { useState } from "react";
import { TbHexagons } from "react-icons/tb";
import { FaTimes } from "react-icons/fa";
import { navItems } from "@/lib/navbar.data";
import { NavItem } from "@/interfaces/global";
import { NavBarItem } from "./navbar-item";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav((prev: boolean) => !prev);
  };

  return (
    <header className="bg-background w-full flex items-center justify-between lg:px-[50px] lg:pt-2.5 lg:pb-2.5 xl:px-[165px]">
      {/* Logo */}

      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
          <TbHexagons size={32} className="text-primary-100" />
        </div>
        <span className="text-xl font-semibold">Hex NFT Marketplace</span>
      </Link>

      {/* Mobile devices */}
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="neutral" onClick={toggleNav}>
          <AnimatePresence mode="wait" initial={false}>
            {showNav ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes className="text-3xl text-background" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RxHamburgerMenu className="text-3xl text-primary-100" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden lg:flex items-center justify-between gap-40">
        <ul className="flex items-center gap-10">
          {navItems.map((item: NavItem, index: number) => (
            <NavBarItem key={index} item={item} onClick={() => toggleNav()} />
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-5 pl-4 py-3">
          <ConnectButton />
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div
        className={`px-5 xl:px-6 py-6 h-screen overflow-auto w-1/2 md:w-[40vw] lg:w-[25vw] 2xl:w-[18vw] bg-background border-l border-l-primary-200 z-50 fixed lg:right-0 transition-all duration-500 top-0 ${
          showNav ? "right-0" : " -right-[150vw]"
        } lg:hidden`}
      >
        <div className="flex items-center justify-between pb-6">
          <Button variant="neutral" onClick={toggleNav}>
            <AnimatePresence mode="wait" initial={false}>
              {showNav ? (
                <motion.div
                  key="close"
                  className="absolute right-4 top-[23px]"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes className="text-3xl text-primary-100" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <RxHamburgerMenu className="text-3xl text-primary-100" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        <nav className="block z-50">
          <ul className="flex flex-col gap-8">
            {navItems.map((item: NavItem, index: number) => (
              <NavBarItem key={index} item={item} onClick={() => toggleNav()} />
            ))}

            <hr className="h-[1px] bg-primary-200" />

            <div className="flex flex-col items-start gap-5">
              <ConnectButton />
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};
