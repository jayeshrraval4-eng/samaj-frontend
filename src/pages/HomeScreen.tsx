import {
  Bell,
  Settings,
  Heart,
  Search,
  MessageCircle,
  User,
  CreditCard,
  Building2,
  Bot,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";

const API_URL = import.meta.env.VITE_API_URL;

// 🔐 current user (safe)
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

type Stats = {
  profilesViewed: number;
  interestsSent: number;
  messages: number;
};

export default function HomeScreen() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // ✅ SAFE DEFAULT STATE (NO CRASH)
  const [stats, setStats] = useState<Stats>({
    profilesViewed: 0,
    interestsSent: 0,
    messages: 0,
  });

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // 🔹 Load dashboard stats (SAFE)
  useEffect(() => {
    if (!user?.phone || !API_URL) {
      setLoadingStats(false);
      return;
    }

    fetch(`${API_URL}/home-stats?phone=${user.phone}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data) {
          setStats({
            profilesViewed: Number(json.data.profilesViewed) || 0,
            interestsSent: Number(json.data.interestsSent) || 0,
            messages: Number(json.data.messages) || 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, [user?.phone]);

  // 🔔 Notification count (SAFE)
  useEffect(() => {
    if (!user?.phone || !API_URL) return;

    fetch(`${API_URL}/notifications/unread-count?phone=${user.phone}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.success) {
          setUnreadCount(Number(json.count) || 0);
        }
      })
      .catch(() => {});
  }, [user?.phone]);

  const featureCards = [
    { icon: Heart, title: "મેટ્રિમોની પ્રોફાઈલ", color: "from-pink-400 to-rose-500", path: "/matrimony" },
    { icon: Search, title: "પાર્ટનર શોધો", color: "from-mint to-teal-500", path: "/matrimony" },
    { icon: Users, title: "પરિવાર રજીસ્ટ્રેશન", color: "from-deep-blue to-cyan-500", path: "/family-list" },
    { icon: MessageCircle, title: "યોગીગ્રામ", color: "from-purple-400 to-indigo-500", path: "/yogigram" },
    { icon: MessageCircle, title: "મેસેજ", color: "from-blue-400 to-cyan-500", path: "/messages" },
    { icon: User, title: "મારી પ્રોફાઈલ", color: "from-amber-400 to-orange-500", path: "/profile" },
    { icon: CreditCard, title: "સબ્સ્ક્રિપ્શન", color: "from-royal-gold to-yellow-600", path: "/subscription" },
    { icon: Building2, title: "યોગી સમાજ ટ્રસ્ટ", color: "from-emerald-400 to-green-500", path: "/trust" },
    { icon: Bot, title: "જ્ઞાન સહાયક", color: "from-violet-400 to-purple-500", path: "/ai-assistant" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-gujarati font-bold text-lg">
                  {user?.full_name || "યોગી સમાજ સંબંધ"}
                </h1>
                <p className="text-mint text-xs">
                  {user?.phone || "Community Connection"}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/notifications")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE GRID */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(card.path)}
                className="premium-card p-6 hover:shadow-elevated transition-all active:scale-95"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-gujarati font-semibold text-gray-800 text-sm">
                  {card.title}
                </h3>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* STATS */}
      <div className="px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6"
        >
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-mint">
                {loadingStats ? "—" : stats.profilesViewed}
              </p>
              <p className="text-xs font-gujarati text-gray-600">Profiles Viewed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-royal-gold">
                {loadingStats ? "—" : stats.interestsSent}
              </p>
              <p className="text-xs font-gujarati text-gray-600">રસ દાખવ્યો</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-deep-blue">
                {loadingStats ? "—" : stats.messages}
              </p>
              <p className="text-xs font-gujarati text-gray-600">Messages</p>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
