import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import plantSucculent from "@/assets/plant-succulent.png";
import { useAuth } from "@/contexts/AuthContext";

type LightOption = "햇빛 쨍쨍" | "보통" | "빛이 적어요" | null;
type AirOption = "잘 통해요" | "보통" | "안 통해요" | null;
type PetOption = "있어요" | "없어요" | null;

const Onboarding = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [touchStart, setTouchStart] = useState(0);

  // Slide 3 state
  const [light, setLight] = useState<LightOption>(null);
  const [air, setAir] = useState<AirOption>(null);
  const [pet, setPet] = useState<PetOption>(null);

  const totalSlides = 4;

  const handleNext = () => {
    if (current < totalSlides - 1) setCurrent(current + 1);
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const chipClass = (selected: boolean) =>
    `px-5 py-2.5 rounded-full border text-[14px] font-medium transition-all ${
      selected ? "bg-[hsl(65,40%,85%)] border-[hsl(65,40%,70%)] text-foreground" : "bg-card border-border text-foreground"
    }`;

  return (
    <div
      className="mobile-container flex flex-col min-h-screen bg-beige-gradient"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
            {/* Slide 0: 식물과 대화하세요 */}
            {current === 0 && (
              <div className="flex-1 flex flex-col" onClick={handleNext}>
                <div className="px-6 pt-24 pb-4">
                  <h1 className="text-[28px] font-bold text-foreground leading-[1.4]">식물과 대화하세요</h1>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  {/* Speech bubble */}
                  <div className="bg-card rounded-[16px] shadow-card px-6 py-4 mb-2 relative">
                    <p className="text-[16px] text-foreground">안녕 {`나연`}님!{"\n"}오늘 제 기분은 어때 보이나요?</p>
                    <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-card" />
                  </div>
                  <img src={plantSucculent} alt="plant" className="w-[180px] h-[180px] object-contain mt-4" />
                </div>
                <div className="px-6 pb-4 flex flex-col gap-2">
                  <button className="w-full h-[52px] bg-primary text-primary-foreground rounded-full text-[16px] font-semibold">
                    너무 예뻐 보여!
                  </button>
                  <button className="w-full h-[52px] bg-primary/80 text-primary-foreground rounded-full text-[16px] font-semibold">
                    목마르니?
                  </button>
                </div>
              </div>
            )}

            {/* Slide 1: 가족과 함께 */}
            {current === 1 && (
              <div className="flex-1 flex flex-col" onClick={handleNext}>
                <div className="px-6 pt-24 pb-4">
                  <h1 className="text-[28px] font-bold text-foreground leading-[1.4]">
                    가족과 함께 케어하고,{"\n"}환경까지 생각해요
                  </h1>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  <div className="relative w-[300px] h-[340px]">
                    <div className="absolute inset-[20px] rounded-full border-2 border-border/50" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full bg-[hsl(30,70%,80%)] flex items-center justify-center">
                      <span className="text-[44px]">👵</span>
                    </div>
                    <div className="absolute top-[130px] left-0 w-[100px] h-[100px] rounded-full bg-[hsl(260,40%,80%)] flex items-center justify-center">
                      <span className="text-[44px]">👨</span>
                    </div>
                    <div className="absolute top-[130px] right-0 w-[100px] h-[100px] rounded-full bg-[hsl(340,50%,80%)] flex items-center justify-center">
                      <span className="text-[44px]">👩</span>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                      <img src={plantSucculent} alt="plant" className="w-[130px] h-[130px] object-contain" />
                    </div>
                  </div>

                  {/* Notification cards */}
                  <div className="w-full space-y-1 mt-2">
                    {[
                      "10분 전 동생님이 영양제💊를 주셨어요!",
                      "23분 전 아빠님이 물💧을 주셨어요!",
                      "2시간 전 엄마님이 영양제💊를 주셨어요!",
                      "1일 전 엄마님이 물💧을 주셨어요!",
                      "2일 전 몬몬이🌱를 확인해주세요!",
                    ].map((msg, i) => (
                      <div key={i} className={`bg-card/90 rounded-[12px] px-4 py-2.5 flex items-center gap-2 ${i > 0 ? "opacity-80" : ""}`}>
                        {i === 0 && (
                          <div className="flex-1">
                            <p className="text-[13px] font-semibold text-foreground">MyLittleGarden <span className="text-[11px] text-muted-foreground font-normal ml-2">9:41 AM</span></p>
                            <p className="text-[13px] text-muted-foreground">{msg}</p>
                          </div>
                        )}
                        {i > 0 && <p className="text-[12px] text-muted-foreground">{msg}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2: 주거 환경 */}
            {current === 2 && (
              <div className="flex-1 flex flex-col">
                <div className="px-6 pt-24 pb-6">
                  <h1 className="text-[28px] font-bold text-foreground leading-[1.4]">주거 환경을 알려주세요</h1>
                </div>
                <div className="px-6 flex-1 flex flex-col gap-6">
                  {/* 채광 */}
                  <div className="bg-card rounded-[16px] p-5">
                    <h3 className="text-[18px] font-bold text-foreground mb-3">채광 (햇빛)</h3>
                    <div className="flex gap-2 flex-wrap">
                      {(["햇빛 쨍쨍", "보통", "빛이 적어요"] as LightOption[]).map((opt) => (
                        <button key={opt} onClick={() => setLight(opt)} className={chipClass(light === opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 통풍 */}
                  <div className="bg-card rounded-[16px] p-5">
                    <h3 className="text-[18px] font-bold text-foreground mb-3">통풍 (바람)</h3>
                    <div className="flex gap-2 flex-wrap">
                      {(["잘 통해요", "보통", "안 통해요"] as AirOption[]).map((opt) => (
                        <button key={opt} onClick={() => setAir(opt)} className={chipClass(air === opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 반려동물 */}
                  <div className="bg-card rounded-[16px] p-5">
                    <h3 className="text-[18px] font-bold text-foreground mb-3">반려동물</h3>
                    <div className="flex gap-2">
                      {(["있어요", "없어요"] as PetOption[]).map((opt) => (
                        <button key={opt} onClick={() => setPet(opt)} className={chipClass(pet === opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="mt-4 w-full h-[52px] bg-primary text-primary-foreground rounded-full text-[16px] font-semibold"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}

            {/* Slide 3: 어떻게 시작할까요? */}
            {current === 3 && (
              <div className="flex-1 flex flex-col">
                <div className="px-6 pt-24 pb-6">
                  <h1 className="text-[28px] font-bold text-foreground leading-[1.4]">어떻게 시작할까요?</h1>
                </div>
                <div className="px-6 flex-1 flex flex-col gap-4">
                  <button
                    onClick={() => {
                      localStorage.setItem(`hasSeenOnboarding_${JSON.parse(localStorage.getItem("sb-felmqzrkkqyimknnefdq-auth-token") || "{}").user?.id || "unknown"}`, "true");
                      navigate("/plant-recommendation");
                    }}
                    className="bg-card rounded-[20px] shadow-card py-12 flex flex-col items-center gap-3"
                  >
                    <span className="text-[48px]">🔍</span>
                    <span className="text-[16px] font-bold text-foreground text-center">나에게 맞는 식물{"\n"}추천받기</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem(`hasSeenOnboarding_${JSON.parse(localStorage.getItem("sb-felmqzrkkqyimknnefdq-auth-token") || "{}").user?.id || "unknown"}`, "true");
                      navigate("/plant-register");
                    }}
                    className="bg-card rounded-[20px] shadow-card py-12 flex flex-col items-center gap-3"
                  >
                    <span className="text-[48px]">📷</span>
                    <span className="text-[16px] font-bold text-foreground text-center">이미 키우는 식물{"\n"}등록하기</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page indicators */}
      <div className="pb-12 flex justify-center">
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-[8px] h-[8px] bg-foreground" : "w-[8px] h-[8px] bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
