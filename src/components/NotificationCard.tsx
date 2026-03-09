import { Droplets } from "lucide-react";

interface NotificationCardProps {
  plantName: string;
  message: string;
  image: string;
}

const NotificationCard = ({ plantName, message, image }: NotificationCardProps) => {
  return (
    <div className="bg-garden-beige rounded-[16px] p-4 flex items-center gap-3">
      <div className="w-[48px] h-[48px] rounded-[12px] bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src={image} alt={plantName} className="w-[40px] h-[40px] object-contain" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <Droplets size={14} className="text-garden-blue" />
          <span className="text-[13px] font-semibold text-foreground">{plantName}</span>
        </div>
        <p className="text-[12px] text-muted-foreground mt-0.5">{message}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
