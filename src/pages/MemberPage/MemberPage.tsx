import { Spin, Typography } from "antd";
import { AddMember } from "./AddMember";
import { MemberTable } from "./MembersTable";
import { useMembersContext } from "../../components/MembersProvider";
import styles from "./MembersPage.module.css";

const { Title } = Typography;

export const MemberPage = () => {
  const { members, loading } = useMembersContext();

  if (loading) {
    return <Spin className={styles.loading} size="large" />;
  }

  return (
    <>
      <Title>{`Members (${members.length})`}</Title>
      <AddMember />
      <MemberTable />
    </>
  );
};
