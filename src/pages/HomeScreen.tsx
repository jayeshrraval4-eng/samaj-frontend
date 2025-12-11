import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { MessageSquare, Users, Bot, Crown, Heart } from "lucide-react";


export default function HomeScreen() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  // Load Current User
  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch {}
  }, []);

  // Load unread notifications/messages
  const loadUnread = async () => {
    if (!user?.phone) return;

    try {
      const res = await fetch(`${API_URL}/unread-count?phone=${user.phone}`);
      const json = await res.json();
      setUnreadCount(json.count || 0);
    } catch (err) {
      console.log("UNREAD ERROR:", err);
    }
  };

  // Check subscription status
  const checkSubscription = async () => {
    if (!user?.phone) return;

    try {
      const res = await fetch(`${API_URL}/check-subscription?phone=${user.phone}`);
      const json = await res.json();

      setSubscriptionActive(json.active || false);
    } catch (err) {
      console.log("SUB CHECK ERROR:", err);
    }
  };

  useEffect(() => {
    loadUnread();
    checkSubscription();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* HEADER */}
      <div className="bg-deep-blue px-6 py-7 text-white shadow">
        <h1 className="text-2xl font-gujarati font-bold">
          સ્વાગત છે {user?.full_name || "મિત્ર"} 🙏
        </h1>
        <p className="text-white/80 font-gujarati text-sm">
          તમારો દિવસ શુભ જાય!
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-6 py-6 space-y-6">

        {/* MATRIMONY CARD */}
        <div
          className="premium-card p-5 cursor-pointer"
          onClick={() => navigate("/matrimony")}
        >
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-gujarati font-bold text-deep-blue">
                મેટ્રિમોની
              </h2>
              <p className="text-gray-600 font-gujarati text-sm">
                આદર્શ જીવનસાથી શોધો
              </p>
            </div>
            <Heart className="w-10 h-10 text-pink-500" />
          </div>
        </div>

        {/* MESSAGES CARD */}
        <div
          className="premium-card p-5 cursor-pointer"
          onClick={() => navigate("/messages")}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-gujarati font-bold text-deep-blue">
                મેસેજ
              </h2>
              <p className="text-gray-600 font-gujarati text-sm">
                ચેટ અને સંદેશાઓ
              </p>
            </div>

            <div className="relative">
              <MessageSquare className="w-10 h-10 text-blue-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PUBLIC CHAT */}
        <div
          className="premium-card p-5 cursor-pointer"
          onClick={() => navigate("/public-chat")}
        >
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-gujarati font-bold text-deep-blue">
                કોમ્યુનિટી ચેટ
              </h2>
              <p className="text-gray-600 font-gujarati text-sm">
                બધા સભ્યો સાથે વાત કરો
              </p>
            </div>
            <Users className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* AI ASSISTANT */}
        <div
          className="premium-card p-5 cursor-pointer"
          onClick={() => navigate("/ai-assistant")}
        >
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-gujarati font-bold text-deep-blue">
                AI સહાયક
              </h2>
              <p className="text-gray-600 font-gujarati text-sm">
                પ્રશ્ન પૂછો, સલાહ મેળવો
              </p>
            </div>
            <Bot className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        {/* SUBSCRIPTION REMINDER — only for MALE users */}
        {user?.gender === "પુરુષ" && !subscriptionActive && (
          <div
            className="premium-card p-5 cursor-pointer bg-gradient-to-r from-yellow-200 to-orange-300"
            onClick={() => navigate("/subscription")}
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-gujarati font-bold text-deep-blue">
                  પ્રીમિયમ સબ્સ્ક્રિપ્શન
                </h2>
                <p className="text-gray-700 font-gujarati text-sm">
                  રીક્વેસ્ટ મોકલવા માટે સબ્સ્ક્રિપ્શન જરૂરી છે
                </p>
              </div>
              <Crown className="w-10 h-10 text-yellow-700" />
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
