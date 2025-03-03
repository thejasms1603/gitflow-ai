import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen shadow-sm py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignUp/>
      </div>
    </div>
  )
}
