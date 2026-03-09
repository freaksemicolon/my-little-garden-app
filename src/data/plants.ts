import plantMonstera from "@/assets/plant-monstera.png";
import plantSucculent from "@/assets/plant-succulent.png";
import plantCactus from "@/assets/plant-cactus.png";

export interface Plant {
  id: string;
  name: string;
  type: string;
  image: string;
  location: string;
  lastWatered: string;
  wateringCycle: number;
  registeredDate: string;
  healthStatus: "좋음" | "보통" | "주의";
  wateringHistory: string[];
}

export const samplePlants: Plant[] = [
  {
    id: "1",
    name: "몬스테라",
    type: "관엽식물",
    image: plantMonstera,
    location: "거실",
    lastWatered: "2026-03-07",
    wateringCycle: 7,
    registeredDate: "2026-01-15",
    healthStatus: "좋음",
    wateringHistory: ["2026-03-07", "2026-02-28", "2026-02-21"],
  },
  {
    id: "2",
    name: "다육이",
    type: "다육식물",
    image: plantSucculent,
    location: "창가",
    lastWatered: "2026-03-05",
    wateringCycle: 5,
    registeredDate: "2026-02-01",
    healthStatus: "보통",
    wateringHistory: ["2026-03-05", "2026-02-28"],
  },
  {
    id: "3",
    name: "선인장",
    type: "선인장",
    image: plantCactus,
    location: "책상",
    lastWatered: "2026-03-01",
    wateringCycle: 14,
    registeredDate: "2025-12-25",
    healthStatus: "좋음",
    wateringHistory: ["2026-03-01", "2026-02-15"],
  },
];

export function getNextWaterDate(lastWatered: string, cycle: number): string {
  const date = new Date(lastWatered);
  date.setDate(date.getDate() + cycle);
  return date.toISOString().split("T")[0];
}

export function getWateringStatus(nextDate: string): "정상" | "오늘 물주기" | "지연" {
  const today = new Date().toISOString().split("T")[0];
  if (nextDate < today) return "지연";
  if (nextDate === today) return "오늘 물주기";
  return "정상";
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
