import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import BottomNav from "../components/BottomNav";

const API_URL = import.meta.env.VITE_API_URL;

type Member = {
  name: string;
  relation: string;
  gender: string;
};

export default function FamilyRegistrationScreen() {
  const navigate = useNavigate();

  const [headName, setHeadName] = useState("");
  const [subSurname, setSubSurname] = useState("");
  const [gol, setGol] = useState("");
  const [village, setVillage] = useState("");

  const [members, setMembers] = useState<Member[]>([
    { name: "", relation: "", gender: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addMember = () => {
    setMembers([...members, { name: "", relation: "", gender: "" }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (
    index: number,
    key: keyof Member,
    value: string
  ) => {
    const copy = [...members];
    copy[index][key] = value;
    setMembers(copy);
  };

  const handleSubmit = async () => {
    if (!headName || !subSurname || !gol) {
      setError("મુખ્ય નામ, પેટા અટક અને ગોળ જરૂરી છે");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/families`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          head_name: headName,
          sub_surname: subSurname,
          gol,
          village,
          members,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error("Registration failed");
      }

      navigate("/family-list");
    } catch (err) {
      setError("Server error, ફરી પ્રયાસ કરો");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-deep-blue px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white" />
        </button>
        <h1 className="text-white font-gujarati font-bold text-xl">
          પરિવાર રજીસ્ટ્રેશન
        </h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg font-gujarati">
            {error}
          </div>
        )}

        {/* FAMILY DETAILS */}
        <input
          value={headName}
          onChange={(e) => setHeadName(e.target.value)}
          placeholder="મુખ્ય વ્યક્તિનું નામ"
          className="w-full p-3 rounded-lg border"
        />

        <input
          value={subSurname}
          onChange={(e) => setSubSurname(e.target.value)}
          placeholder="પેટા અટક"
          className="w-full p-3 rounded-lg border"
        />

        <input
          value={gol}
          onChange={(e) => setGol(e.target.value)}
          placeholder="ગોળ"
          className="w-full p-3 rounded-lg border"
        />

        <input
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          placeholder="ગામ"
          className="w-full p-3 rounded-lg border"
        />

        {/* MEMBERS */}
        <h2 className="font-gujarati font-bold mt-4">સભ્યો</h2>

        {members.map((m, i) => (
          <div key={i} className="border p-3 rounded-lg space-y-2">
            <input
              placeholder="નામ"
              value={m.name}
              onChange={(e) => updateMember(i, "name", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="સંબંધ"
              value={m.relation}
              onChange={(e) => updateMember(i, "relation", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="લિંગ"
              value={m.gender}
              onChange={(e) => updateMember(i, "gender", e.target.value)}
              className="w-full p-2 border rounded"
            />

            {members.length > 1 && (
              <button
                onClick={() => removeMember(i)}
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <Trash2 size={16} /> Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addMember}
          className="flex items-center gap-2 text-deep-blue font-gujarati"
        >
          <Plus /> સભ્ય ઉમેરો
        </button>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-deep-blue text-white py-3 rounded-lg font-gujarati font-bold"
        >
          {loading ? "Saving..." : "પરિવાર રજીસ્ટર કરો"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
