import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const pages: MenuItem[] = [
  {
    label: "Donuts",
    key: "/donuts",
    icon: <TeamOutlined />,
  },
  {
    label: "Members",
    key: "/members",
    icon: <UserOutlined />,
  },
];

export const Navbar = () => {
  const [current, setCurrent] = useState("/members");
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={pages}
    />
  );
};
