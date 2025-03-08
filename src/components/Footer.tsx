import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl px-4 pb-8">
      <div className="border-t border-gray-200 pt-8 dark:border-gray-800">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <Github className="h-5 w-5" />
            <span className="font-medium">Gitflow AI</span>
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="hover:text-gitflow-primary text-sm text-gray-600"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="hover:text-gitflow-primary text-sm text-gray-600"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-gitflow-primary text-sm text-gray-600"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/me.png"
            alt="Thejas"
            width={40}
            height={32}
            className="rounded-full"
          />
          <span>
            Developed by{" "}
            <Link
              href="https://github.com/thejasms1603"
              className="text-md hover:text-blue-500"
            >
              Thejas
            </Link>
          </span>
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Gitflow AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
