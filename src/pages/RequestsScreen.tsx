import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserCircle,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

https://samaj-backend-nqjq.onrender.com

// 🔹 Login થયેલા user ની ઓળખ
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

type MatchRequest = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: string; // "pending" | "accepted" | "rejected"
  created_at: string;
  // future use – જો backend side join કરો તો:
  other_name?: string;
  other_avatar_url?: string;
};

export default function RequestsScreen() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || null;

  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">(
    "incoming"
  );

  const [incoming, setIncoming] = useState<MatchRequest[]>([]);
  const [outgoing, setOutgoing] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // LOAD REQUESTS
  // ---------------------------
  const loadRequests = async () => {
    if (!currentUserId) return;

    setLoading(true);
    setError(null);

    try {
      const [inRes, outRes] = await Promise.all([
        fetch(`${API_URL}/requests/incoming?userId=${currentUserId}`),
        fetch(`${API_URL}/requests/outgoing?userId=${currentUserId}`),
      ]);

      const inJson = await inRes.json();
      const outJson = await outRes.json();

      if (!inJson.success) throw new Error(inJson.error || "Incoming error");
      if (!outJson.success) throw new Error(outJson.error || "Outgoing error");

      setIncoming(inJson.data || []);
      setOutgoing(outJson.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "કઈક તકલીફ આવી");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;
    loadRequests();
  }, [currentUserId]);

  // ---------------------------
  // ACCEPT / REJECT HANDLERS
  // ---------------------------
  const handleAction = async (req: MatchRequest, action: "accept" | "reject") => {
    if (!currentUserId) return;
    setActionLoadingId(req.id);

    try {
      const res = await fetch(`${API_URL}/requests/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: req.id,
          action,
          currentUserId,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        alert(json.error || "Action failed");
      } else {
        // ફરીથી list reload
        await loadRequests();
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("gu-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="p-4 bg-deep-blue text-white flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="font-gujarati font-semibold text-lg">
              રીક્વેસ્ટ ઇનબોક્સ
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <p className="font-gujarati text-gray-600">
            પહેલા Login કરો. ત્યારબાદ રીક્વેસ્ટ ઇનબોક્સ ચાલુ થશે.
          </p>
        </div>
      </div>
    );
  }

  const list = activeTab === "incoming" ? incoming : outgoing;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <div className="p-4 bg-deep-blue text-white flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="font-gujarati font-semibold text-lg">
            રીક્વેસ્ટ ઇનબોક્સ
          </div>
          <div className="text-xs text-white/80">
            {currentUser?.name} ({currentUser?.phone})
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white px-4 pt-3 pb-2 border-b border-gray-200 flex space-x-2">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`flex-1 py-2 rounded-2xl text-sm font-gujarati ${
            activeTab === "incoming"
              ? "bg-deep-blue text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          મને આવેલી રીક્વેસ્ટ
        </button>
        <button
          onClick={() => setActiveTab("outgoing")}
          className={`flex-1 py-2 rounded-2xl text-sm font-gujarati ${
            activeTab === "outgoing"
              ? "bg-deep-blue text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          મેં મોકલેલી રીક્વેસ્ટ
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <div className="text-center text-gray-500 font-gujarati mt-10">
            લોડ થઈ રહ્યું છે...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl font-gujarati">
            {error}
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="text-center text-gray-400 font-gujarati mt-10 text-sm">
            અહીં હજી સુધી કોઈ રીક્વેસ્ટ નથી.
          </div>
        )}

        {!loading &&
          !error &&
          list.map((req) => {
            const isIncoming = activeTab === "incoming";

            const labelOtherId = isIncoming
              ? req.from_user_id
              : req.to_user_id;

            let statusColor = "bg-gray-100 text-gray-600";
            let statusLabel = "Pending";

            if (req.status === "accepted") {
              statusColor = "bg-green-100 text-green-700";
              statusLabel = "Accepted";
            } else if (req.status === "rejected") {
              statusColor = "bg-red-100 text-red-700";
              statusLabel = "Rejected";
            }

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl shadow-sm p-4 flex space-x-3 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
                  <UserCircle className="w-7 h-7 text-deep-blue" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-gujarati font-semibold text-gray-800 text-sm">
                      બીજા user id: {labelOtherId}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColor}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center text-[11px] text-gray-500 space-x-1">
                    <Clock3 className="w-3 h-3" />
                    <span>{formatDate(req.created_at)}</span>
                  </div>

                  {isIncoming && req.status === "pending" && (
                    <div className="flex space-x-2 pt-2">
                      <button
                        disabled={actionLoadingId === req.id}
                        onClick={() => handleAction(req, "accept")}
                        className="flex-1 flex items-center justify-center space-x-1 bg-mint text-deep-blue font-gujarati text-xs py-2 rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>સ્વીકારો</span>
                      </button>
                      <button
                        disabled={actionLoadingId === req.id}
                        onClick={() => handleAction(req, "reject")}
                        className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-700 font-gujarati text-xs py-2 rounded-xl"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>નકારો</span>
                      </button>
                    </div>
                  )}

                  {!isIncoming && (
                    <p className="text-[11px] text-gray-500 font-gujarati pt-1">
                      સ્થિતિ: {statusLabel}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
