"use client";

import useCurrentRole from "@/hooks/useCurrentRole";
import { UserRole } from "@prisma/client";
import { CiWarning } from "react-icons/ci";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <div className="flex items-center justify-center gap-5 bg-rose-500 bg-opacity-20 rounded-lg p-2 text-rose-600">
        <CiWarning size={20} />
        <p>Only admin to have permission to see this content!</p>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default RoleGate;
