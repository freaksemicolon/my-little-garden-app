import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import plantSucculent from "@/assets/plant-succulent.png";

const slides = [
  {
    title: "식물과 대화하세요",
    content: null,
  },
  {
    title: "가족과 함께 케어하고,\n환경까지 생각해요",
    content: null,
  },
  {
    title: "가족과 함께 케어하고,\n환경까지 생각해요",
    content: "family",
  },
  {
    title: "나의 식물 시작하기",
    content: "start",
  },
];

const Onboarding = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleStart = () => {
    navigate("/login");
  };

  // Swipe handling
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div
      className="mobile-container flex flex-col min-h-screen bg-beige-gradient"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        if (current < slides.length - 1) handleNext();
      }}
    >
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {/* Title at top */}
            <div className="px-6 pt-24 pb-8">
              <h1 className="text-[28px] font-bold text-foreground leading-[1.4] whitespace-pre-line">
                {slides[current].title}
              </h1>
            </div>

            {/* Center content area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {current === 0 && (
                <div className="flex flex-col items-center">
                  <img src={plantSucculent} alt="plant" className="w-[200px] h-[200px] object-contain" />
                </div>
              )}
              {current === 1 && (
                <div className="flex flex-col items-center">
                  {/* Empty - just title visible per Figma */}
                </div>
              )}
              {current === 2 && (
                <div className="flex flex-col items-center w-full">
                  {/* Family avatars with plant in center */}
                  <div className="relative w-[300px] h-[320px]">
                    {/* Circle outline */}
                    <div className="absolute inset-[20px] rounded-full border-2 border-border" />
                    
                    {/* Top avatar - grandma */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full bg-[hsl(30,70%,70%)] flex items-center justify-center overflow-hidden">
                      <span className="text-[40px]">👵</span>
                    </div>
                    
                    {/* Left avatar */}
                    <div className="absolute top-[120px] left-0 w-[100px] h-[100px] rounded-full bg-[hsl(260,40%,75%)] flex items-center justify-center overflow-hidden">
                      <span className="text-[40px]">👨</span>
                    </div>
                    
                    {/* Right avatar */}
                    <div className="absolute top-[120px] right-0 w-[100px] h-[100px] rounded-full bg-[hsl(340,50%,75%)] flex items-center justify-center overflow-hidden">
                      <span className="text-[40px]">👩</span>
                    </div>
                    
                    {/* Plant in center bottom */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                      <img src={plantSucculent} alt="plant" className="w-[140px] h-[140px] object-contain" />
                    </div>
                  </div>

                  {/* Notification card */}
                  <div className="w-full bg-card rounded-[16px] shadow-card p-4 mt-4 flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-[10px] bg-muted flex items-center justify-center">
                      <span className="text-[14px]">🌱</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-foreground">MyLittleGarden</p>
                      <p className="text-[12px] text-muted-foreground">2일 전 몬몬이🌱를 확인해주세요!</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">9:41 AM</span>
                  </div>
                </div>
              )}
              {current === 3 && (
                <div className="flex flex-col items-center gap-6 w-full px-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStart();
                    }}
                    className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold"
                  >
                    나의 식물 시작하기
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page indicators */}
      <div className="pb-12 flex justify-center">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-[8px] h-[8px] bg-foreground"
                  : "w-[8px] h-[8px] bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
