import { useDirtyContext } from "../components/DirtyContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { CoffeeOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const pages = [
  {
    label: "Donuts",
    key: "/donuts",
    icon: <CoffeeOutlined />,
  },
  {
    label: "Members",
    key: "/members",
    icon: <UserOutlined />,
  },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDirty, confirmLeave } = useDirtyContext();

  const onClick: MenuProps["onClick"] = (e) => {
    if (!isDirty || confirmLeave()) {
      navigate(e.key);
    }
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[location.pathname]}
      items={pages}
      mode="horizontal"
    />
  );
};
