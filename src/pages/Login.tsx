import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full h-[52px] rounded-[12px] bg-card border border-border flex items-center justify-center gap-3 shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[15px] font-medium text-foreground">Google로 로그인</span>
          </button>

          <button
            onClick={() => handleSocialLogin("카카오")}
            className="w-full h-[52px] rounded-[12px] bg-[hsl(50,100%,55%)] flex items-center justify-center gap-3 shadow-sm"
          >
            <span className="text-[16px] font-bold text-[hsl(25,30%,20%)]">💬</span>
            <span className="text-[15px] font-medium text-[hsl(25,30%,20%)]">카카오로 로그인</span>
          </button>

          <button
            onClick={() => handleSocialLogin("네이버")}
            className="w-full h-[52px] rounded-[12px] bg-[hsl(145,63%,42%)] flex items-center justify-center gap-3 shadow-sm"
          >
            <span className="text-[22px] font-bold text-primary-foreground">N</span>
            <span className="text-[15px] font-medium text-primary-foreground">네이버로 로그인</span>
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
