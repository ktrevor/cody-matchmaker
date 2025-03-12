import { Collapse, Card, Typography } from "antd";
import { Member } from "../../members/Member";
import styles from "./UngroupedMembers.module.css";
import { MemberDisplay } from "./MemberDisplay";
import { SwapOutlined } from "@ant-design/icons";

interface UngroupedMembersProps {
  ungroupedMembers: Member[];
  onSelectMember: (member: Member) => void;
  selectedMembers: string[];
}

export const UngroupedMembers = ({
  ungroupedMembers,
  onSelectMember,
  selectedMembers,
}: UngroupedMembersProps) => {
  const groupHasSelectedMember = ungroupedMembers.find((member) =>
    selectedMembers.includes(member.id)
  );
  return (
    <Collapse style={{ backgroundColor: "#ffffff" }}>
      <Collapse.Panel
        header={`Ungrouped members (${ungroupedMembers.length})`}
        key="1"
      >
        <div
          style={{
            backgroundColor: "#f5f5f5",
            overflowY: "auto",
            borderBottomLeftRadius: 7,
            borderBottomRightRadius: 7,
            maxHeight: "250px",
          }}
        >
          {ungroupedMembers.length > 0 ? (
            <div
              style={{
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "12px",
                padding: "12px",
              }}
            >
              {ungroupedMembers.map((member) => (
                <Card
                  key={member.id}
                  size="small"
                  className={`${styles.listItem} ${
                    selectedMembers.includes(member.id) ? styles.selected : ""
                  } ${!groupHasSelectedMember ? styles.hoverable : ""}`}
                  onClick={() => onSelectMember(member)}
                  style={{
                    padding: 0,
                  }}
                  bordered={false}
                >
                  <SwapOutlined className={styles.swapIcon} />
                  <MemberDisplay member={member} />
                </Card>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                height: "100%",
                padding: 16,
              }}
            >
              <Typography.Text style={{ fontWeight: 600 }}>
                No ungrouped members
              </Typography.Text>
            </div>
          )}
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};
