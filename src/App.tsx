import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// AUTH SCREENS
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterEmailScreen from "./pages/RegisterEmailScreen";
import RegisterVerifyScreen from "./pages/RegisterVerifyScreen";
import RegisterDetailsScreen from "./pages/RegisterDetailsScreen";
import ForgotPasswordEmailScreen from "./pages/ForgotPasswordEmailScreen";
import ForgotPasswordVerifyScreen from "./pages/ForgotPasswordVerifyScreen";
import ForgotPasswordNewScreen from "./pages/ForgotPasswordNewScreen";

// MAIN APP SCREENS
import HomeScreen from "./pages/HomeScreen";
import MatrimonyScreen from "./pages/MatrimonyScreen";
import RequestsScreen from "./pages/RequestsScreen";
import MessagesScreen from "./pages/MessagesScreen";
import YogigramScreen from "./pages/YogigramScreen";
import ChatListScreen from "./pages/ChatListScreen";
import GeneralChatScreen from "./pages/GeneralChatScreen";
import TrustScreen from "./pages/TrustScreen";
import SubscriptionScreen from "./pages/SubscriptionScreen";
import AIAssistantScreen from "./pages/AIAssistantScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import AboutScreen from "./pages/AboutScreen";
import ContactsScreen from "./pages/ContactsScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SPLASH */}
        <Route path="/" element={<SplashScreen />} />

        {/* LOGIN */}
        <Route path="/login" element={<LoginScreen />} />

        {/* REGISTER FLOW */}
        <Route path="/register-email" element={<RegisterEmailScreen />} />
        <Route path="/verify-otp" element={<RegisterVerifyScreen />} />
        <Route path="/register-details" element={<RegisterDetailsScreen />} />

        {/* FORGOT PASSWORD FLOW */}
        <Route path="/forgot-password" element={<ForgotPasswordEmailScreen />} />
        <Route path="/forgot-verify" element={<ForgotPasswordVerifyScreen />} />
        <Route path="/forgot-new-password" element={<ForgotPasswordNewScreen />} />

        {/* MAIN FEATURES */}
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/matrimony" element={<MatrimonyScreen />} />
        <Route path="/requests" element={<RequestsScreen />} />
        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="/yogigram" element={<YogigramScreen />} />
        <Route path="/chat-list" element={<ChatListScreen />} />
        <Route path="/general-chat" element={<GeneralChatScreen />} />
        <Route path="/trust" element={<TrustScreen />} />
        <Route path="/subscription" element={<SubscriptionScreen />} />
        <Route path="/ai-assistant" element={<AIAssistantScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/contacts" element={<ContactsScreen />} />

        {/* INVALID ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
