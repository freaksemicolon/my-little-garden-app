import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";

const Login = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      if (hasSeenOnboarding === "true") {
        navigate("/home");
      } else {
        navigate("/onboarding");
      }
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "이메일과 비밀번호를 입력해주세요", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "로그인 실패", description: error.message, variant: "destructive" });
      return;
    }
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/home");
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google 로그인 실패", description: String(error), variant: "destructive" });
    }
  };

  const handleAppleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Apple 로그인 실패", description: String(error), variant: "destructive" });
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({ title: `${provider} 로그인은 준비 중입니다` });
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-beige-gradient">
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold tracking-tight text-primary">MyLittleGarden</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@domain.com"
            className="w-full h-[50px] px-4 rounded-[12px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full h-[50px] px-4 rounded-[12px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[12px] text-[16px] font-semibold mt-2 disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-foreground/20" />
          <span className="text-[13px] text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-foreground/20" />
        </div>

        <div className="flex justify-center gap-5">
          <button onClick={() => handleSocialLogin("카카오")} className="w-[56px] h-[56px] rounded-full bg-[hsl(50,100%,55%)] flex items-center justify-center shadow-sm">
            <span className="text-[16px] font-bold text-[hsl(25,30%,20%)]">TALK</span>
          </button>
          <button onClick={() => handleSocialLogin("네이버")} className="w-[56px] h-[56px] rounded-full bg-[hsl(145,63%,42%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] font-bold text-primary-foreground">N</span>
          </button>
          <button onClick={handleAppleLogin} className="w-[56px] h-[56px] rounded-full bg-[hsl(220,10%,20%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] text-primary-foreground">🍎</span>
          </button>
          <button onClick={handleGoogleLogin} className="w-[56px] h-[56px] rounded-full bg-card flex items-center justify-center border border-border shadow-sm">
            <span className="text-[22px] font-bold">G</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center pb-12 gap-2">
        <span className="text-[14px] text-foreground">아직 회원이 아니신가요?</span>
        <button onClick={() => navigate("/signup")} className="text-[14px] font-semibold text-foreground underline">
          회원가입 하기
        </button>
      </div>
    </div>
  );
};

export default Login;
