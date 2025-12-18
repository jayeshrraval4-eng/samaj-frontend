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

// FAMILY SCREENS
import FamilyListScreen from "./pages/FamilyListScreen";
import FamilyRegistrationScreen from "./pages/FamilyRegistrationScreen";

// 🔐 SIMPLE PROTECTED ROUTE (INLINE)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem("currentUser");
  return user ? children : <Navigate to="/" replace />;
};

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

        {/* MAIN FEATURES (PROTECTED) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matrimony"
          element={
            <ProtectedRoute>
              <MatrimonyScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <RequestsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/yogigram"
          element={
            <ProtectedRoute>
              <YogigramScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-list"
          element={
            <ProtectedRoute>
              <ChatListScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/general-chat"
          element={
            <ProtectedRoute>
              <GeneralChatScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trust"
          element={
            <ProtectedRoute>
              <TrustScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <SubscriptionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIAssistantScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsScreen />
            </ProtectedRoute>
          }
        />

        {/* ✅ FAMILY ROUTES (FIXED) */}
        <Route
          path="/family-list"
          element={
            <ProtectedRoute>
              <FamilyListScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family-register"
          element={
            <ProtectedRoute>
              <FamilyRegistrationScreen />
            </ProtectedRoute>
          }
        />

        {/* INVALID ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
