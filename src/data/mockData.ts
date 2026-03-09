import plantMonstera from "@/assets/plant-monstera.png";
import plantSucculent from "@/assets/plant-succulent.png";
import plantCactus from "@/assets/plant-cactus.png";

// ============ User ============
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  levelTitle: string;
  exp: number;
  maxExp: number;
  plantCount: number;
  friendCount: number;
}

export const currentUser: User = {
  id: "u1",
  name: "나연",
  email: "nayeon@example.com",
  avatar: "🌱",
  level: 3,
  levelTitle: "새싹 가드너",
  exp: 450,
  maxExp: 800,
  plantCount: 3,
  friendCount: 2,
};

// ============ Family ============
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  color: string;
}

export const familyMembers: FamilyMember[] = [
  { id: "f1", name: "엄마", relation: "엄마", avatar: "👵", color: "hsl(30,70%,70%)" },
  { id: "f2", name: "아빠", relation: "아빠", avatar: "👨", color: "hsl(260,40%,75%)" },
  { id: "f3", name: "동생", relation: "동생", avatar: "👩", color: "hsl(340,50%,75%)" },
];

// ============ Plants ============
export interface PlantData {
  id: string;
  nickname: string;
  species: string;
  image: string;
  adoptionDate: string;
  wateringCycle: number;
  wateringUnit: string;
  memo: string;
  lastWatered: string;
  healthStatus: "좋음" | "보통" | "주의";
  activityLogs: ActivityLog[];
}

export interface ActivityLog {
  date: string;
  entries: ActivityEntry[];
}

export interface ActivityEntry {
  person: string;
  action: string;
  emoji: string;
  time: string;
}

export const plantsData: PlantData[] = [
  {
    id: "1",
    nickname: "몬몬이",
    species: "몬스테라",
    image: plantSucculent,
    adoptionDate: "2026-01-03",
    wateringCycle: 9,
    wateringUnit: "일",
    memo: "7일~ 10일 주기로 물을 줘야해요",
    lastWatered: "2026-03-07",
    healthStatus: "좋음",
    activityLogs: [
      {
        date: "2026. 02. 21 (Sat)",
        entries: [
          { person: "아빠", action: "물💧을 주셨어요", emoji: "💧", time: "05:58 PM" },
          { person: "엄마", action: "영양제💊를 주셨어요", emoji: "💊", time: "03:20 PM" },
          { person: "엄마", action: "몬몬이를 진단🔍하셨어요", emoji: "🔍", time: "03:14 PM" },
        ],
      },
      {
        date: "2026. 01. 18 (Sat)",
        entries: [
          { person: "엄마", action: "영양제💊를 주셨어요", emoji: "💊", time: "03:20 PM" },
          { person: "엄마", action: "몬몬이를 진단🔍하셨어요", emoji: "🔍", time: "03:14 PM" },
          { person: "아빠", action: "물💧을 주셨어요", emoji: "💧", time: "02:40 PM" },
        ],
      },
    ],
  },
  {
    id: "2",
    nickname: "다육이",
    species: "다육식물",
    image: plantSucculent,
    adoptionDate: "2026-02-01",
    wateringCycle: 5,
    wateringUnit: "일",
    memo: "직사광선은 피해줘",
    lastWatered: "2026-03-05",
    healthStatus: "보통",
    activityLogs: [
      {
        date: "2026. 03. 05 (Wed)",
        entries: [
          { person: "나연", action: "물💧을 주셨어요", emoji: "💧", time: "10:30 AM" },
        ],
      },
    ],
  },
  {
    id: "3",
    nickname: "선인장",
    species: "선인장",
    image: plantCactus,
    adoptionDate: "2025-12-25",
    wateringCycle: 14,
    wateringUnit: "일",
    memo: "건조한 환경을 좋아해요",
    lastWatered: "2026-03-01",
    healthStatus: "좋음",
    activityLogs: [
      {
        date: "2026. 03. 01 (Sat)",
        entries: [
          { person: "동생", action: "물💧을 주셨어요", emoji: "💧", time: "02:00 PM" },
        ],
      },
    ],
  },
];

// ============ Diagnosis ============
export interface DiagnosisRecord {
  id: string;
  plantId: string;
  plantName: string;
  date: string;
  problem: string;
  cause: string;
  severity: number;
  solution: string;
  detail: string;
}

export const diagnosisHistory: DiagnosisRecord[] = [
  {
    id: "d1",
    plantId: "1",
    plantName: "몬몬이",
    date: "2026-03-07",
    problem: "잎이 시들어 처짐",
    cause: "뿌리까지 물이 닿지 못한 상태",
    severity: 65,
    solution: "저면관수 후 흙이 다시 말라서 그런 것 같음. 2시간 정도 물에 담궈두면 회복 가능",
    detail: "흙 표면은 촉촉하지만 뿌리 쪽은 건조한 상태입니다. 저면관수를 권장합니다.",
  },
  {
    id: "d2",
    plantId: "1",
    plantName: "몬몬이",
    date: "2026-02-21",
    problem: "잎 끝이 갈색으로 변함",
    cause: "과습 또는 낮은 습도",
    severity: 40,
    solution: "환기를 자주 시켜주고, 분무기로 잎에 수분을 보충해주세요",
    detail: "실내 습도가 30% 이하일 때 자주 발생합니다.",
  },
  {
    id: "d3",
    plantId: "2",
    plantName: "다육이",
    date: "2026-02-15",
    problem: "줄기가 늘어남",
    cause: "일조량 부족 (웃자람)",
    severity: 30,
    solution: "햇빛이 잘 드는 곳으로 이동시켜 주세요",
    detail: "다육식물은 하루 최소 4시간 이상의 직사광선이 필요합니다.",
  },
];

