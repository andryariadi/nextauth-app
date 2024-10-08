import { auth } from "@/lib/auth";

const SettingsPage = async () => {
  const session = await auth();

  console.log(session, "<----disettingspage");

  return <div>SettingsPage</div>;
};

export default SettingsPage;
