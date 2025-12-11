import { Check, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "../components/BottomNav";


// Razorpay loader
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SubscriptionScreen() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const plans = [
    {
      name: "માસિક પ્લાન",
      nameEn: "Monthly Plan",
      price: 49,
      period: "/મહિનો",
      icon: Zap,
      color: "from-mint to-teal-500",
    },
    {
      name: "વાર્ષિક પ્લાન",
      nameEn: "Yearly Plan",
      price: 480,
      period: "/વર્ષ",
      icon: Crown,
      color: "from-royal-gold to-yellow-600",
      badge: "Best Value",
      savings: "₹108 બચત",
    },
  ];

  const benefits = [
    "અમર્યાદિત પ્રોફાઈલ જોવા",
    "Unlimited profile views",
    "પ્રાયોરિટી સપોર્ટ",
    "Priority support",
    "એડવાન્સ સર્ચ ફિલ્ટર્સ",
    "Advanced filters",
    "મેસેજ રીડ રીસીપ્ટ",
    "Message read receipts",
    "એડ ફ્રિ અનુભવ",
    "Ad-free experience",
  ];

  // ⬇️ Razorpay Payment Handler
  const subscribe = async (plan: any) => {
    if (!user?.phone) {
      alert("કૃપા કરીને પહેલા Login કરો");
      return;
    }

    const sdkLoaded: any = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Razorpay load નથી થયું.");
      return;
    }

    // Create order
    const orderRes = await fetch(`${API_URL}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: plan.price }),
    });

    const { success, order, key } = await orderRes.json();

    if (!success) {
      alert("Order બનાવી શકાયું નથી.");
      return;
    }

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Yogi Samaj App",
      description: plan.name,
      order_id: order.id,

      handler: async function (response: any) {
        // Save subscription in backend
        await fetch(`${API_URL}/save-subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_phone: user.phone,
            plan_name: plan.name,
            price: plan.price,
            duration: plan.period,
            payment_id: response.razorpay_payment_id,
          }),
        });

        alert("🎉 Subscription Success!");
      },

      theme: {
        color: "#0a3d54",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // ⬆️ Payment logic complete

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint pb-24">
      {/* HEADER */}
      <div className="px-6 py-8 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-royal-gold/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-10 h-10 text-royal-gold" />
          </div>
        </motion.div>

        <h1 className="text-white font-gujarati font-bold text-3xl">
          સબ્સ્ક્રિપ્શન પ્લાન્સ
        </h1>
        <p className="text-white/80 text-sm">પ્રીમિયમ સુવિધાઓનો લાભ લો</p>
      </div>

      <div className="px-6 space-y-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="premium-card p-6 relative"
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-royal-gold to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-start space-x-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="font-gujarati font-bold text-xl">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.nameEn}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-deep-blue">
                  ₹{plan.price}
                </span>
                <span className="text-gray-600 font-gujarati">{plan.period}</span>

                {plan.savings && (
                  <p className="text-green-600 text-sm font-gujarati">{plan.savings}</p>
                )}
              </div>

              <button
                onClick={() => subscribe(plan)}
                className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 rounded-2xl font-gujarati font-semibold`}
              >
                પ્લાન સબ્સ્ક્રાઇબ કરો
              </button>
            </motion.div>
          );
        })}

        {/* BENEFITS */}
        <div className="premium-card p-6">
          <h3 className="font-gujarati font-bold text-xl mb-4">પ્રીમિયમ લાભો</h3>

          {benefits.map((b, i) => (
            <div key={i} className="flex items-center space-x-3 mb-2">
              <Check className="w-5 h-5 text-deep-blue" />
              <p className={`text-sm ${i % 2 === 0 ? "font-gujarati font-medium" : ""}`}>
                {b}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
