import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import PlantRegister from "./pages/PlantRegister";
import MyPlants from "./pages/MyPlants";
import PlantDetail from "./pages/PlantDetail";
import Chat from "./pages/Chat";
import ServicePage from "./pages/ServicePage";
import MyPage from "./pages/MyPage";
import ProfileEdit from "./pages/ProfileEdit";
import NotificationSettings from "./pages/NotificationSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/plant-register" element={<PlantRegister />} />
          <Route path="/my-plants" element={<MyPlants />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/notification-settings" element={<NotificationSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
