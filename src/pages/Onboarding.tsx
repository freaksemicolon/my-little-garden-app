import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import plantMonstera from "@/assets/plant-monstera.png";
import plantSucculent from "@/assets/plant-succulent.png";
import plantCactus from "@/assets/plant-cactus.png";

const slides = [
  {
    title: "식물과 대화하세요",
    description: "AI가 식물의 상태를 분석하고\n맞춤 관리법을 알려드려요",
    image: plantMonstera,
  },
  {
    title: "가족과 함께 케어하고\n환경까지 생각해요",
    description: "함께 돌보는 우리 집 식물\n가족 모두가 참여할 수 있어요",
    image: plantSucculent,
  },
  {
    title: "가족과 함께 케어하고\n환경까지 생각해요",
    description: "채팅으로 소통하고\n식물 관리 기록을 공유하세요",
    image: plantCactus,
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
      className="mobile-container flex flex-col min-h-screen bg-background"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Speech bubble */}
            <div className="relative bg-secondary rounded-[20px] px-6 py-4 mb-4">
              <p className="text-[13px] text-secondary-foreground">{slides[current].description}</p>
              <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-secondary" />
            </div>

            {/* Plant image */}
            <div className="w-[200px] h-[200px] flex items-center justify-center mb-8">
              <img src={slides[current].image} alt="plant" className="w-[180px] h-[180px] object-contain" />
            </div>

            {/* Title */}
            <h1 className="text-[22px] font-bold text-foreground leading-[1.4] whitespace-pre-line">
              {slides[current].title}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators + Button */}
      <div className="px-6 pb-12 flex flex-col items-center gap-6">
        {/* Page indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-[24px] h-[8px] bg-primary"
                  : "w-[8px] h-[8px] bg-border"
              }`}
            />
          ))}
        </div>

        {current === slides.length - 1 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleStart}
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold"
          >
            나의 식물 시작하기
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
