import LandingPage from "@/components/LandingPage";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const getUserDetails = async () =>{
  const user = await currentUser();
  return user;
}
const Home = async () => {
  const user = await getUserDetails();
  if(user)
  {
    redirect('/dashboard')
  }
  return (
    <main>
      <LandingPage/>
    </main>
  )
};

export default Home;