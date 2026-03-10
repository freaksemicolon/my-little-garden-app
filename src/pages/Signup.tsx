import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import logoMyLittleGarden from "@/assets/logo-mylittlegarden.png";
import iconGoogle from "@/assets/icon-google.png";
import iconApple from "@/assets/icon-apple.png";
import iconKakao from "@/assets/icon-kakao.png";
import iconNaver from "@/assets/icon-naver.png";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      toast({ title: "모든 항목을 입력해주세요", variant: "destructive" });
      return;
    }
    if (password !== passwordConfirm) {
      toast({ title: "비밀번호가 일치하지 않습니다", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, nickname);
    setLoading(false);
    if (error) {
      toast({ title: "회원가입 실패", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "회원가입이 완료되었습니다! 이메일을 확인해주세요." });
    navigate("/home");
  };

  const handleSocialSignup = () => {
    toast({ title: "소셜 회원가입은 준비 중입니다" });
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-beige-gradient">
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="mb-10">
          <img src={logoMyLittleGarden} alt="MyLittleGarden" className="h-[36px] object-contain" />
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="w-full h-[50px] px-4 rounded-[12px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
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
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 재확인"
            className="w-full h-[50px] px-4 rounded-[12px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[12px] text-[16px] font-semibold mt-2 disabled:opacity-50"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-foreground/20" />
          <span className="text-[13px] text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-foreground/20" />
        </div>

        <div className="flex justify-center gap-5">
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full overflow-hidden shadow-sm">
            <img src={iconKakao} alt="카카오" className="w-full h-full object-cover" />
          </button>
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full overflow-hidden shadow-sm">
            <img src={iconNaver} alt="네이버" className="w-full h-full object-cover" />
          </button>
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full overflow-hidden shadow-sm">
            <img src={iconApple} alt="Apple" className="w-full h-full object-cover" />
          </button>
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full overflow-hidden shadow-sm">
            <img src={iconGoogle} alt="Google" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <div className="flex justify-center pb-12 gap-2">
        <span className="text-[14px] text-foreground">이미 회원이신가요?</span>
        <button onClick={() => navigate("/login")} className="text-[14px] font-semibold text-foreground underline">
          로그인 하기
        </button>
      </div>
    </div>
  );
};

export default Signup;
