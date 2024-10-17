import { currentUser } from "@/lib/currentUser";
import UserInfo from "../_components/UserInfo";

const ServerPage = async () => {
  const user = await currentUser();

  console.log(user, "<---diserverpage");

  return <UserInfo user={user} label="Server Component" />;
};

export default ServerPage;
