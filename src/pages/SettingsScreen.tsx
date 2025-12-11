import { 
  User, Globe, Bell, Lock, HelpCircle, LogOut, ChevronRight, Crown 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';


export default function SettingsScreen() {
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState<any>(null);
  const [notifEnabled, setNotifEnabled] = useState(
    localStorage.getItem("notifications") === "on"
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "gu"
  );

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // -----------------------------
  // LOAD SUBSCRIPTION FROM BACKEND
  // -----------------------------
  const loadSubscription = async () => {
    if (!user?.phone) return;

    try {
      const res = await fetch(`${API_URL}/subscriptions?phone=${user.phone}`);
      const js = await res.json();
      if (js.success) setSubscription(js.data || null);
    } catch (err) {
      console.log("SUBSCRIPTION FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  // -----------------------------
  // NOTIFICATION TOGGLE
  // -----------------------------
  const toggleNotifications = () => {
    const newVal = !notifEnabled;
    setNotifEnabled(newVal);
    localStorage.setItem("notifications", newVal ? "on" : "off");
  };

  // -----------------------------
  // LANGUAGE CHANGE
  // -----------------------------
  const changeLanguage = () => {
    const newLang = language === "gu" ? "en" : "gu";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    alert(`Language changed to ${newLang === "gu" ? "Gujarati" : "English"}`);
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  // -----------------------------
  // SETTINGS GROUPS
  // -----------------------------
  const settingsGroups = [
    {
      titleGu: "એકાઉન્ટ",
      items: [
        { icon: User, labelGu: "પ્રોફાઇલ એડિટ કરો", action: () => navigate("/profile") },
        { icon: Globe, labelGu: "ભાષા બદલો", action: changeLanguage }
      ]
    },
    {
      titleGu: "પસંદગી",
      items: [
        { icon: Bell, labelGu: "નોટિફિકેશન ચાલુ/બંધ", action: toggleNotifications },
        { icon: Lock, labelGu: "પ્રાઇવસી", action: () => alert("Privacy Page Coming Soon") }
      ]
    },
    {
      titleGu: "સહાય",
      items: [
        { icon: HelpCircle, labelGu: "મદદ અને સપોર્ટ", action: () => navigate("/about") }
      ]
    }
  ];

  // -----------------------------
  // ADMIN SHORTCUT
  // -----------------------------
  const isAdmin = user?.phone === "9999999999";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">સેટિંગ્સ</h1>
        <p className="text-white/80 text-sm">Settings & Account Options</p>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* SUBSCRIPTION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-5 flex items-center justify-between"
        >
          <div>
            <h3 className="font-gujarati font-bold text-gray-800">
              સબ્સ્ક્રિપ્શન સ્ટેટસ
            </h3>
            <p className="text-sm text-gray-500">
              {subscription
                ? `${subscription.plan_name} • Active`
                : "કોઈ Subscription નથી"}
            </p>
          </div>

          <div className="w-12 h-12 flex items-center justify-center bg-yellow-100 rounded-xl">
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
        </motion.div>

        {/* ALL GROUPS */}
        {settingsGroups.map((group, gIndex) => (
          <motion.div key={gIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            
            <h3 className="font-gujarati font-bold text-gray-800 mb-2 px-2">
              {group.titleGu}
            </h3>

            <div className="premium-card overflow-hidden">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      i !== group.items.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <p className="font-gujarati text-gray-800 font-medium">
                        {item.labelGu}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* ADMIN PANEL (hidden unless admin) */}
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate("/admin")}
            className="w-full premium-card p-4 flex items-center justify-center space-x-3 bg-purple-100 border border-purple-300"
          >
            <User className="w-6 h-6 text-purple-700" />
            <span className="font-gujarati text-purple-700 font-semibold text-lg">
              એડમિન પેનલ
            </span>
          </motion.button>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full premium-card p-4 flex items-center justify-center space-x-3 border-2 border-red-200 active:scale-95"
        >
          <LogOut className="w-6 h-6 text-red-500" />
          <span className="font-gujarati font-semibold text-red-500 text-lg">
            લોગઆઉટ કરો
          </span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
