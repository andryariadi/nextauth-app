"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import UserInfo from "../_components/UserInfo";

const ClientPage = () => {
  const user = useCurrentUser();

  console.log(user, "<---diclientpage");

  return <UserInfo user={user} label="Client Component" />;
};

export default ClientPage;
