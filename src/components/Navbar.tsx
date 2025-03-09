"use client";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import { GitBranchIcon, Theater } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full p-2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-6xl rounded-2xl border border-neutral-300 bg-background/50 px-4 shadow-lg backdrop-blur-xl dark:border-neutral-900 sm:px-6 lg:px-8"
        >
          <div className="flex h-16 items-center justify-between">
            <motion.div>
              <Link
                href="/"
                className="flex items-center space-x-2 transition-opacity hover:opacity-80"
              >
                <GitBranchIcon className="h-6 w-6" />
                <span className="hidden font-mono text-xl font-bold sm:inline-block">
                  Gitflow AI
                </span>
              </Link>
            </motion.div>
            <div className="flex items-center gap-2 md:gap-4">
              <ModeToggle />
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "h-8 w-8 rounded-full ring-2 ring-primary/10 transition-all hover:ring-primary/30",
                      userButtonPopover: "right-0 mt-2",
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="dark:hover:to-neutral-750 relative overflow-hidden rounded-lg border border-neutral-600 bg-gradient-to-r from-neutral-800 to-neutral-900 px-4 py-2 font-medium tracking-wide text-white shadow-md shadow-neutral-800/20 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:from-neutral-700 hover:to-neutral-900 hover:shadow-lg dark:border-neutral-700 dark:from-neutral-700 dark:to-neutral-800 dark:shadow-black/30 dark:hover:from-neutral-600"
                    asChild
                  >
                    <SignInButton mode="modal">
                      <span>Sign In</span>
                    </SignInButton>
                  </Button>
                </motion.div>
              </SignedOut>
            </div>
          </div>
        </motion.div>
      </motion.header>
    </div>
  );
};

export default Navbar;
