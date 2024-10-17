import { IoIdCardOutline } from "react-icons/io5";
import { BsPersonVcard } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { AiOutlineSecurityScan } from "react-icons/ai";
import { GrUserAdmin } from "react-icons/gr";
import { ExtendedUser } from "../../../../next-auth";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <div className="bg-gray-700 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400 w-full max-w-2xl p-5 flex flex-col items-center gap-7">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">{label}</h2>

      <div className="b-violet-500 flex flex-col gap-3 w-full">
        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoIdCardOutline size={25} />
            <span>ID</span>
          </div>
          <span>{user?.id}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BsPersonVcard size={25} />
            <span>Username</span>
          </div>
          <span>{user?.name}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoMailOutline size={25} />
            <span>Email</span>
          </div>
          <span>{user?.email}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AiOutlineSecurityScan size={25} />
            <span>Role</span>
          </div>
          <span>{user?.role}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GrUserAdmin size={25} />
            <span>2FA</span>
          </div>
          <span className={`${user?.isTwoFactorEnabled ? "bg-emerald-500" : "bg-rose-500"} text-white py-1 px-4 rounded-lg`}>{user?.isTwoFactorEnabled ? "On" : "Off"}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
