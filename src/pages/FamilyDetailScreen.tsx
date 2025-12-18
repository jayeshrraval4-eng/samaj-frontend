import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MapPin,
  User,
  Share2,
  Calendar,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

const API_URL = import.meta.env.VITE_API_URL;

interface FamilyMember {
  id: number;
  member_name: string;
  relationship: string;
  gender: string;
}

interface Family {
  id: number;
  head_name: string;
  sub_surname: string;
  gol: string;
  village: string;
  taluko: string;
  district: string;
  current_residence: string;
  members: FamilyMember[];
  created_at: string;
}

export default function FamilyDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchFamily();
  }, [id]);

  const fetchFamily = async () => {
    try {
      const res = await fetch(`${API_URL}/api/families/${id}`);
      const json = await res.json();
      if (res.ok && json) {
        setFamily(json);
      } else {
        setFamily(null);
      }
    } catch (err) {
      console.error("Family fetch error:", err);
      setFamily(null);
    } finally {
      setLoading(false);
    }
  };

  const getGenderIcon = (gender: string) =>
    gender === "પુરુષ" ? "👨" : "👩";

  const getRelationshipColor = (relationship: string) => {
    const colors: Record<string, string> = {
      પત્ની: "bg-pink-100 text-pink-700",
      પુત્ર: "bg-blue-100 text-blue-700",
      પુત્રી: "bg-purple-100 text-purple-700",
      પિતા: "bg-amber-100 text-amber-700",
      માતા: "bg-rose-100 text-rose-700",
      ભાઈ: "bg-cyan-100 text-cyan-700",
      બહેન: "bg-indigo-100 text-indigo-700",
    };
    return colors[relationship] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <button
          onClick={() => navigate("/family-list")}
          className="bg-deep-blue text-white px-6 py-3 rounded-xl font-gujarati"
        >
          પરિવાર મળ્યો નથી – પાછા જાઓ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-deep-blue to-[#1A8FA3] px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="text-white" />
          </button>
          <Share2 className="text-white" />
        </div>

        <h1 className="text-white font-gujarati font-bold text-2xl">
          {family.head_name}
        </h1>
        <div className="flex gap-2 mt-2">
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
            {family.sub_surname}
          </span>
          <span className="bg-royal-gold/30 text-white px-3 py-1 rounded-full text-sm">
            {family.gol}
          </span>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* LOCATION */}
        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-royal-gold" />
            <h2 className="font-gujarati font-bold">સ્થાન</h2>
          </div>
          <p>{family.village} / {family.taluko} / {family.district}</p>
        </div>

        {/* MEMBERS */}
        <div className="premium-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users />
            <h2 className="font-gujarati font-bold">સભ્યો</h2>
          </div>

          {family.members.map((m) => (
            <div key={m.id} className="flex gap-3 mb-3">
              <div>{getGenderIcon(m.gender)}</div>
              <div>
                <p className="font-semibold">{m.member_name}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRelationshipColor(
                    m.relationship
                  )}`}
                >
                  {m.relationship}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* DATE */}
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Calendar />
          {new Date(family.created_at).toLocaleDateString("gu-IN")}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
