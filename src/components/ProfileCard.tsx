import { ChevronRight } from "lucide-react";

interface ProfileCardProps {
  avatar: string;
  name: string;
  plantCount: number;
  level: string;
}

const ProfileCard = ({ avatar, name, plantCount, level }: ProfileCardProps) => {
  return (
    <div className="bg-card rounded-[16px] shadow-card p-5 flex items-center gap-4">
      <div className="w-[64px] h-[64px] rounded-full bg-secondary overflow-hidden flex-shrink-0">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h2 className="text-[17px] font-bold text-foreground">{name}</h2>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          관리 식물 {plantCount}개 · {level}
        </p>
      </div>
      <ChevronRight size={20} className="text-muted-foreground" />
    </div>
  );
};

export default ProfileCard;
