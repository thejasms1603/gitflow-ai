"use client";

import { useRouter } from "next/navigation";
import { BackgroundLines } from "./ui/background-lines";
import { RocketIcon } from "lucide-react";
import Navbar from "./Navbar";
import { Code, Edit3, FileText, GitBranch, GitCommit } from "lucide-react";
import { BackgroundGradient } from "./ui/background-gradient";
import Footer from "./Footer";
const LandingPage = () => {
  const router = useRouter();
  const handleSignInClick = () => {
    router.push("/sign-in");
  };

  return (
    // <BackgroundLines className="flex w-full flex-col items-center justify-center px-4">
    //   <h2 className="relative z-20 bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text py-2 text-center font-sans text-2xl font-bold tracking-tight text-transparent dark:from-neutral-600 dark:to-white md:py-10 md:text-4xl lg:text-7xl">
    //     Welcome To, <br />
    //     <span>Gitflow AI</span>
    //   </h2>
    //   <p className="mx-auto max-w-xl text-center text-sm text-neutral-700 dark:text-neutral-400 md:text-lg">
    //     An AI-powered GitHub tool that enhances developer workflows with smart
    //     automation and code insights.
    //   </p>
    //   <Button onClick={handleSignInClick} />
    // </BackgroundLines>
    <div>
      <BackgroundLines className="flex w-full flex-col items-center justify-center px-4 ">
        <div className="duration-700 animate-in fade-in-0">
          <h2 className="relative z-20 bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text py-2 text-center font-sans text-2xl font-bold tracking-tight text-transparent dark:from-neutral-600 dark:to-white md:py-10 md:text-4xl lg:text-7xl">
            Welcome To, <br />
            <span>Gitflow AI</span>{" "}
          </h2>{" "}
          <p className="mx-auto max-w-xl text-center text-sm text-neutral-700 dark:text-neutral-400 md:text-lg">
            An AI-powered GitHub tool that enhances developer workflows with
            smart automation and code insights.Streamline your development
            process and elevate team collaboration.{" "}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button onClick={handleSignInClick}>
              Let's get started <RocketIcon />
            </Button>
          </div>
        </div>
      </BackgroundLines>
      <div className="mx-auto mt-20 w-full max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <BackgroundGradient
              key={index}
              className="max-w-sm rounded-[22px] bg-white p-4 dark:bg-zinc-900 sm:p-10"
            >
              <div className="flex h-full flex-col">
                <div className="w-fit rounded-full bg-primary/10 p-3">
                  <p>{feature.icon}</p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 flex-grow text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </BackgroundGradient>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-24 w-full max-w-6xl p-8 md:p-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex-1">
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to supercharge your Git workflow?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Join thousands of developers who have already transformed their
              workflows with Gitflow AI.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button onClick={handleSignInClick}>Start Free Trial</Button>
          </div>
        </div>
      </div>
    </div>
  );
};




const features = [
  {
    title: "🚀 AI-Powered Code Reviews",
    description:
      "Get instant, intelligent code reviews that enhance quality and maintainability. GitFlow AI scans your pull requests, detects potential issues, suggests improvements, and ensures best coding practices—all powered by AI.",
    icon: <Code size={24} className="text-primary" />,
  },
  {
    title: "📌 AI-Powered Issue & PR Summarization",
    description:
      "Understand issues and pull requests in seconds. GitFlow AI provides AI-driven summaries for complex issues and PRs, helping developers stay informed without digging through lengthy discussions.",
    icon: <Edit3 size={24} className="text-primary" />,
  },
  {
    title: "📖 Automated Documentation Updates",
    description:
      "Keep your documentation up to date effortlessly. GitFlow AI analyzes code changes and generates relevant documentation, ensuring your project stays well-documented without extra effort.",
    icon: <FileText size={24} className="text-primary" />,
  },
  {
    title: "🔀 Smart Branching & Merging Strategies",
    description:
      "Optimize your Git workflow with AI-driven insights. Get AI-powered recommendations on when to merge, rebase, or create new branches, streamlining collaboration and version control.",
    icon: <GitBranch size={24} className="text-primary" />,
  },
];


const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="relative mt-3 inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
};

export default LandingPage;
