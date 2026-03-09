import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background px-6">
      <div className="flex-1 flex flex-col justify-center">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src={logo} alt="MyLittleGarden" className="w-[120px] h-[120px] object-contain" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold mt-2"
          >
            로그인
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[12px] text-muted-foreground">소셜 로그인</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex justify-center gap-4">
            {/* Kakao */}
            <button className="w-[48px] h-[48px] rounded-full bg-[hsl(50,100%,50%)] flex items-center justify-center">
              <span className="text-[18px] font-bold text-foreground">K</span>
            </button>
            {/* Naver */}
            <button className="w-[48px] h-[48px] rounded-full bg-[hsl(145,63%,42%)] flex items-center justify-center">
              <span className="text-[18px] font-bold text-primary-foreground">N</span>
            </button>
            {/* Google */}
            <button className="w-[48px] h-[48px] rounded-full bg-muted flex items-center justify-center border border-border">
              <span className="text-[18px] font-bold text-foreground">G</span>
            </button>
            {/* Apple */}
            <button className="w-[48px] h-[48px] rounded-full bg-foreground flex items-center justify-center">
              <span className="text-[18px] font-bold text-background">A</span>
            </button>
          </div>
        </div>

        {/* Signup link */}
        <div className="flex justify-center mt-8">
          <button onClick={() => navigate("/signup")} className="text-[13px] text-muted-foreground">
            계정이 없으신가요? <span className="text-primary font-medium">회원가입</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
