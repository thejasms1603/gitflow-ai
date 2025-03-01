"use client"; // Ensures this runs on the client-side

import { useRouter } from "next/navigation";
import { BackgroundLines } from "./ui/background-lines";
import { RocketIcon } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

const LandingPage = () => {
  const router = useRouter(); // Initialize router to navigate programmatically

  const handleSignInClick = () => {
    router.push("/sign-in"); // Redirect to the sign-in page
  };

  return (
    <BackgroundLines className="flex w-full flex-col items-center justify-center px-4">
      <h2 className="relative z-20 bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text py-2 text-center font-sans text-2xl font-bold tracking-tight text-transparent dark:from-neutral-600 dark:to-white md:py-10 md:text-4xl lg:text-7xl">
        Welcome To, <br />
        <span>Gitflow AI</span>
      </h2>
      <p className="mx-auto max-w-xl text-center text-sm text-neutral-700 dark:text-neutral-400 md:text-lg">
        An AI-powered GitHub tool that enhances developer workflows with smart
        automation and code insights.
      </p>
      <Button onClick={handleSignInClick} />
    </BackgroundLines>
  );
};

export const Button = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="relative mt-3 inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        Let's get started <RocketIcon />
      </span>
    </button>
  );
};

export default LandingPage;
