import { Send, Bot, User, Mic, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import BottomNav from "../components/BottomNav";


type Msg = {
  id: string;
  type: "user" | "bot" | "info";
  message: string;
};

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "welcome",
      type: "bot",
      message:
        "નમસ્તે 🙏 હું તમારો AI જ્ઞાન સહાયક છું. તમે Gujarati માં બોલો કે લખો — હું Gujarati માં જ જવાબ આપું છું.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, recording]);

  // 🔊 Gujarati voice
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const gu =
      voices.find((v) => /gu|hindi|hi|india/i.test(v.lang)) || voices[0];
    if (gu) utter.voice = gu;
    utter.rate = 0.95;
    speechSynthesis.speak(utter);
  };

  // --------------------------------------------
  // SEND MESSAGE → AI CHAT OR IMAGE
  // --------------------------------------------
  const sendMessage = async (msg?: string) => {
    const text = (msg ?? input).trim();
    if (!text && !imageFile) return;

    const userMsg: Msg = {
      id: Date.now().toString(),
      type: "user",
      message: text || "(Image)",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // IF IMAGE SELECTED → SEND TO /ai-image
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        fd.append("prompt", text);

        const r = await fetch(`${API_URL}/ai-image`, {
          method: "POST",
          body: fd,
        });

        const j = await r.json();
        const reply =
          j.reply || "માફ કરશો, છબી સમજવામાં મુશ્કેલી આવી છે.";

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + "_bot", type: "bot", message: reply },
        ]);

        speakText(reply);
        setImageFile(null);
        setLoading(false);
        return;
      }

      // NORMAL TEXT → AI CHAT
      const res = await fetch(`${API_URL}/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const j = await res.json();
      const reply =
        j.reply || "માફ કરશો, હું સમજ્યો નહિ. ફરી થી કહો.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + "_bot", type: "bot", message: reply },
      ]);

      speakText(reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: "err", type: "bot", message: "AI સર્વર મુસ્બત છે." },
      ]);
    }

    setLoading(false);
  };

  // --------------------------------------------
  // SPEECH RECOGNITION (GUJARATI)
  // --------------------------------------------
  const startListening = () => {
    const w: any = window;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition supported નથી.");
      return;
    }

    const rec = new SR();
    rec.lang = "gu-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      sendMessage(text);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // --------------------------------------------
  // MANUAL AUDIO RECORD → STT API
  // --------------------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mr.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        const fd = new FormData();
        fd.append("audio", blob);

        setLoading(true);

        try {
          const r = await fetch(`${API_URL}/ai-speech-to-text`, {
            method: "POST",
            body: fd,
          });

          const j = await r.json();
          const text = j.transcript || "";

          if (text) sendMessage(text);
          else
            setMessages((prev) => [
              ...prev,
              { id: "err", type: "bot", message: "આવાજ સમજાયો નહીં." },
            ]);
        } finally {
          setLoading(false);
        }
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (err) {
      alert("Mic permission આપો.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // --------------------------------------------
  // UI + CHAT WINDOW
  // --------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-gujarati font-bold">
              જ્ઞાન સહાયક
            </h1>
            <p className="text-white/80 text-xs">AI • Voice • Image • Gujarati</p>
          </div>
        </div>
      </div>

      {/* CHAT LIST */}
      <div
        ref={scrollRef}
        className="flex-1 px-6 py-6 space-y-4 overflow-y-auto"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[85%] ${
                msg.type === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.type === "user"
                    ? "bg-deep-blue"
                    : "bg-gradient-to-br from-violet-400 to-purple-500"
                }`}
              >
                {msg.type === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              <div
                className={`px-5 py-3 rounded-2xl ${
                  msg.type === "user"
                    ? "bg-mint text-deep-blue rounded-br-sm"
                    : "bg-white border-2 border-royal-gold text-gray-800 rounded-bl-sm shadow-sm"
                }`}
              >
                <p className="text-sm font-gujarati leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex space-x-2 items-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="px-5 py-4 bg-white border-2 border-royal-gold rounded-2xl">
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-violet-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* IMAGE PICKER */}
          <label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
            />
            <div className="w-11 h-11 bg-white border rounded-xl shadow flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gray-600" />
            </div>
          </label>

          {/* INPUT BOX */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="લખો અથવા બોલો..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-gujarati"
          />

          {/* SPEECH RECOGNITION */}
          <button
            onClick={() => (listening ? stopListening() : startListening())}
            className={`w-11 h-11 border rounded-xl shadow flex items-center justify-center ${
              listening ? "bg-green-200" : "bg-white"
            }`}
          >
            <Mic
              className={`w-5 h-5 ${
                listening ? "text-green-700" : "text-gray-600"
              }`}
            />
          </button>

          {/* HOLD TO RECORD */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-11 h-11 border rounded-xl shadow flex items-center justify-center ${
              recording ? "bg-red-200" : "bg-white"
            }`}
          >
            <Mic
              className={`w-5 h-5 ${
                recording ? "text-red-700" : "text-gray-600"
              }`}
            />
          </button>

          {/* SEND BUTTON */}
          <button
            onClick={() => sendMessage()}
            className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl shadow flex items-center justify-center"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* IMAGE PREVIEW */}
        {imageFile && (
          <div className="mt-3 flex space-x-3 items-center">
            <img
              src={URL.createObjectURL(imageFile)}
              className="w-20 h-20 rounded-xl object-cover border"
            />
            <div>
              <p className="text-sm font-gujarati">{imageFile.name}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => setImageFile(null)}
                  className="px-3 py-1 bg-gray-100 rounded"
                >
                  હટાવો
                </button>
                <button
                  onClick={() => sendMessage()}
                  className="px-3 py-1 bg-deep-blue text-white rounded"
                >
                  મોકલો
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
