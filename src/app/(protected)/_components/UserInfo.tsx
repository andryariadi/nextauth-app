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
          <IoIdCardOutline size={25} />
          <span>{user?.id}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <BsPersonVcard size={25} />
          <span>{user?.name}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <IoMailOutline size={25} />
          <span>{user?.email}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <AiOutlineSecurityScan size={25} />
          <span>{user?.role}</span>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <GrUserAdmin size={25} />
          <div className="flex items-center gap-2">
            <span>2FA</span>
            <span className="bg-emerald-500 text-white py-1 px-4 rounded-lg">On</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
