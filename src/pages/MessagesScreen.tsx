import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { Send, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";


type ChatListItem = {
  match_id: number | string;
  user_id: string;
  user_name: string;
  user_avatar?: string | null;
  last_message?: string | null;
  last_message_time?: string | null;
};

type MessageRow = {
  id: number | string;
  match_id: number | string;
  sender_id: string;
  receiver_id: string;
  message: string;
  type: "text" | "image" | "audio" | string;
  image_url?: string | null;
  audio_url?: string | null;
  delivered?: boolean;
  seen?: boolean;
  created_at?: string;
};

function getCurrentUserPhone(): string | null {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user.phone || null;
  } catch {
    return null;
  }
}

export default function MessagesScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  // optional preopen values from route: ?matchId=123&other=9876543210
  const preMatchId = query.get("matchId");
  const preOther = query.get("other");

  const currentUser = getCurrentUserPhone();
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);

  const [activeMatchId, setActiveMatchId] = useState<string | number | null>(
    preMatchId || null
  );
  const [otherUserId, setOtherUserId] = useState<string | null>(
    preOther || null
  );

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<number | null>(null);

  // Auto scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 200;
    }
  }, [messages]);

  // Load chat list
  const loadChatList = async () => {
    if (!currentUser) return;
    setLoadingChats(true);
    try {
      const res = await fetch(`${API_URL}/chat-list?userId=${encodeURIComponent(currentUser)}`);
      const j = await res.json();
      if (j.success) setChatList(j.data || []);
    } catch (err) {
      console.error("chat-list err", err);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    // load chats on mount
    loadChatList();
  }, []);

  // Load messages for a match
  const loadMessages = async (mid: string | number) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`${API_URL}/messages/${mid}`);
      const j = await res.json();
      if (!j.success) {
        console.warn("messages fetch response", j);
        setMessages([]);
        return;
      }
      const msgs: MessageRow[] = j.data || [];
      setMessages(msgs);

      // mark delivered for messages where receiver is currentUser and delivered=false
      const toDeliver = msgs.filter(m => String(m.receiver_id) === String(currentUser) && !m.delivered).map(m => m.id);
      if (toDeliver.length > 0) {
        try {
          await fetch(`${API_URL}/message-delivered`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: toDeliver }),
          });
        } catch (e) { console.warn("mark delivered failed", e); }
      }

      // mark seen for messages where receiver is currentUser and seen=false
      const toSeen = msgs.filter(m => String(m.receiver_id) === String(currentUser) && !m.seen).map(m => m.id);
      if (toSeen.length > 0) {
        try {
          await fetch(`${API_URL}/message-seen`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: toSeen }),
          });
        } catch (e) { console.warn("mark seen failed", e); }
      }

    } catch (err) {
      console.error("load messages err", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // When activeMatchId changes, load messages and start polling
  useEffect(() => {
    if (!activeMatchId) return;

    loadMessages(activeMatchId);

    // start polling every 3s
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(() => {
      loadMessages(activeMatchId);
    }, 3000);

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [activeMatchId]);

  // Open chat handler
  const openChat = (item: ChatListItem) => {
    setActiveMatchId(item.match_id);
    setOtherUserId(item.user_id);
  };

  // Send text or image message
  const sendMessage = async () => {
    if (!currentUser) {
      alert("પ્રથમ લોગિન કરો.");
      return;
    }
    if (!activeMatchId || !otherUserId) {
      alert("કોઈ ચેટ ઓપન નથી.");
      return;
    }

    if (!input.trim() && !imageFile) return;

    setSending(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        setUploadingImage(true);
        // Upload image to backend (endpoint: /upload-avatar re-used as generic image uploader)
        const fd = new FormData();
        fd.append("image", imageFile, imageFile.name);
        const upRes = await fetch(`${API_URL}/upload-avatar`, {
          method: "POST",
          body: fd,
        });
        const upJ = await upRes.json();
        if (upJ.success && upJ.url) imageUrl = upJ.url;
        else {
          console.warn("image upload failed", upJ);
          alert("Image upload failed.");
        }
        setUploadingImage(false);
      }

      const payload: any = {
        match_id: activeMatchId,
        sender_id: currentUser,
        receiver_id: otherUserId,
        message: input.trim() || "",
        type: imageUrl ? "image" : "text",
        image_url: imageUrl || null,
      };

      const res = await fetch(`${API_URL}/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await res.json();
      if (!j.success) {
        console.warn("send message failed", j);
        alert("Message send failed.");
      } else {
        // add to messages locally for instant UX
        setMessages(prev => [...prev, j.data]);
        setInput("");
        setImageFile(null);
        // refresh chats list to update last message
        loadChatList();
      }
    } catch (err) {
      console.error("sendMessage err", err);
      alert("Message send error.");
    } finally {
      setSending(false);
    }
  };

  // Handle image select from input
  const onSelectImage = (f?: File | null) => {
    setImageFile(f || null);
    if (f) {
      // optional small preview message
      setMessages(prev => [...prev, { id: "local_preview_" + Date.now(), match_id: activeMatchId || "0", sender_id: currentUser || "me", receiver_id: otherUserId || "other", message: "Image attached", type: "image", image_url: URL.createObjectURL(f), created_at: new Date().toISOString() } as MessageRow]);
    }
  };

  // Mark messages seen manually (if user presses a button) - optional
  const markAllSeen = async () => {
    const toSeen = messages.filter(m => String(m.receiver_id) === String(currentUser) && !m.seen).map(m => m.id);
    if (toSeen.length === 0) return;
    try {
      await fetch(`${API_URL}/message-seen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: toSeen }),
      });
      // refresh messages
      if (activeMatchId) await loadMessages(activeMatchId);
    } catch (e) {
      console.warn("markAllSeen err", e);
    }
  };

  // UI pieces
  const ChatListView = (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="font-gujarati font-bold text-lg">ચેટસ</h2>
        <button onClick={() => loadChatList()} className="text-sm px-3 py-1 rounded bg-gray-100">Refresh</button>
      </div>

      {loadingChats ? (
        <div className="text-center py-8">લોડ થઈ રહ્યું છે…</div>
      ) : chatList.length === 0 ? (
        <div className="text-center text-gray-500 py-8">તમારા માટે કોઈ ચેટ મળી નથી.</div>
      ) : (
        chatList.map((c) => (
          <motion.div key={c.match_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-white rounded-xl flex items-center space-x-3">
            <img src={c.user_avatar || "https://via.placeholder.com/80"} className="w-14 h-14 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold font-gujarati">{c.user_name}</div>
                  <div className="text-xs text-gray-500">{c.last_message?.slice(0, 80) || "कोई संदेश नहीं"}</div>
                </div>
                <div className="text-xs text-gray-400">{c.last_message_time ? new Date(c.last_message_time).toLocaleString() : ""}</div>
              </div>
            </div>
            <div>
              <button onClick={() => openChat(c)} className="px-3 py-2 bg-deep-blue text-white rounded-xl">Open</button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const ChatView = (
    <div className="flex-1 flex flex-col">
      {/* header */}
      <div className="flex items-center space-x-3 mb-3">
        <button onClick={() => { setActiveMatchId(null); setOtherUserId(null); }} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="font-bold">{/* show other user name if avail */}</div>
          <div className="text-xs text-gray-500">Chat</div>
        </div>
        <div className="flex-1" />
        <button onClick={markAllSeen} className="text-sm px-3 py-1 bg-gray-100 rounded">Mark seen</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-3">
        {loadingMessages && <div className="text-center text-sm text-gray-500">Loading messages…</div>}
        {messages.map((m) => {
          const mine = String(m.sender_id) === String(currentUser);
          return (
            <div key={String(m.id)} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`${mine ? "bg-mint text-deep-blue" : "bg-white border"} px-4 py-3 rounded-2xl max-w-[80%]`}>
                {m.type === "image" && m.image_url ? (
                  <img src={m.image_url} alt="img" className="w-48 h-48 object-cover rounded" />
                ) : null}
                {m.message ? <div className="whitespace-pre-wrap">{m.message}</div> : null}
                <div className="text-xs text-gray-400 mt-1 text-right">{m.created_at ? new Date(m.created_at).toLocaleTimeString() : ""}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* input */}
      <div className="p-3 bg-white border-t">
        <div className="flex items-center space-x-2">
          <label className="relative">
            <input type="file" accept="image/*" className="hidden" onChange={(e)=> onSelectImage(e.target.files?.[0]||null)} />
            <button title="Attach image" className="w-11 h-11 rounded-xl bg-white border flex items-center justify-center shadow">
              <ImageIcon className="w-5 h-5 text-gray-600" />
            </button>
          </label>

          <input value={input} onChange={(e)=> setInput(e.target.value)} placeholder="લેખન કરો..." className="flex-1 px-4 py-3 bg-gray-50 border rounded-2xl" />

          <button onClick={sendMessage} disabled={sending || uploadingImage} className="w-12 h-12 rounded-xl bg-deep-blue flex items-center justify-center text-white">
            <Send className="w-5 h-5" />
          </button>
        </div>

        {imageFile && (
          <div className="mt-2 flex items-center space-x-3">
            <img src={URL.createObjectURL(imageFile)} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="font-gujarati text-sm">{imageFile.name}</div>
              <div className="flex space-x-2 mt-2">
                <button onClick={() => setImageFile(null)} className="px-3 py-1 rounded bg-gray-100">હટાવો</button>
                <button onClick={sendMessage} className="px-3 py-1 rounded bg-deep-blue text-white">મોકલવો</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="bg-deep-blue text-white px-6 py-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold font-gujarati">સંદેશો</h1>
        </div>
      </div>

      <div className="px-6 py-6 flex-1">
        {!activeMatchId ? ChatListView : ChatView}
      </div>

      <BottomNav />
    </div>
  );
}
