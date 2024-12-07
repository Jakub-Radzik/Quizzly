import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { updateSubscription } from "@/app/actions/userSubscriptions";

const relevantEvents = new Set([
  "customer.subscription.updated",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  if (!sig) return;

  let stripe_event: Stripe.Event;

  try{
    stripe_event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      { status: 400 }
    );
  }

  if (relevantEvents.has(stripe_event.type)) {
    switch (stripe_event.type) {
      case "customer.subscription.updated": {
        stripe_event = stripe_event as Stripe.CustomerSubscriptionUpdatedEvent;
        await updateSubscription({
          event_data: stripe_event.data.object,
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  return new Response(
    JSON.stringify({
      received: true,
    }),
    { status: 200 }
  );
}
