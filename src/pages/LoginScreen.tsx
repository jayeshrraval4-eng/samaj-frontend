import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

https://samaj-backend-nqjq.onrender.com

export default function LoginScreen() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e: any) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("Please enter phone & password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/login-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.error);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(json.user));

      navigate("/home", { replace: true });
    } catch (err) {
      alert("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl"
      >
        <h2 className="text-center font-gujarati text-2xl mb-4">
          પ્રવેશ કરો
        </h2>

        <form onSubmit={loginUser} className="space-y-4">
          <input
            className="w-full border px-4 py-2 rounded-xl font-gujarati"
            placeholder="મોબાઇલ નંબર"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            className="w-full border px-4 py-2 rounded-xl font-gujarati"
            placeholder="પાસવર્ડ દાખલ કરો"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-deep-blue text-white py-3 rounded-xl font-gujarati"
            type="submit"
          >
            {loading ? "કૃપા કરીને રાહ જુઓ..." : "લોગિન કરો"}
          </button>
        </form>

        <p
          className="text-center text-sm mt-4 text-black"
          onClick={() => navigate("/register-email")}
        >
          નવું એકાઉન્ટ બનાવો?
        </p>
      </motion.div>
    </div>
  );
}
