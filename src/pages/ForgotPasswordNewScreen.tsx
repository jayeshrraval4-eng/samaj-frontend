import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";


export default function ForgotPasswordNewScreen() {
  const [params] = useSearchParams();
  const email = params.get("email");
  const navigate = useNavigate();

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const updatePassword = async () => {
    if (pass !== confirm) return alert("Passwords mismatch!");

    const res = await fetch(`${API_URL}/profiles`);
    const json = await res.json();

    const user = json.data.find((u: any) => u.email === email);

    if (!user) return alert("User not found!");

    const upd = await fetch(`${API_URL}/update-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: user.phone,
        password: pass
      })
    });

    const out = await upd.json();
    if (out.success) {
      alert("Password changed ✔");
      navigate("/login");
    } else {
      alert("Could not change password");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-gujarati text-xl font-bold">નવો પાસવર્ડ નાખો</h1>

      <input
        type="password"
        placeholder="નવો પાસવર્ડ"
        className="w-full p-3 border rounded-xl"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />

      <input
        type="password"
        placeholder="પાસવર્ડ પુષ્ટિ કરો"
        className="w-full p-3 border rounded-xl"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button
        onClick={updatePassword}
        className="w-full bg-deep-blue text-white p-3 rounded-xl font-gujarati"
      >
        પાસવર્ડ બદલો
      </button>
    </div>
  );
}
