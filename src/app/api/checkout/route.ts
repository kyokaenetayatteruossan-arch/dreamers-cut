import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


export async function POST(req: Request) {
  try {
    const { amount, jobId, title } = await req.json();

    if (!amount || !jobId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const origin = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title || "動画制作依頼",
              description: `依頼ID: ${jobId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?payment_success=true&job_id=${jobId}`,
      cancel_url: `${origin}/request/new?payment_cancel=true`,
      metadata: {
        jobId: jobId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
