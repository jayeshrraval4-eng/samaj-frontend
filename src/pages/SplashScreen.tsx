import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Handshake } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-[#0B4F6C] flex flex-col items-center justify-center overflow-hidden"
      onClick={() => navigate("/login")} // 🔥 CLICK TO ENTER → No auto-redirect
    >
      {/* Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1.5 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="w-96 h-96 rounded-full bg-royal-gold blur-3xl"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [null, Math.random() * -200],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Main Logo */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full border-4 border-royal-gold flex items-center justify-center shadow-gold">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-royal-gold to-[#C29F30] flex items-center justify-center">
              <Handshake className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold text-white font-gujarati">
            યોગી સમાજ સંબંધ
          </h1>
          <p className="text-xl text-mint font-medium">Community Connection</p>
        </motion.div>

        {/* Loader */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center space-y-4 pt-8"
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  backgroundColor: ["#9FD7C1", "#D4AF37", "#9FD7C1"],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2.5 h-2.5 rounded-full"
              />
            ))}
          </div>
          <p className="text-white/80 text-sm">Tap to continue…</p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-center space-y-2 px-6"
      >
        <p className="text-white/60 text-xs">Version 1.0.0</p>
        <p className="text-mint text-sm font-gujarati">રાવળ યોગી સમાજ માટે બનાવેલ</p>
      </motion.div>
    </div>
  );
}
