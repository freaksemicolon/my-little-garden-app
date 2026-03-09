import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-beige-gradient">
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* MyLittleGarden text logo */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold tracking-tight">
            <span className="text-primary">My</span>
            <span className="text-primary">Little</span>
            <span className="text-primary">Ga</span>
            <span className="text-primary">r</span>
            <span className="text-primary">den</span>
          </h1>
        </div>

        {/* Form */}
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
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[12px] text-[16px] font-semibold mt-2"
          >
            로그인
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
          {/* 카카오 */}
          <button className="w-[56px] h-[56px] rounded-full bg-[hsl(50,100%,55%)] flex items-center justify-center shadow-sm">
            <span className="text-[16px] font-bold text-[hsl(25,30%,20%)]">TALK</span>
          </button>
          {/* 네이버 */}
          <button className="w-[56px] h-[56px] rounded-full bg-[hsl(145,63%,42%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] font-bold text-primary-foreground">N</span>
          </button>
          {/* 애플 */}
          <button className="w-[56px] h-[56px] rounded-full bg-[hsl(220,10%,20%)] flex items-center justify-center shadow-sm">
            <span className="text-[22px] text-primary-foreground">🍎</span>
          </button>
          {/* 구글 */}
          <button className="w-[56px] h-[56px] rounded-full bg-card flex items-center justify-center border border-border shadow-sm">
            <span className="text-[22px] font-bold">G</span>
          </button>
        </div>
      </div>

      {/* Signup link at bottom */}
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
