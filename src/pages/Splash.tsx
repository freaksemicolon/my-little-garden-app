import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Splash = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (!user) {
        navigate("/login");
      } else {
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
        if (hasSeenOnboarding) {
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
        <h1 className="text-[32px] font-bold tracking-tight">
          <span className="text-primary">My</span>
          <span className="text-primary">Little</span>
          <span className="text-primary">Ga</span>
          <span className="text-primary">r</span>
          <span className="text-primary">den</span>
        </h1>
      </motion.div>

      <div className="absolute bottom-12">
        <p className="text-[16px] font-semibold">
          <span className="text-foreground">R</span>
          <span className="text-primary">oo</span>
          <span className="text-foreground">tive</span>
        </p>
      </div>
    </div>
  );
};

export default Splash;
