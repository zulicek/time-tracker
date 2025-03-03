import { FieldTimeOutlined } from "@ant-design/icons";
import UserDropdown from "./UserDropdown";
import type { Person } from "../types";

const Header = ({ person }: { person?: Person | null }) => {
  return (
    <div className="flex justify-between items-center gap-4 px-6 py-4 bg-gray-100 shadow-md border-b border-gray-300">
      <h1 className="text-2xl font-semibold">
        <FieldTimeOutlined className="mr-2" style={{ color: "#5d0ec0" }} /> Time Tracker
      </h1>
      {person && <UserDropdown person={person} />}
    </div>
  );
};

export default Header;
