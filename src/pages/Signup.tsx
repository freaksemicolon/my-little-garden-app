import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center h-[56px] px-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-[17px] font-semibold text-foreground ml-2">회원가입</h1>
      </div>

      <div className="flex-1 px-6 pt-4">
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
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
          <div>
            <label className="text-[13px] font-medium text-foreground mb-1.5 block">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              className="w-full h-[48px] px-4 rounded-[12px] bg-muted text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold mt-4"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
