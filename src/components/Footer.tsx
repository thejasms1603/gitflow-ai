import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand Section */}
          <div>
            <div className="mb-4 flex items-center gap-2 md:mb-0">
              <Github className="h-5 w-5" />
              <span className="font-medium">Gitflow AI</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Gitflow AI is a tool that helps you manage your git repositories.
            </p>
            <div className="mt-6 flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://x.com/ThejasGowda03"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://github.com/thejasms1603"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://www.linkedin.com/in/thejasms1603/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="space-y-4">
              <p className="font-medium">Company</p>
              <nav className="flex flex-col gap-2">
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Careers
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <p className="font-medium">Help</p>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  FAQ
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Gitflow AI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/terms">Terms of Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
