import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  MapPin,
  ChevronRight,
  Plus,
  User,
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
  taluko?: string;
  district?: string;
  current_residence?: string;
  members: FamilyMember[];
  created_at: string;
}

export default function FamilyListScreen() {
  const navigate = useNavigate();

  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchVillage, setSearchVillage] = useState("");
  const [searchGol, setSearchGol] = useState("");

  // 🔹 Unified fetch (list + search)
  const fetchFamilies = async () => {
    if (!API_URL) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (searchVillage) params.append("village", searchVillage);
      if (searchGol) params.append("gol", searchGol);

      const url = params.toString()
        ? `${API_URL}/families/search?${params.toString()}`
        : `${API_URL}/families`;

      const res = await fetch(url);
      const json = await res.json();

      if (json?.success && Array.isArray(json.families)) {
        setFamilies(json.families);
      } else {
        setFamilies([]);
      }
    } catch (err) {
      console.error("Family fetch failed:", err);
      setFamilies([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial load + debounce search
  useEffect(() => {
    const timer = setTimeout(fetchFamilies, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchVillage, searchGol]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-gujarati font-bold text-2xl">
                પરિવાર યાદી
              </h1>
              <p className="text-white/80 text-sm font-gujarati">
                રજીસ્ટર થયેલ પરિવારો
              </p>
            </div>

            <button
              onClick={() => navigate("/family-register")}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="મોભીનું નામ, પેટા અટક શોધો..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
            />
          </div>

          {/* FILTERS */}
          <div className="flex space-x-3 mt-4 overflow-x-auto hide-scrollbar">
            <input
              value={searchVillage}
              onChange={(e) => setSearchVillage(e.target.value)}
              placeholder="ગામ"
              className="px-4 py-2 bg-white/20 text-white placeholder-white/60 rounded-full text-sm font-gujarati focus:outline-none focus:bg-white/30 min-w-[100px]"
            />
            <input
              value={searchGol}
              onChange={(e) => setSearchGol(e.target.value)}
              placeholder="ગોળ"
              className="px-4 py-2 bg-white/20 text-white placeholder-white/60 rounded-full text-sm font-gujarati focus:outline-none focus:bg-white/30 min-w-[100px]"
            />
          </div>
        </div>
      </div>

      {/* COUNT */}
      <div className="px-6 py-4">
        <p className="text-sm text-gray-600 font-gujarati">
          {families.length} પરિવારો મળ્યા
        </p>
      </div>

      {/* LIST */}
      <div className="px-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <div className="w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-gujarati mt-4">
              લોડ થઈ રહ્યું છે...
            </p>
          </div>
        ) : families.length === 0 ? (
          <motion.div className="premium-card p-12 text-center">
            <Users className="w-12 h-12 text-mint mx-auto mb-4" />
            <p className="font-gujarati text-gray-600">
              કોઈ પરિવાર મળ્યો નથી
            </p>
          </motion.div>
        ) : (
          families.map((family, index) => (
            <motion.button
              key={family.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => navigate(`/family/${family.id}`)}
              className="w-full premium-card p-6 text-left"
            >
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint to-teal-500 flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>

                  <div>
                    <h3 className="font-gujarati font-bold text-gray-800">
                      {family.head_name}
                    </h3>

                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-deep-blue/10 text-deep-blue text-xs rounded-full">
                        {family.sub_surname}
                      </span>
                      <span className="px-2 py-1 bg-royal-gold/10 text-royal-gold text-xs rounded-full">
                        {family.gol}
                      </span>
                    </div>

                    {family.village && (
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {family.village}
                        {family.district && `, ${family.district}`}
                      </div>
                    )}

                    <div className="text-sm text-mint mt-1">
                      {family.members?.length ?? 0} સભ્યો
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* FLOAT ADD */}
      <motion.button
        onClick={() => navigate("/family-register")}
        className="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-br from-mint to-teal-500 rounded-full shadow-lg flex items-center justify-center"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      <BottomNav />
    </div>
  );
}
