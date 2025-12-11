import { Calendar, Users, Heart, PartyPopper, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { useEffect, useState } from "react";

https://samaj-backend-nqjq.onrender.com

export default function TrustScreen() {
  
  const [balance, setBalance] = useState(0);
  const [events, setEvents] = useState([]);
  const [opinion, setOpinion] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // LOAD TRUST DATA
  const loadTrustData = async () => {
    try {
      const bal = await fetch(`${API_URL}/trust/balance`).then(r => r.json());
      if (bal.success) setBalance(bal.balance);

      const ev = await fetch(`${API_URL}/trust/events`).then(r => r.json());
      if (ev.success) setEvents(ev.events);

    } catch (err) {
      console.log("TRUST FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    loadTrustData();
  }, []);

  // SEND OPINION
  const sendOpinion = async () => {
    if (!opinion.trim()) {
      alert("સૂચન ખાલી ના રાખો.");
      return;
    }

    await fetch(`${API_URL}/trust/opinion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_phone: user.phone,
        message: opinion.trim()
      })
    });

    alert("તમારું સૂચન મોકલાયું ✔");
    setOpinion("");
  };

  // EVENT REGISTRATION
  const registerEvent = async (id: number) => {
    if (!user.phone) {
      alert("Registration માટે Login જરૂરી છે.");
      return;
    }

    await fetch(`${API_URL}/trust/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_phone: user.phone,
        event_id: id
      })
    });

    alert("ઇવેન્ટ માટે સફળતાપૂર્વક રજીસ્ટર કર્યું ✔");
    loadTrustData();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">યોગી સમાજ ટ્રસ્ટ</h1>
        <p className="text-white/80 text-sm">સમાજ સેવા અને વિકાસ</p>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* TRUST BALANCE */}
        <motion.div className="premium-card p-8 bg-gradient-to-br from-royal-gold to-yellow-600 text-white">
          <p className="text-white/80 text-sm mb-2">Trust Balance</p>
          <h2 className="text-4xl font-bold mb-4">₹{balance.toLocaleString()}</h2>
          <p className="text-white/90 text-sm font-gujarati">સમાજ વિકાસ ફંડ</p>
        </motion.div>

        {/* EVENTS */}
        <h3 className="font-gujarati font-bold text-gray-800 text-lg px-2">આગામી કાર્યક્રમો</h3>

        {events.map((event: any, index: number) => (
          <motion.div key={event.id} className="premium-card p-6 space-y-3">

            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-gujarati font-bold text-gray-800 mb-1">{event.title}</h4>
                <p className="text-sm text-gray-600 font-gujarati">{event.description}</p>
              </div>
              <Calendar className="w-5 h-5 text-mint" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600 font-gujarati"><b>તારીખ:</b> {event.date}</p>
              <p className="text-gray-600 font-gujarati"><b>સ્થળ:</b> {event.location}</p>

              <div className="flex items-center space-x-2 bg-mint/10 px-3 py-2 rounded-xl">
                <Users className="w-4 h-4 text-deep-blue" />
                <span className="text-sm font-semibold text-deep-blue">{event.attendees}</span>
              </div>
            </div>

            <button
              onClick={() => registerEvent(event.id)}
              className="w-full bg-deep-blue text-white font-gujarati py-2.5 rounded-xl"
            >
              રજીસ્ટર કરો
            </button>

          </motion.div>
        ))}

        {/* OPINION */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-6 h-6 text-deep-blue" />
            <h3 className="font-gujarati font-bold text-gray-800">
              સમાજના યુવાનોનું મંતવ્ય
            </h3>
          </div>

          <textarea
            placeholder="તમારા વિચારો લખો..."
            rows={4}
            className="w-full px-4 py-3 border rounded-2xl font-gujarati"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
          />

          <button
            onClick={sendOpinion}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-gujarati py-3 rounded-2xl"
          >
            મોકલો
          </button>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
