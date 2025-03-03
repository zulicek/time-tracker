import { Avatar, Dropdown, theme } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Person } from "../types";
import { logout } from "../store/authSlice";
import { useAppDispatch } from "../store/store";

const { useToken } = theme;

const UserDropdown = ({ person }: { person: Person | null }) => {
  const { token } = useToken();
  const dispatch = useAppDispatch();

  const personMenuItems: MenuProps["items"] = person
    ? [
        {
          key: "1",
          label: <strong>{person.attributes.first_name} {person.attributes.last_name}</strong>,
        },
        {
          key: "2",
          label: person.attributes.email,
        },
        {
            key: "3",
            label: "Logout",
            onClick: () => dispatch(logout())
        }
      ]
    : [
        {
          key: "loading",
          label: "Loading...",
        },
      ];

  return (
    <Dropdown menu={{ items: personMenuItems }} placement="bottomRight">
      <Avatar
        size="large"
        icon={<UserOutlined />}
        className="cursor-pointer"
        style={{ backgroundColor: token.colorPrimary, fontSize: "1rem" }}
      />
    </Dropdown>
  );
};

export default UserDropdown;