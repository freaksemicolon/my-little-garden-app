import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Share2, Link2, Copy } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { currentUser } from "@/data/mockData";

interface FamilyMember {
  user_id: string;
  role: string;
  nickname: string;
  email: string;
}

interface FamilyGroup {
  id: string;
  name: string;
  invite_code: string;
  owner_id: string;
}

const FamilyLink = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [group, setGroup] = useState<FamilyGroup | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFamilyData = async () => {
    if (!user) {
      setGroup(null);
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Find user's family group
      const { data: memberData, error: memberError } = await supabase
        .from("family_members")
        .select("group_id")
        .eq("user_id", user.id)
        .limit(1);

      if (memberError) throw memberError;

      if (!memberData || memberData.length === 0) {
        setGroup(null);
        setMembers([]);
        return;
      }

      const groupId = memberData[0].group_id;

      // Fetch group info
      const { data: groupData, error: groupError } = await supabase
        .from("family_groups")
        .select("*")
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;
      if (groupData) setGroup(groupData);

      // Fetch members with profiles
      const { data: membersData, error: membersError } = await supabase
        .from("family_members")
        .select("user_id, role")
        .eq("group_id", groupId);

      if (membersError) throw membersError;

      if (membersData) {
        const memberProfiles = await Promise.all(
          membersData.map(async (m) => {
            const { data: p } = await supabase
              .from("profiles")
              .select("nickname, email")
              .eq("user_id", m.user_id)
              .maybeSingle();

            return {
              user_id: m.user_id,
              role: m.role,
              nickname: p?.nickname || "사용자",
              email: p?.email || "",
            };
          })
        );

        setMembers(memberProfiles);
      }
    } catch (error: any) {
      toast({
        title: "가족 정보 불러오기 실패",
        description: error?.message || "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchFamilyData();
  }, [user, authLoading]);

  const createFamily = async () => {
    if (!user) {
      toast({ title: "로그인이 필요합니다", description: "로그인 후 다시 시도해주세요.", variant: "destructive" });
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("family_groups")
      .insert({ owner_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "가족 그룹 생성 실패", description: error.message, variant: "destructive" });
      return;
    }

    // Add self as member (owner)
    const { error: memberInsertError } = await supabase.from("family_members").insert({
      group_id: data.id,
      user_id: user.id,
      role: "owner",
    });

    if (memberInsertError) {
      toast({ title: "가족 멤버 등록 실패", description: memberInsertError.message, variant: "destructive" });
      return;
    }

    toast({ title: "가족 정원이 생성되었습니다! 🌿" });
    fetchFamilyData();
  };

  const joinFamily = async () => {
    if (!user) {
      toast({ title: "로그인이 필요합니다", description: "로그인 후 다시 시도해주세요.", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (!joinCode.trim()) return;

    const { error } = await supabase.rpc("join_family_by_code", { p_invite_code: joinCode.trim() });
    if (error) {
      toast({ title: "참여 실패", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "가족 정원에 참여했습니다! 🎉" });
    setShowJoinModal(false);
    setJoinCode("");
    fetchFamilyData();
  };

  const copyInviteCode = () => {
    if (group) {
      navigator.clipboard.writeText(group.invite_code);
      toast({ title: "초대 코드가 복사되었습니다!" });
    }
  };

  const shareInviteLink = () => {
    if (group && navigator.share) {
      navigator.share({
        title: "MyLittleGarden 가족 초대",
        text: `가족 정원에 참여해주세요! 초대 코드: ${group.invite_code}`,
      });
    } else {
      copyInviteCode();
    }
  };

  if (loading || authLoading) {
    return (
      <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">불러오는 중...</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background pb-[90px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-2">
        <h1 className="text-[20px] font-bold text-primary tracking-tight">MyLittleGarden</h1>
        <button className="p-2">
          <Bell size={22} className="text-foreground" />
        </button>
      </div>

      <div className="flex items-center px-4 h-[48px]">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <h2 className="text-[17px] font-bold text-foreground flex-1 text-center mr-8">가족 연동</h2>
      </div>

      <div className="flex-1 px-5 pt-4 overflow-y-auto">
        {!group ? (
          /* No family group yet */
          <div className="flex flex-col items-center gap-6 pt-10">
            <span className="text-[64px]">👨‍👩‍👧‍👦</span>
            <p className="text-[16px] text-foreground text-center font-medium">
              아직 가족 정원이 없어요!
            </p>
            <p className="text-[14px] text-muted-foreground text-center">
              가족 정원을 만들거나, 초대 코드로 참여해보세요.
            </p>
            <button
              onClick={createFamily}
              className="w-full h-[52px] bg-primary text-primary-foreground rounded-[14px] text-[16px] font-semibold"
            >
              🌿 가족 정원 만들기
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full h-[52px] border border-border bg-card text-foreground rounded-[14px] text-[16px] font-semibold"
            >
              🔗 초대 코드로 참여하기
            </button>
          </div>
        ) : (
          <>
            {/* Invite Code Card */}
            <div className="bg-accent rounded-[16px] p-5 mb-4">
              <p className="text-[14px] text-muted-foreground mb-3">초대 코드</p>
              <div className="flex justify-center mb-4">
                <div className="bg-card rounded-[12px] px-6 py-4">
                  <p className="text-[28px] font-mono font-bold text-foreground tracking-[0.3em]">
                    {group.invite_code.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-6">
                <button onClick={shareInviteLink} className="flex flex-col items-center gap-1">
                  <Share2 size={20} className="text-foreground" />
                  <span className="text-[11px] text-foreground">정원 공유</span>
                </button>
                <button onClick={copyInviteCode} className="flex flex-col items-center gap-1">
                  <Copy size={20} className="text-foreground" />
                  <span className="text-[11px] text-foreground">코드 복사</span>
                </button>
              </div>
            </div>

            {/* Family Members */}
            <h3 className="text-[14px] text-muted-foreground mb-3">
              연동된 가족 ({members.length}/6)
            </h3>
            <div className="flex flex-col gap-2">
              {members.map((m) => (
                <div key={m.user_id} className="bg-card rounded-[14px] shadow-card px-4 py-3 flex items-center gap-3">
                  <div className="w-[40px] h-[40px] rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                    <span className="text-card text-[16px]">{m.nickname[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-semibold text-foreground">{m.nickname}</span>
                      {m.role === "owner" && <span className="text-[14px]">⭐</span>}
                    </div>
                    {m.email && <p className="text-[11px] text-muted-foreground">{m.email}</p>}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {m.user_id === user?.id ? `Lv. ${currentUser.level} 펼쳐지는 떡잎` : "Lv. 1 새싹"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setShowJoinModal(false)} />
          <div className="relative bg-card rounded-[20px] w-[320px] p-6">
            <h3 className="text-[18px] font-bold text-foreground mb-4">초대 코드 입력</h3>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="초대 코드를 입력하세요"
              className="w-full h-[50px] px-4 rounded-[12px] border border-border bg-accent text-[16px] text-foreground text-center font-mono tracking-[0.2em] placeholder:text-muted-foreground outline-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowJoinModal(false)}
                className="flex-1 h-[44px] rounded-[12px] border border-border text-[14px] font-medium text-foreground">
                취소
              </button>
              <button onClick={joinFamily}
                className="flex-1 h-[44px] rounded-[12px] bg-primary text-primary-foreground text-[14px] font-medium">
                참여하기
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default FamilyLink;
