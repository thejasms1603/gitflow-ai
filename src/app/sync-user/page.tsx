import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

const Syncuser = async () => {
  try {
    const { userId} = await auth();
    if (!userId) return redirect("/sign-in");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return notFound(); 
    }

    await db.user.upsert({
      where: {
        email, 
      },
      update: {
        imageUrl: user.imageUrl,
        firstName: user.firstName ?? "", 
        lastName: user.lastName ?? "",
      },
      create: {
        id: userId,
        email,
        imageUrl: user.imageUrl,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      },
    });
  } catch (error) {
    console.error("Error Syncing User", error);
    return notFound(); 
  }
  redirect('/dashboard')
};

export default Syncuser;
