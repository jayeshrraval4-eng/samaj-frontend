import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

https://samaj-backend-nqjq.onrender.com

export default function RegisterDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromStep1 = location.state?.email || "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(emailFromStep1);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("પુરુષ");  // ⭐ DEFAULT GENDER
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submitDetails = async (e: any) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !password.trim()) {
      alert("નામ, મોબાઇલ નંબર અને પાસવર્ડ જરૂરી છે!");
      return;
    }

    if (password !== confirm) {
      alert("પાસવર્ડ અને કન્ફર્મ પાસવર્ડ સરખા નથી!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          dob,
          gender,   // ⭐ IMP: BACKEND को भेजना है
          password,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.error || "Registration failed");
        return;
      }

      alert("રજીસ્ટ્રેશન સફળ થયું! હવે લોગિન કરો.");
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-center font-gujarati text-2xl mb-4">
          તમારું એકાઉન્ટ બનાવો
        </h2>

        <form onSubmit={submitDetails} className="space-y-4">
          
          {/* NAME */}
          <div>
            <label className="font-gujarati text-gray-600">નામ</label>
            <input
              className="w-full px-4 py-2 border rounded-xl font-gujarati"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="font-gujarati text-gray-600">મોબાઇલ નંબર</label>
            <input
              className="w-full px-4 py-2 border rounded-xl font-gujarati"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-gujarતી text-gray-600">ઇમેઇલ (ઐચ્છિક)</label>
            <input
              className="w-full px-4 py-2 border rounded-xl font-gujarતી"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* DOB */}
          <div>
            <label className="font-gujarતી text-gray-600">જન્મ તારીખ</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-xl font-gujarતી"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* GENDER - NEWLY ADDED */}
          <div>
            <label className="font-gujarતી text-gray-600">લિંગ પસંદ કરો</label>
            <div className="flex items-center space-x-4 mt-1">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="પુરુષ"
                  checked={gender === "પુરુષ"}
                  onChange={() => setGender("પુરુષ")}
                />
                <span className="font-gujarતી">પુરુષ</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="સ્ત્રી"
                  checked={gender === "સ્ત્રી"}
                  onChange={() => setGender("સ્ત્રી")}
                />
                <span className="font-gujarતી">સ્ત્રી</span>
              </label>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="font-gujarતી text-gray-600">પાસવર્ડ</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-xl font-gujarતી"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM */}
          <div>
            <label className="font-gujarતી text-gray-600">કન્ફર્મ પાસવર્ડ</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-xl font-gujarતી"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deep-blue text-white py-3 rounded-xl font-gujarતી"
          >
            {loading ? "રાહ જુઓ..." : "રજીસ્ટર કરો"}
          </button>
        </form>

        <p
          onClick={() => navigate("/login")}
          className="text-center text-sm mt-4 cursor-pointer font-gujarતી text-black"
        >
          પહેલેથી એકાઉન્ટ છે? લોગિન કરો
        </p>
      </motion.div>
    </div>
  );
}
