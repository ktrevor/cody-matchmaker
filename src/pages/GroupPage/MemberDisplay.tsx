import { Tag } from "antd";
import { Member } from "../../members/Member";
import { useMembersContext } from "../../components/MembersProvider";

interface MemberDisplayProps {
  member: Member;
}

export const MemberDisplay = ({ member }: MemberDisplayProps) => {
  const { members } = useMembersContext();
  const getTreeName = (id: string | null): string | undefined => {
    const member = members.find((m) => m.id === id);
    return member ? member.name : undefined;
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: "14px", marginBottom: 4 }}>{member.name}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          gap: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "12px",
          }}
        >
          <Tag style={{ fontSize: "12px" }}>{member.grade}</Tag>
          <Tag style={{ fontSize: "12px" }}>{member.gender}</Tag>
          <Tag style={{ fontSize: "12px" }}>{member.joined}</Tag>
        </div>
        <div
          style={{
            display: "flex",
          }}
        >
          <Tag style={{ fontSize: "12px" }}>{member.forest}</Tag>
          {member.treeId ? (
            <Tag style={{ fontSize: "12px" }}>{getTreeName(member.treeId)}</Tag>
          ) : null}
        </div>
      </div>
    </div>
  );
};
