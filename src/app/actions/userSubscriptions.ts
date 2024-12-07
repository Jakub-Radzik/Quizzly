import Stripe from "stripe";  
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { Subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateSubscription({
  event_data,
}: {
  event_data: Stripe.Subscription;
}) {
  // Get product info from stripe based on subscription id
  const product_id = event_data.items.data[0].price.product as string;
  const product = await stripe.products.retrieve(product_id);
  let subsciptionValue = product.metadata.subscription as Subscriptions;

  if (event_data.status in ["incomplete", "incomplete_expired", "past_due", "cancelled", "unpaid"]) {
    subsciptionValue = Subscriptions.free;
  }

  await db.update(users).set({
    subscription: subsciptionValue,
  }).where(
    eq(users.stripeCustomerId, event_data.customer as string)
  );
  
  console.log('');
}
