import { useEffect, useState } from "react";
import { Contacts } from "@capacitor-community/contacts";
import { motion } from "framer-motion";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

https://samaj-backend-nqjq.onrender.com

function getCurrentUserId() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw).id;
  } catch {
    return null;
  }
}

export default function ContactsScreen() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);
  const [appContacts, setAppContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();

  // Load device contacts
  const loadPhoneContacts = async () => {
    try {
      const result = await Contacts.getContacts({
        projection: {
          name: true,
          phones: true,
        },
      });

      const allPhones: string[] = [];

      // Extract only phone numbers
      result.contacts.forEach((c) => {
        c.phones?.forEach((p) => {
          const clean = p.number.replace(/\D/g, "").slice(-10);
          if (clean.length === 10) allPhones.push(clean);
        });
      });

      setContacts(allPhones);
      await syncWithSupabase(allPhones);

    } catch (err) {
      alert("Contact permission allow करो");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Match contacts with app users
  const syncWithSupabase = async (phoneList: string[]) => {
    try {
      const res = await fetch(`${API_URL}/profiles`);
      const json = await res.json();

      const allUsers = json.data;

      const filtered = allUsers.filter((u: any) =>
        phoneList.includes(u.phone)
      );

      setAppContacts(filtered);
    } catch (err) {
      console.log("Supabase Sync Error", err);
    }
  };

  useEffect(() => {
    loadPhoneContacts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-gujarati">
        સંપર્ક લોડ થઈ રહ્યા છે…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-deep-blue text-white px-6 py-5 shadow">
        <h1 className="text-xl font-gujarati font-semibold">મારા Contacts</h1>
        <p className="text-white/70 text-sm font-gujarati">
          આ Contacts SamajApp ઉપયોગ કરે છે:
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {appContacts.length === 0 && (
          <p className="text-center text-gray-500 font-gujarati">
            તમારા Contacts માં SamajApp User નથી મળ્યું.
          </p>
        )}

        {appContacts.map((u, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl shadow flex items-center space-x-4"
          >
            <img
              src={
                u.avatar_url ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1">
              <h3 className="font-gujarati font-bold text-gray-800">
                {u.full_name}
              </h3>
              <p className="text-sm text-gray-600">{u.phone}</p>
            </div>

            {/* Start Chat */}
            <button
              onClick={() =>
                navigate(`/messages?matchId=auto&other=${u.phone}`)
              }
              className="bg-mint px-4 py-2 rounded-xl font-gujarati text-deep-blue"
            >
              ચેટ કરો
            </button>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
