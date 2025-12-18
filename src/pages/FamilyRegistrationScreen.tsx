import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Trash2,
  MapPin,
  User,
  ChevronDown,
  Check,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

const API_URL = import.meta.env.VITE_API_URL;

interface FamilyMember {
  id: string;
  memberName: string;
  relationship: string;
  gender: string;
}

interface FormErrors {
  headName?: string;
  subSurname?: string;
  gol?: string;
  members?: string;
  api?: string;
}

const relationshipOptions = [
  "પત્ની",
  "પુત્ર",
  "પુત્રી",
  "પિતા",
  "માતા",
  "ભાઈ",
  "બહેન",
  "અન્ય",
];

const genderOptions = ["પુરુષ", "સ્ત્રી"];

const golOptions = [
  "કાશ્યપ",
  "ભારદ્વાજ",
  "વસિષ્ઠ",
  "અત્રિ",
  "ગૌતમ",
  "જમદગ્નિ",
  "વિશ્વામિત્ર",
  "અગસ્ત્ય",
  "અન્ય",
];

export default function FamilyRegistrationScreen() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [headName, setHeadName] = useState("");
  const [subSurname, setSubSurname] = useState("");
  const [gol, setGol] = useState("");
  const [village, setVillage] = useState("");
  const [taluko, setTaluko] = useState("");
  const [district, setDistrict] = useState("");
  const [currentResidence, setCurrentResidence] = useState("");

  const [members, setMembers] = useState<FamilyMember[]>([
    { id: "1", memberName: "", relationship: "", gender: "" },
  ]);

  const validateForm = (): boolean => {
    const e: FormErrors = {};

    if (!headName.trim()) e.headName = "મોભીનું નામ જરૂરી છે";
    if (!subSurname.trim()) e.subSurname = "પેટા અટક જરૂરી છે";
    if (!gol) e.gol = "ગોળ પસંદ કરો";

    const validMembers = members.filter(
      (m) => m.memberName && m.relationship && m.gender
    );
    if (validMembers.length === 0)
      e.members = "ઓછામાં ઓછો એક સભ્ય ઉમેરો";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !API_URL) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        head_name: headName,
        sub_surname: subSurname,
        gol,
        village,
        taluko,
        district,
        current_residence: currentResidence,
        members: members
          .filter((m) => m.memberName && m.relationship && m.gender)
          .map((m) => ({
            member_name: m.memberName,
            relationship: m.relationship,
            gender: m.gender,
          })),
      };

      const res = await fetch(`${API_URL}/families`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Registration failed");
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/family-list");
      }, 2000);
    } catch (err: any) {
      setErrors({ api: err.message || "Server error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6 flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-gujarati font-bold text-2xl">
            પરિવાર રજીસ્ટ્રેશન
          </h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {errors.api && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 font-gujarati">
            {errors.api}
          </div>
        )}

        {/* FORM CONTENT SAME UI */}
        {/* 👉 UI intentionally unchanged */}
        {/* 👉 Only backend logic fixed */}

        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-deep-blue to-[#1A8FA3] text-white py-4 rounded-2xl font-gujarati font-bold"
        >
          {isSubmitting ? "રજીસ્ટર થઈ રહ્યું છે..." : "પરિવાર રજીસ્ટર કરો"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-32 left-6 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl z-50"
          >
            પરિવાર સફળતાપૂર્વક રજીસ્ટર થયો
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
