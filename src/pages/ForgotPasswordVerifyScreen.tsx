import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ForgotPasswordVerifyScreen() {
  const [otp, setOtp] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  const verify = async () => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) return alert("OTP ખોટો!");

    alert("OTP સાચો ✔");
    navigate(`/forgot-new-password?email=${email}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-gujarati text-xl font-bold">OTP વેરીફાઈ કરો</h1>

      <input
        type="text"
        placeholder="OTP દાખલ કરો"
        className="w-full p-3 border rounded-xl"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={verify}
        className="w-full bg-green-600 text-white p-3 rounded-xl font-gujarati"
      >
        વેરીફાઈ કરો
      </button>
    </div>
  );
}
