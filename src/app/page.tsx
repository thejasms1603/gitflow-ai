import LandingPage from "@/components/LandingPage";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const getUserDetails = async () => {
  const { userId } = await auth();
  return userId;
};
const Home = async () => {
  const userId = await getUserDetails();
  if(userId)
  {
      redirect('/dashboard')
  }
  return <LandingPage />;
};

export default Home;
