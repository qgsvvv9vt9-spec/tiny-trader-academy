/**
 * Tiny Trader Academy — Stripe Subscription Backend
 * 
 * SETUP:
 *   npm install express stripe cors dotenv
 *   node stripe-server.js
 *
 * Deploy to: Railway, Render, Heroku, or any Node host
 */

require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend
app.use(express.static(path.join(__dirname)));

// ──────────────────────────────────────────────
// POST /api/subscribe
// Creates a Stripe customer + subscription
// ──────────────────────────────────────────────
app.post('/api/subscribe', async (req, res) => {
  const { paymentMethodId, priceId, email, name } = req.body;

  try {
    // 1. Create or retrieve customer
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      customer = existing.data[0];
      // Attach new payment method
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    // 2. Update default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // 3. Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice;
    const paymentIntent = invoice.payment_intent;

    // 4. Check if 3D Secure is required
    if (paymentIntent.status === 'requires_action') {
      return res.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id,
      });
    }

    if (paymentIntent.status === 'succeeded' || subscription.status === 'active') {
      return res.json({
        success: true,
        subscriptionId: subscription.id,
        customerId: customer.id,
        plan: priceId.includes('elite') ? 'elite' : 'pro',
      });
    }

    res.json({ error: 'Payment failed. Please try again.' });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
// POST /api/cancel
// Cancels a subscription at period end
// ──────────────────────────────────────────────
app.post('/api/cancel', async (req, res) => {
  const { subscriptionId } = req.body;
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    res.json({ success: true, cancelAt: subscription.cancel_at });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
// POST /api/webhook
// Stripe webhook handler (for production)
// ──────────────────────────────────────────────
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  switch (event.type) {
    case 'customer.subscription.created':
      console.log('✅ New subscription:', event.data.object.id);
      // TODO: Update your database, send welcome email
      break;
    case 'customer.subscription.deleted':
      console.log('❌ Subscription cancelled:', event.data.object.id);
      // TODO: Revoke access in your database
      break;
    case 'invoice.payment_failed':
      console.log('💸 Payment failed:', event.data.object.customer);
      // TODO: Send dunning email
      break;
    case 'invoice.payment_succeeded':
      console.log('💰 Payment succeeded:', event.data.object.id);
      break;
  }

  res.json({ received: true });
});

// ──────────────────────────────────────────────
// GET /api/health
// ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Tiny Trader Academy server running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}\n`);
});
