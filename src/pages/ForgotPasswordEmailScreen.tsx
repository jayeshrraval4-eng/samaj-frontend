import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordEmailScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const sendOTP = async () => {
    if (!email.trim()) return alert("ઈમેઈલ નાખો");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }
    });

    if (error) return alert("OTP Error!");

    alert("OTP મોકલાયો ✔");
    navigate(`/forgot-verify?email=${email}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-gujarati text-xl font-bold">પાસવર્ડ રીસેટ</h1>

      <input
        type="email"
        placeholder="ઈમેઈલ નાખો"
        className="w-full p-3 border rounded-xl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={sendOTP}
        className="w-full bg-deep-blue text-white p-3 rounded-xl font-gujarati"
      >
        OTP મોકલો
      </button>
    </div>
  );
}
