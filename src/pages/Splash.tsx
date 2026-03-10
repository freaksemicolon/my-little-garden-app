import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logoMyLittleGarden from "@/assets/logo-mylittlegarden.png";
import logoRootive from "@/assets/logo-rootive.png";

const Splash = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (!user) {
        navigate("/login");
      } else {
        const hasSeenOnboarding = localStorage.getItem(`hasSeenOnboarding_${user.id}`);
        if (hasSeenOnboarding === "true") {
          navigate("/home");
        } else {
          navigate("/onboarding");
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="mobile-container flex flex-col items-center justify-center min-h-screen bg-beige-gradient">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <img src={logoMyLittleGarden} alt="MyLittleGarden" className="h-[36px] object-contain" />
      </motion.div>

      <div className="absolute bottom-12">
        <img src={logoRootive} alt="Rootive" className="h-[24px] object-contain" />
      </div>
    </div>
  );
};

export default Splash;
