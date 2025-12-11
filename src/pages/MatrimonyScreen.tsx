import { useState, useEffect, useMemo } from "react";
import { Search, Heart, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

https://samaj-backend-nqjq.onrender.com

// Read current user from localStorage
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const user = getCurrentUser();
const currentUserId = user?.phone || null;
const currentUserGender = user?.gender || null; // IMPORTANT

type TabType = "list" | "detail" | "myprofile";

interface ProfileRow {
  id: string;
  phone: string | null;
  full_name: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  sub_surname?: string | null;
  mother_sub_surname?: string | null;
  gol?: string | null;
  age?: number | null;
  city?: string | null;
  taluka?: string | null;
  district?: string | null;
  education?: string | null;
  occupation?: string | null;
  kundali_available?: boolean | null;
  birth_date?: string | null;
  gender?: string | null;
  avatar_url?: string | null;
}

// Profile complete check
function isProfileComplete(p: ProfileRow | null | undefined) {
  if (!p) return false;

  return (
    !!p.full_name &&
    !!p.father_name &&
    !!p.mother_name &&
    !!p.sub_surname &&
    !!p.mother_sub_surname &&
    !!p.gol &&
    p.age != null &&
    !!p.city &&
    !!p.taluka &&
    !!p.district &&
    !!p.education &&
    !!p.occupation &&
    !!p.birth_date &&
    !!p.gender
  );
}

export default function MatrimonyScreen() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>("list");
  const [selectedProfile, setSelectedProfile] = useState<ProfileRow | null>(null);

  const [canChat, setCanChat] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);

  // Form states…
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [subSurname, setSubSurname] = useState("");
  const [motherSubSurname, setMotherSubSurname] = useState("");
  const [gol, setGol] = useState("");
  const [age, setAge] = useState("");
  const [village, setVillage] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"પુરુષ" | "સ્ત્રી">("પુરુષ");
  const [kundali, setKundali] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/profiles`);
      const json = await res.json();
      setProfiles(json.data || []);
    } catch (err) {
      console.log("PROFILE LOAD ERR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // My profile
  const myProfile = useMemo(() => {
    if (!currentUserId) return null;
    return profiles.find((p) => p.phone === currentUserId) || null;
  }, [profiles]);

  const myProfileComplete = isProfileComplete(myProfile);

  useEffect(() => {
    if (!myProfile) return;

    setFullName(myProfile.full_name || "");
    setFatherName(myProfile.father_name || "");
    setMotherName(myProfile.mother_name || "");
    setSubSurname(myProfile.sub_surname || "");
    setMotherSubSurname(myProfile.mother_sub_surname || "");
    setGol(myProfile.gol || "");
    setAge(myProfile.age ? String(myProfile.age) : "");
    setVillage(myProfile.city || "");
    setTaluka(myProfile.taluka || "");
    setDistrict(myProfile.district || "");
    setEducation(myProfile.education || "");
    setOccupation(myProfile.occupation || "");
    setBirthDate(myProfile.birth_date || "");
    setGender(myProfile.gender === "સ્ત્રી" ? "સ્ત્રી" : "પુરુષ");
    setKundali(!!myProfile.kundali_available);
  }, [myProfile]);

  const completeProfiles = profiles.filter((p) => isProfileComplete(p));

  useEffect(() => {
    if (!selectedProfile && completeProfiles.length > 0) {
      setSelectedProfile(completeProfiles[0]);
    }
  }, [completeProfiles]);

  // CHAT/MATCH CHECK AUTO
  useEffect(() => {
    if (!selectedProfile || !currentUserId) return;

    const check = async () => {
      try {
        const res = await fetch(
          `${API_URL}/check-match?user1=${currentUserId}&user2=${selectedProfile.phone}`
        );
        const json = await res.json();

        if (json.matched) {
          setCanChat(true);
          setMatchId(json.match_id);
        } else {
          setCanChat(false);
          setMatchId(null);
        }
      } catch (err) {}
    };

    check();
  }, [selectedProfile]);

  // ⭐ RESTRICTION LOGIC FOR MALE USERS
  const blockIfMale = () => {
    if (currentUserGender === "સ્ત્રી") return false; // female = always allowed
    alert("🔒 સબ્સ્ક્રિપ્શન વગર આ સુવિધા ઉપલબ્ધ નથી.");
    return true;
  };

  // SAVE PROFILE
  const handleSaveMyProfile = async () => {
    if (blockIfMale()) return;

    try {
      setSavingProfile(true);

      const body = {
        phone: currentUserId,
        full_name: fullName,
        father_name: fatherName,
        mother_name: motherName,
        sub_surname: subSurname,
        mother_sub_surname: motherSubSurname,
        gol,
        age: Number(age),
        city: village,
        taluka,
        district,
        education,
        occupation,
        birth_date: birthDate,
        gender,
        kundali_available: kundali,
      };

      const res = await fetch(`${API_URL}/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        alert("પ્રોફાઈલ સેવ થઈ!");
        loadProfiles();
      } else alert("ERROR");
    } catch (err) {
      alert("Server error");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">લોડ થઈ રહ્યું છે...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-6">
        <h1 className="text-white font-gujarati text-2xl font-bold">
          મેટ્રિમોની
        </h1>
        <p className="text-white/80 text-sm font-gujarati">
          આદર્શ જીવનસાથી શોધો
        </p>
      </div>

      {/* TABS */}
      <div className="bg-white border-b px-6 pt-4 sticky top-0 z-10">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-3 ${
              activeTab === "list"
                ? "text-deep-blue border-b-2 border-deep-blue"
                : "text-gray-500"
            } font-gujarati`}
          >
            પ્રોફાઈલ લિસ્ટ
          </button>

          <button
            onClick={() => setActiveTab("detail")}
            disabled={!selectedProfile}
            className={`pb-3 ${
              activeTab === "detail"
                ? "text-deep-blue border-b-2 border-deep-blue"
                : "text-gray-500"
            } font-gujarati`}
          >
            પ્રોફાઈલ વિગત
          </button>

          <button
            onClick={() => setActiveTab("myprofile")}
            className={`pb-3 ${
              activeTab === "myprofile"
                ? "text-deep-blue border-b-2 border-deep-blue"
                : "text-gray-500"
            } font-gujarati`}
          >
            મારી પ્રોફાઈલ
          </button>
        </div>
      </div>

      {/* ================= LIST TAB ================= */}
      {activeTab === "list" && (
        <div className="px-6 py-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3 border rounded-xl font-gujarati"
              placeholder="શોધો..."
            />
          </div>

          {completeProfiles.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="premium-card p-4"
            >
              <div className="flex space-x-4">
                <img
                  src={p.avatar_url || "https://via.placeholder.com/120"}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-gujarati font-bold">
                    {p.full_name || "નામ નથી"}
                  </h3>
                  <p className="font-gujarati text-sm">વય: {p.age}</p>
                  <p className="font-gujarati text-sm">ગામ: {p.city}</p>
                  <p className="text-sm text-gray-600 font-gujarati">
                    ગોળ: {p.gol}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-3">
                <button
                  onClick={() => {
                    setSelectedProfile(p);
                    setActiveTab("detail");
                  }}
                  className="flex-1 bg-deep-blue text-white py-2 rounded-xl font-gujarati"
                >
                  વિગત જુઓ
                </button>

                <button className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* =============== DETAIL TAB ================= */}
      {activeTab === "detail" && selectedProfile && (
        <motion.div
          className="px-6 py-6 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Banner Image */}
          <img
            src={selectedProfile.avatar_url || "https://via.placeholder.com/300"}
            className="w-full h-80 rounded-xl object-cover"
          />

          <div className="premium-card p-6 space-y-2">
            <h2 className="text-xl font-gujarati font-bold">વ્યક્તિગત વિગત</h2>

            <p className="font-gujarati">
              <b>નામ:</b> {selectedProfile.full_name}
            </p>
            <p className="font-gujarati">
              <b>પિતાનું નામ:</b> {selectedProfile.father_name}
            </p>
            <p className="font-gujarati">
              <b>માતાનું નામ:</b> {selectedProfile.mother_name}
            </p>

            <p className="font-gujarati">
              <b>વય:</b> {selectedProfile.age}
            </p>
            <p className="font-gujarati">
              <b>ગામ:</b> {selectedProfile.city}
            </p>
            <p className="font-gujarati">
              <b>ગોળ:</b> {selectedProfile.gol}
            </p>

            <p className="font-gujarati">
              <b>શિક્ષણ:</b> {selectedProfile.education}
            </p>
            <p className="font-gujarati">
              <b>નોખરી/ધંધો:</b> {selectedProfile.occupation}
            </p>

            {selectedProfile.kundali_available && (
              <p className="font-gujarati text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                કુંડળી ઉપલબ્ધ
              </p>
            )}
          </div>

          {/* SEND REQUEST → BLOCK MALE */}
          <button
            onClick={async () => {
              if (blockIfMale()) return;

              try {
                await fetch(`${API_URL}/send-request`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    from_user_id: currentUserId,
                    to_user_id: selectedProfile.phone,
                  }),
                });

                alert("રીક્વેસ્ટ મોકલાઈ ગઈ ❤️");
              } catch (err) {
                alert("Error");
              }
            }}
            className="w-full bg-mint text-deep-blue font-bold py-3 rounded-xl font-gujarati"
          >
            રીક્વેસ્ટ મોકલો
          </button>

          {/* CHAT */}
          {canChat && matchId && (
            <button
              onClick={() => {
                if (blockIfMale()) return;

                navigate(
                  `/messages?matchId=${matchId}&other=${selectedProfile.phone}`
                );
              }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-gujarati font-bold"
            >
              ચેટ કરો 💬
            </button>
          )}
        </motion.div>
      )}

      {/* ======================= MY PROFILE TAB ======================= */}
      {activeTab === "myprofile" && (
        <motion.div
          className="px-6 py-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-xl font-gujarati font-bold text-center">
            મારી મેટ્રિમોની પ્રોફાઈલ
          </h2>

          {[
            { label: "નામ", value: fullName, setter: setFullName },
            { label: "પિતાનું નામ", value: fatherName, setter: setFatherName },
            { label: "માતાનું નામ", value: motherName, setter: setMotherName },
            { label: "પેટા અટક", value: subSurname, setter: setSubSurname },
            {
              label: "માતાની પેટા અટક",
              value: motherSubSurname,
              setter: setMotherSubSurname,
            },
            { label: "ગોળ", value: gol, setter: setGol },
            { label: "વય", value: age, setter: setAge },
            { label: "ગામ", value: village, setter: setVillage },
            { label: "તાલુકો", value: taluka, setter: setTaluka },
            { label: "જીલ્લો", value: district, setter: setDistrict },
            { label: "શિક્ષણ", value: education, setter: setEducation },
            { label: "નોખરી/ધંધો", value: occupation, setter: setOccupation },
          ].map((f, i) => (
            <div key={i}>
              <label className="font-gujarati text-gray-600 text-sm">
                {f.label}
              </label>
              <input
                className="w-full px-4 py-2 border rounded-xl font-gujarati"
                value={f.value}
                onChange={(e) => f.setter(e.target.value)}
                placeholder={`${f.label} દાખલ કરો`}
              />
            </div>
          ))}

          {/* DOB */}
          <div>
            <label className="font-gujarati text-gray-600 text-sm">
              જન્મ તારીખ
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-xl"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="font-gujarati text-gray-600 text-sm">
              લિંગ
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "પુરુષ"}
                  onChange={() => setGender("પુરુષ")}
                />
                <span className="font-gujarati">પુરુષ</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  checked={gender === "સ્ત્રી"}
                  onChange={() => setGender("સ્ત્રી")}
                />
                <span className="font-gujarati">સ્ત્રી</span>
              </label>
            </div>
          </div>

          {/* KUNDALI */}
          <div className="flex items-center justify-between mt-2">
            <span className="font-gujarati text-sm text-gray-600">
              કુંડળી ઉપલબ્ધ?
            </span>
            <input
              type="checkbox"
              checked={kundali}
              onChange={(e) => setKundali(e.target.checked)}
            />
          </div>

          <button
            className="w-full bg-deep-blue text-white py-3 mt-3 rounded-xl font-gujarati"
            disabled={savingProfile}
            onClick={handleSaveMyProfile}
          >
            {savingProfile ? "સેવ થઈ રહ્યું છે..." : "પ્રોફાઈલ સેવ કરો"}
          </button>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
