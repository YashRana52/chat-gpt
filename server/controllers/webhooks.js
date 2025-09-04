import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { transactionId, appId } = session.metadata;

        if (appId === "chat-gpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          if (!transaction) {
            return res.json({
              received: true,
              message: "Transaction not found or already paid",
            });
          }

          // update credits in user account
          await User.updateOne(
            { _id: transaction.userId },
            { $inc: { credits: transaction.credits } }
          );

          // update payment status
          transaction.isPaid = true;
          await transaction.save();
        } else {
          return res.json({
            received: true,
            message: "Ignore event: Invalid app",
          });
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook Processing Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