// ============ Chat Messages ============
export interface ChatMessage {
  role: "plant" | "user" | "system";
  content: string;
  timestamp: string;
  type?: "text" | "image" | "diagnosis-loading" | "diagnosis-result";
  diagnosisResult?: {
    cause: string;
    solution: string;
  };
}

export const initialChatMessages: ChatMessage[] = [
  {
    role: "plant",
    content: "나연 님 저 너무 시들시들해진 것 같아요...ㅠㅠ",
    timestamp: "03:53 PM",
    type: "text",
  },
];

// ============ Quests ============
export interface Quest {
  id: string;
  title: string;
  exp: number;
  completed: boolean;
}

export const dailyQuests: Quest[] = [
  { id: "q1", title: "몬몬이 물주기", exp: 100, completed: false },
  { id: "q2", title: "사니 물주기", exp: 100, completed: false },
];

// ============ Recommended Plants ============
export interface RecommendedPlant {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  tags: string[];
}

export const recommendedPlants: RecommendedPlant[] = [
  { id: "r1", name: "스킨답서스", nameEn: "Pothos", image: plantMonstera, tags: ["#초보식집사_추천", "#물주기_깜빡해도_거뜬"] },
  { id: "r2", name: "산세베리아", nameEn: "Snake Plant", image: plantCactus, tags: ["#초보식집사_추천", "#햇빛이_부족한_방", "#반려동물_안전"] },
  { id: "r3", name: "테이블 야자", nameEn: "Parlor Palm", image: plantSucculent, tags: ["#햇빛이_부족한_방", "#반려동물_안전"] },
  { id: "r4", name: "몬스테라", nameEn: "Monstera", image: plantMonstera, tags: ["#초보식집사_추천", "#프로 식물킬러_졸업"] },
];

export const recommendTags = [
  "#초보식집사_추천",
  "#햇빛이_부족한_방",
  "#반려동물_안전",
  "#물주기_깜빡해도_거뜬",
  "#프로 식물킬러_졸업",
  "#알레르기",
];

// ============ Notification Settings ============
export interface NotificationSetting {
  key: string;
  label: string;
  enabled: boolean;
}

export const defaultNotificationSettings: NotificationSetting[] = [
  { key: "push", label: "푸시 알림", enabled: true },
  { key: "sound", label: "소리", enabled: true },
  { key: "vibrate", label: "진동", enabled: false },
  { key: "dnd", label: "방해 금지 (22:00 ~ 8:00)", enabled: false },
  { key: "marketing", label: "마케팅 정보 수신 동의", enabled: false },
];

// ============ Zero Waste ============
export interface WasteGuideItem {
  icon: string;
  title: string;
  description: string;
}

export const wasteDisposalItems: WasteGuideItem[] = [
  { icon: "🪴", title: "죽은 식물", description: "음식물 쓰레기로 분류하여 배출해주세요. 뿌리와 줄기 모두 가능합니다." },
  { icon: "🪨", title: "키우던 흙", description: "일반 쓰레기 종량제 봉투에 담아 배출합니다. 소량이면 화단에 뿌려도 좋아요." },
  { icon: "🏺", title: "토분/도자기", description: "불연성 쓰레기로 분류합니다. 깨진 경우 신문지로 감싸주세요." },
  { icon: "🥤", title: "플라스틱 컵", description: "흙을 깨끗이 씻은 후 플라스틱 재활용으로 분류해주세요." },
];

export const reuseSteps = [
  { step: 1, title: "흙 소독하기", description: "전자레인지에 2~3분 돌리거나, 끓는 물을 부어 해충과 병균을 제거합니다." },
  { step: 2, title: "영양분 보충", description: "펄라이트, 질석 등을 섞어 흙의 통기성과 보수력을 높여줍니다." },
  { step: 3, title: "화분 재사용", description: "깨끗이 씻어 말린 후 새 식물을 심어보세요. 토분은 반복 사용이 가능해요." },
];

// ============ Helpers ============
export function getWateringStatus(plant: PlantData): { status: string; badge: string } {
  const last = new Date(plant.lastWatered);
  const next = new Date(last);
  next.setDate(next.getDate() + plant.wateringCycle);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  next.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return { status: "물 필요", badge: "destructive" };
  if (diffDays === 0) return { status: "오늘 물주기", badge: "warning" };
  if (diffDays >= -2) return { status: `${Math.abs(diffDays)}일 후`, badge: "default" };
  return { status: "완료", badge: "success" };
}
