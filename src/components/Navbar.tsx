import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CoffeeOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useDirtyContext } from "../components/DirtyContext";

type MenuItem = Required<MenuProps>["items"][number];

const pages: MenuItem[] = [
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
  const location = useLocation();
  const navigate = useNavigate();
  const { isDirty } = useDirtyContext();

  const [current, setCurrent] = useState(location.pathname);

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);

    if (isDirty) {
      const confirm = window.confirm(
        "You have unsaved changes that will be lost. Are you sure you want to leave this page?"
      );
      if (!confirm) return;
    }

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
