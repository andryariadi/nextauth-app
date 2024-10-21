import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import { signIn } from "next-auth/react"; //Can used in Server side and Client side
import { DEFAULT_LOGIN_REDIRECT } from "@/routes/routes";
// import { handleGoogleLogin } from "@/lib/action";

const Oatuh = () => {
  const handleOauth = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center justify-center gap-10">
      <button onClick={() => handleOauth("google")}>
        <FcGoogle size={24} className="hover:scale-110 transition-all duration-300 cursor-pointer" />
      </button>

      <button onClick={() => handleOauth("github")}>
        <ImGithub size={24} className="hover:scale-110 transition-all duration-300 cursor-pointer" />
      </button>

      {/* <form action={handleGoogleLogin}>
        <button>
          <FcGoogle size={24} className="hover:scale-110 transition-all duration-300 cursor-pointer" />
        </button>
      </form> */}
    </div>
  );
};

export default Oatuh;
