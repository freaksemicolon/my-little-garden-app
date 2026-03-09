import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserPlant {
  id: string;
  user_id: string;
  nickname: string;
  species: string;
  plant_type: string;
  image_url: string | null;
  adoption_date: string | null;
  watering_cycle: number;
  watering_unit: string;
  memo: string;
  last_watered: string | null;
  health_status: string;
  persona: string;
  speech_style: string;
  bond_level: number;
  created_at: string;
  updated_at: string;
}

export function usePlants() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["plants", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_plants")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as UserPlant[];
    },
    enabled: !!user,
  });
}

export function usePlant(plantId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["plant", plantId],
    queryFn: async () => {
      if (!user || !plantId) return null;
      const { data, error } = await supabase
        .from("user_plants")
        .select("*")
        .eq("id", plantId)
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data as UserPlant;
    },
    enabled: !!user && !!plantId,
  });
}

export function useCreatePlant() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (plant: {
      nickname: string;
      species: string;
      adoption_date?: string;
      watering_cycle: number;
      watering_unit: string;
      memo?: string;
      image_url?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("user_plants")
        .insert({
          user_id: user.id,
          ...plant,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    },
  });
}

export function useUpdatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<UserPlant> & { id: string }) => {
      const { data, error } = await supabase
        .from("user_plants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    },
  });
}

export function useWaterPlant() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (plantId: string) => {
      if (!user) throw new Error("Not authenticated");
      const now = new Date().toISOString();
      
      await supabase
        .from("user_plants")
        .update({ last_watered: now })
        .eq("id", plantId);

      await supabase.from("activity_logs").insert({
        plant_id: plantId,
        user_id: user.id,
        action: "물을 주었어요",
        emoji: "💧",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    },
  });
}

export function getWateringStatusFromPlant(plant: UserPlant): { status: string; badge: string } {
  if (!plant.last_watered) return { status: "물 필요", badge: "destructive" };
  const last = new Date(plant.last_watered);
  const next = new Date(last);
  next.setDate(next.getDate() + plant.watering_cycle);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  next.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return { status: "물 필요", badge: "destructive" };
  if (diffDays === 0) return { status: "오늘 물주기", badge: "warning" };
  if (diffDays >= -2) return { status: `${Math.abs(diffDays)}일 후`, badge: "default" };
  return { status: "완료", badge: "success" };
}
