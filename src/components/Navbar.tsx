import { useDirtyContext } from "../components/DirtyContext";
import { useNavigate } from "react-router-dom";
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
  const { isDirty, confirmLeave } = useDirtyContext();

  const onClick: MenuProps["onClick"] = (e) => {
    if (!isDirty || confirmLeave()) {
      navigate(e.key);
    }
  };

  return <Menu onClick={onClick} items={pages} mode="horizontal" />;
};
