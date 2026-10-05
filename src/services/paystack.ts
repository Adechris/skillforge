// Paystack payment service
// Documentation: https://docs.paystack.com/

declare global {
  interface Window {
    PaystackPop: any;
  }
}

let paystackScriptLoaded = false;

export const loadPaystackScript = (): Promise<void> => {
  if (paystackScriptLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/index.js";
    script.async = true;
    script.onload = () => {
      paystackScriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.head.appendChild(script);
  });
};

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo (cents) - e.g. 100000 naira = 10000000 kobo
  currency?: string;
  label?: string;
  reference?: string;
  publicKey: string;
  amountLabel?: string;
  description?: string;
  callback?: (result: any) => void;
  onClose?: () => void;
}

export const initializePaystack = (config: PaystackConfig) => {
  const handler = window.PaystackPop.setup({
    key: config.publicKey,
    email: config.email,
    amount: config.amount,
    currency: config.currency || "NGN",
    label: config.label,
    reference: config.reference,
    amountLabel: config.amountLabel,
    description: config.description,
    callback: (result: any) => {
      if (config.callback) config.callback(result);
    },
    onClose: () => {
      if (config.onClose) config.onClose();
    },
  });
  return handler;
};

// Generate a unique payment reference
export const generateReference = (prefix: string = "SF"): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}`;
};

// Paystack public key - should be moved to env vars
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_your_public_key_here";

// Pricing constants (in kobo - 1 naira = 100 kobo)
export const PRICING = {
  ONE_ON_ONE: {
    amount: 10000000, // 100,000 NGN = 10,000,000 kobo
    label: "One-on-One Training",
    description: "Personalized web development training, one-on-one sessions",
  },
  MONTHLY: {
    amount: 1000000, // 10,000 NGN = 1,000,000 kobo
    label: "LMS Monthly Subscription",
    description: "Access to all courses and learning materials",
  },
};