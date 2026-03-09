import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-beige-gradient">
      {/* Header - back arrow */}
      <div className="flex items-center h-[56px] px-4 pt-2">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-6 pt-4">
        {/* MyLittleGarden text logo */}
        <div className="mb-8">
          <h1 className="text-[30px] font-bold tracking-tight">
            <span className="text-primary">My</span>
            <span className="text-primary">Little</span>
            <span className="text-primary">Ga</span>
            <span className="text-primary">r</span>
            <span className="text-primary">den</span>
          </h1>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            className="w-full h-[50px] px-4 rounded-[12px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디 (이메일)"
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 재확인"
            className="w-full h-[50px] px-4 rounded-[12px] border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            type="submit"
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[12px] text-[16px] font-semibold mt-3"
          >
            가입하기
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-foreground/20" />
          <span className="text-[13px] text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-foreground/20" />
        </div>

        {/* Social Login Icons */}
        <div className="flex justify-center gap-5">
          <button className="w-[56px] h-[56px] rounded-full bg-[hsl(50,100%,55%)] flex items-center justify-center shadow-sm">
            <span className="text-[16px] font-bold text-[hsl(25,30%,20%)]">TALK</span>
          </button>
          <button className="w-[56px] h-[56px] rounded-full bg-[hsl(145,63%,42%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] font-bold text-primary-foreground">N</span>
          </button>
          <button className="w-[56px] h-[56px] rounded-full bg-[hsl(220,10%,20%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] text-primary-foreground">🍎</span>
          </button>
          <button className="w-[56px] h-[56px] rounded-full bg-card flex items-center justify-center border border-border shadow-sm">
            <span className="text-[22px] font-bold">G</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
