import { handleLogout } from "@/lib/action";
import { auth } from "@/lib/auth";

const SettingsPage = async () => {
  const session = await auth();

  console.log(session, "<----disettingspage");

  return (
    <div className="bg-rose-600">
      <form action={handleLogout}>
        <button>Logout</button>
      </form>
    </div>
  );
};

export default SettingsPage;
