import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BottomNav from "../components/BottomNav";


export default function GeneralChatScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const loadMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/public-chat`);
      const json = await res.json();
      if (json.success) setMessages(json.data);
    } catch (e) {
      console.log("LOAD CHAT ERROR", e);
    }
  };

  const sendMessage = async () => {
    if (!msg.trim()) return;
    if (!user?.phone) {
      alert("पहले Login करो.");
      return;
    }

    const body = {
      user_phone: user.phone,
      message: msg.trim(),
    };

    try {
      await fetch(`${API_URL}/public-chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setMsg("");
      loadMessages();
    } catch (e) {
      console.log("SEND ERROR", e);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-20">
      {/* HEADER */}
      <div className="bg-deep-blue text-white px-6 py-4 shadow">
        <h1 className="text-xl font-gujarati font-bold">સમાજ જનરલ ચેટ</h1>
        <p className="text-xs text-white/80">
          બધા સભ્યો માટે એક public chat room
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => {
          const isMe = m.user_phone === user.phone;
          return (
            <motion.div
              key={m.id || i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                isMe
                  ? "ml-auto bg-mint text-deep-blue"
                  : "mr-auto bg-white text-gray-800"
              }`}
            >
              <p className="text-[10px] text-gray-500 mb-0.5">
                {isMe ? "તમે" : m.user_phone}
              </p>
              <p className="font-gujarati break-words">{m.message}</p>
            </motion.div>
          );
        })}
      </div>

      {/* INPUT BAR */}
      <div className="fixed bottom-16 left-0 right-0 bg-white px-3 py-2 flex items-center space-x-2 border-t border-gray-200">
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm font-gujarati focus:outline-none focus:ring-2 focus:ring-mint"
          placeholder="સમાજ સાથે વાત કરો..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-deep-blue text-white text-sm px-4 py-2 rounded-full font-gujarati"
        >
          મોકલો
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
