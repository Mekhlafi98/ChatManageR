import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { SocketProvider } from "./contexts/SocketContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { Settings } from "./pages/Settings"
import { QRCode } from "./pages/QRCode"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { BlankPage } from "./pages/BlankPage"
import { useLanguage } from "./contexts/LanguageContext"
import { cn } from "./lib/utils"

function AppContent() {
  const { isRTL } = useLanguage();

  return (
    <div className={cn("min-h-screen", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/qr/:connectionId" element={<ProtectedRoute><QRCode /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><BlankPage /></ProtectedRoute>} />
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <ThemeProvider defaultTheme="light" storageKey="ui-theme">
            <AppContent />
          </ThemeProvider>
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App