import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 shadow-md sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
