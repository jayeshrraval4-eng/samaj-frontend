import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function RegisterVerifyScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl text-center space-y-6"
      >
        <h2 className="font-gujarati text-2xl">આગળ વધવા તૈયાર છો?</h2>

        <p className="text-gray-600 font-gujarati">
          હવે તમારી બેસિક ડીટેઇલ્સ નાખો અને એકાઉન્ટ બનાવો.
        </p>

        <button
          onClick={() => navigate("/register-details")}
          className="w-full bg-deep-blue text-white py-3 rounded-xl font-gujarati mt-4"
        >
          આગળ વધો
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-center text-black text-sm font-gujarati cursor-pointer"
        >
          પહેલેથી એકાઉન્ટ છે? લોગિન કરો
        </p>
      </motion.div>
    </div>
  );
}
