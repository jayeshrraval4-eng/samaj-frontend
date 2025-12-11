import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function RegisterEmailScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleNext = (e: any) => {
    e.preventDefault();

    // email optional है, लेकिन अगर दिया हो तो basic check
    if (email && !email.includes("@")) {
      alert("માન્ય ઇમેઇલ દાખલ કરો અથવા ખાલી રાખો.");
      return;
    }

    // Email को RegisterDetailsScreen में पास करेंगे
    navigate("/register-details", {
      state: { email },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-center font-gujarati text-2xl mb-4">
          તમારું ઇમેઇલ નાખો (ઐચ્છિક)
        </h2>

        <form onSubmit={handleNext} className="space-y-4">
          <input
            type="email"
            placeholder="Email નાખો (optional)"
            className="w-full px-4 py-3 border rounded-xl font-gujarati"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-deep-blue text-white py-3 rounded-xl font-gujarati"
          >
            આગળ વધો
          </button>
        </form>

        <p
          onClick={() => navigate("/login")}
          className="text-center text-sm mt-4 text-black font-gujarati cursor-pointer"
        >
          પહેલેથી એકાઉન્ટ છે? લોગિન કરો
        </p>
      </motion.div>
    </div>
  );
}
