import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

https://samaj-backend-nqjq.onrender.com

type Profile = {
  id?: number;
  full_name?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  avatar_url?: string;
  avatar_base64?: string;
  [k: string]: any;
};

export default function ProfileScreen() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    email: "",
    birth_date: "",
    avatar_url: "",
    avatar_base64: "",
  });

  // Load current user from localStorage
  const getCurrentUser = (): Profile | null => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const cur = getCurrentUser();
    if (cur?.phone) {
      loadProfile(cur.phone);
    }
  }, []);

  // Load profile by phone
  async function loadProfile(phone: string) {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/profiles`);
      const j = await r.json();

      if (j.success) {
        const found = j.data.find((p: any) => p.phone == phone);
        if (found) setProfile(found);
      }
    } catch (err) {
      console.error("load profile error", err);
    }
    setLoading(false);
  }

  // Image upload → backend → returns avatar_url
  async function uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append("image", file);

    const r = await fetch(`${API_URL}/upload-avatar`, {
      method: "POST",
      body: fd,
    });

    const j = await r.json();
    if (j.success) return j.url;
    return null;
  }

  // Handle file selection
  const handleImageSelect = async (f: File | null) => {
    if (!f) return;

    // Show preview before upload
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatar_base64: String(reader.result) }));
    };
    reader.readAsDataURL(f);

    // Upload to backend
    const url = await uploadAvatar(f);
    if (url) {
      setProfile((p) => ({ ...p, avatar_url: url, avatar_base64: "" }));
    }
  };

  const onChange = (k: string, v: string) => {
    setProfile((p) => ({ ...p, [k]: v }));
  };

  // Save profile
  const saveProfile = async () => {
    if (!profile.phone || !profile.full_name) {
      alert("Name અને Phone જરૂરી છે.");
      return;
    }

    setSaving(true);

    try {
      const r = await fetch(`${API_URL}/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const j = await r.json();

      if (j.success) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            phone: profile.phone,
            full_name: profile.full_name,
            email: profile.email,
            avatar_url: profile.avatar_url,
          })
        );

        alert("Profile Updated Successfully ✅");
      } else {
        console.error(j);
        alert("Update failed.");
      }
    } catch (err) {
      console.error("save error", err);
      alert("Server error");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-deep-blue text-white px-6 py-5 shadow">
        <h1 className="text-xl font-gujarati font-semibold">મારી પ્રોફાઇલ</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="bg-white p-4 rounded-2xl shadow space-y-3">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" />
                ) : profile.avatar_base64 ? (
                  <img src={profile.avatar_base64} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            {/* Profile Inputs */}
            <input
              className="p-3 border rounded-xl w-full"
              placeholder="Full Name"
              value={profile.full_name || ""}
              onChange={(e) => onChange("full_name", e.target.value)}
            />

            <input
              className="p-3 border rounded-xl w-full"
              placeholder="Phone"
              value={profile.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
            />

            <input
              className="p-3 border rounded-xl w-full"
              placeholder="Email"
              value={profile.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
            />

            <input
              className="p-3 border rounded-xl w-full"
              placeholder="Birth Date (YYYY-MM-DD)"
              value={profile.birth_date || ""}
              onChange={(e) => onChange("birth_date", e.target.value)}
            />

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-deep-blue text-white rounded-xl"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>

              <button
                onClick={() => nav(-1)}
                className="px-4 py-2 bg-gray-100 rounded-xl"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
