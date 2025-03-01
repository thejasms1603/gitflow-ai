import React from "react";
import { ModeToggle } from "./ModeToggle";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
      <div className="border-sidebar-background flex items-center justify-between rounded-md border bg-sidebar p-2 px-4 shadow dark:border-white">
        <p>GitFlow AI</p>
        {/* SearchBar */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
  );
};

export default Navbar;
