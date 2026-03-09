import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useUser();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !email.trim() || !password.trim()) {
      toast({ title: "모든 항목을 입력해주세요", variant: "destructive" });
      return;
    }
    if (password !== passwordConfirm) {
      toast({ title: "비밀번호가 일치하지 않습니다", variant: "destructive" });
      return;
    }
    setUserInfo({ nickname, email });
    toast({ title: "회원가입이 완료되었습니다" });
    navigate("/home");
  };

  const handleSocialSignup = () => {
    toast({ title: "소셜 회원가입은 준비 중입니다" });
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-beige-gradient">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4 pt-2">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-4">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight text-primary">
            MyLittleGarden
          </h1>
        </div>

        {/* Form */}
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
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[12px] text-[16px] font-semibold mt-2"
          >
            가입하기
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-foreground/20" />
          <span className="text-[13px] text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-foreground/20" />
        </div>

        {/* Social */}
        <div className="flex justify-center gap-5">
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full bg-[hsl(50,100%,55%)] flex items-center justify-center shadow-sm">
            <span className="text-[16px] font-bold text-[hsl(25,30%,20%)]">TALK</span>
          </button>
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full bg-[hsl(145,63%,42%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] font-bold text-primary-foreground">N</span>
          </button>
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full bg-[hsl(220,10%,20%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] text-primary-foreground">🍎</span>
          </button>
          <button onClick={handleSocialSignup} className="w-[56px] h-[56px] rounded-full bg-card flex items-center justify-center border border-border shadow-sm">
            <span className="text-[22px] font-bold">G</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
