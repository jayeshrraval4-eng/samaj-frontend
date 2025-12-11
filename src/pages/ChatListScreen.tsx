import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Clock } from "lucide-react";

https://samaj-backend-nqjq.onrender.com

function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function ChatListScreen() {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  const loadChats = async () => {
    try {
      const res = await fetch(`${API_URL}/chat-list?userId=${currentUserId}`);
      const json = await res.json();
      if (json.success) setChatList(json.data);
    } catch (err) {
      console.log("Error loading chat list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* HEADER */}
      <div className="bg-deep-blue text-white px-6 py-5 shadow">
        <h1 className="text-xl font-gujarati font-semibold flex items-center space-x-2">
          <MessageSquare className="w-6 h-6" />
          <span>चैट सूची</span>
        </h1>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4 space-y-4">

        {loading && (
          <p className="text-center text-gray-500 font-gujarati">
            लोड हो रहा है…
          </p>
        )}

        {!loading && chatList.length === 0 && (
          <p className="text-center text-gray-400 font-gujarati mt-10">
            अभी तक किसी से बातचीत शुरू नहीं हुई।
          </p>
        )}

        {chatList.map((item, index) => (
          <div
            key={index}
            onClick={() =>
              navigate(`/messages?matchId=${item.match_id}&other=${item.user_id}`)
            }
            className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4 cursor-pointer hover:bg-gray-100 transition"
          >
            <img
              src={
                item.user_avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">
              <h3 className="font-gujarati text-lg font-semibold">
                {item.user_name}
              </h3>

              <p className="text-gray-600 text-sm font-gujarati">
                {item.last_message}
              </p>
            </div>

            {item.last_message_time && (
              <div className="text-gray-400 text-xs flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(item.last_message_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
