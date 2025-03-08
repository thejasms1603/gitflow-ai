import { db } from "@/server/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("Stripe-signature") as String;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log(event.type);
  if (event.type === "checkout.session.completed") {
    const tokens = Number(session.metadata?.["credits"]);
    const userId = session.client_reference_id;
    if (!tokens || !userId) {
      return NextResponse.json(
        { error: "Missing userId or tokens" },
        { status: 400 },
      );
    }
    await db.stripeTransaction.create({
      data: {
        userId,
        tokens,
      },
    });
    await db.user.update({
        where:{
            id:userId,
        },
        data:{
            tokens:{
                increment:tokens
            }
        }
    })
    return NextResponse.json({message:'Tokens added successfully'}, {status:200})
  }
  return NextResponse.json({ message: "Hello, world!" });
}
