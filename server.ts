import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Payment Gateway Configuration
const PAYMENT_CONFIG = {
  bkash: {
    name: "bKash",
    number: "01700-123456",
    rawNumber: "01700123456",
    accountType: "Merchant / Personal Wallet",
    reference: "BANANAJI",
    schemes: {
      custom: "bkash://app",
      sendMoney: "bkash://sendmoney",
      payment: "bkash://payment",
      androidPackage: "com.bKash.customerapp",
      androidIntent: "intent://#Intent;package=com.bKash.customerapp;scheme=bkash;end;",
      playStore: "https://play.google.com/store/apps/details?id=com.bKash.customerapp",
      appStore: "https://apps.apple.com/app/bkash/id1439246187"
    },
    instructions: [
      "Tap 'Pay with bKash App' to open your bKash application automatically.",
      "If the app does not open, open your bKash App manually or dial *247#.",
      "Select 'Send Money' or 'Make Payment' to number: 01700-123456.",
      "Enter exact payable amount and reference: BANANAJI.",
      "Enter your bKash PIN to confirm transaction.",
      "Copy the 10-character Transaction ID (TrxID) and return here to complete your order."
    ]
  },
  nagad: {
    name: "Nagad",
    number: "01800-654321",
    rawNumber: "01800654321",
    accountType: "Merchant / Personal Wallet",
    reference: "BANANAJI",
    schemes: {
      custom: "nagad://app",
      sendMoney: "nagad://sendmoney",
      payment: "nagad://payment",
      androidPackage: "com.konasl.nagad",
      androidIntent: "intent://#Intent;package=com.konasl.nagad;scheme=nagad;end;",
      playStore: "https://play.google.com/store/apps/details?id=com.konasl.nagad",
      appStore: "https://apps.apple.com/app/nagad/id1471844874"
    },
    instructions: [
      "Tap 'Pay with Nagad App' to open your Nagad application automatically.",
      "If the app does not open, open your Nagad App manually or dial *167#.",
      "Select 'Send Money' or 'Merchant Pay' to number: 01800-654321.",
      "Enter exact payable amount and reference: BANANAJI.",
      "Enter your Nagad PIN to confirm transaction.",
      "Copy the Transaction ID (TrxID) and return here to complete your order."
    ]
  }
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Banana Ji - Unripe Harvest" });
});

// GET /api/payments/config - Returns mobile wallet payment configs & numbers
app.get("/api/payments/config", (req, res) => {
  res.json({
    success: true,
    gateways: PAYMENT_CONFIG
  });
});

// POST /api/payments/generate-deep-link - Generates app deep links & intent strings
app.post("/api/payments/generate-deep-link", (req, res) => {
  const { gateway, amount, orderId, reference } = req.body;
  const gw = gateway === "nagad" ? PAYMENT_CONFIG.nagad : PAYMENT_CONFIG.bkash;
  const ref = reference || orderId || "BANANAJI";
  const num = gw.rawNumber;

  let deepLinkUrl = gw.schemes.custom;
  if (gateway === "bkash") {
    deepLinkUrl = `bkash://payment?receiver=${num}&amount=${amount}&ref=${encodeURIComponent(ref)}`;
  } else if (gateway === "nagad") {
    deepLinkUrl = `nagad://sendmoney?account=${num}&amount=${amount}&ref=${encodeURIComponent(ref)}`;
  }

  res.json({
    success: true,
    gateway: gw.name,
    accountNumber: gw.number,
    rawNumber: gw.rawNumber,
    amount,
    reference: ref,
    deepLinkUrl,
    androidIntent: gw.schemes.androidIntent,
    playStore: gw.schemes.playStore,
    appStore: gw.schemes.appStore,
    instructions: gw.instructions
  });
});

// POST /api/payments/verify-manual - Log and record manual transaction verification submissions
app.post("/api/payments/verify-manual", (req, res) => {
  const { orderId, gateway, senderNumber, transactionId, amount } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, error: "Missing orderId" });
  }

  console.log(`[Payment Log] Manual verification received for Order: ${orderId}, Gateway: ${gateway}, Sender: ${senderNumber}, TrxID: ${transactionId}, Amount: ${amount}`);

  res.json({
    success: true,
    orderId,
    paymentStatus: "Pending Verification",
    gateway,
    senderNumber: senderNumber || null,
    transactionId: transactionId || null,
    recordedAt: new Date().toISOString(),
    message: "Payment details recorded. Order marked as Pending Verification."
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Banana Ji server running on http://localhost:${PORT}`);
  });
}

startServer();
