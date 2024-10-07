import LoginButton from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] min-h-screen w-full flex items-center justify-center">
      <div className="bg-gray-800 w-full max-w-md p-5 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-center text-gray-400 flex flex-col gap-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Welcome to NextAuth</h1>
          <p className="text-sm">Next Auth Authentication Service</p>
        </div>
        <LoginButton>
          <Button variant="custom" size="lg" className="w-full">
            Sign In
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}
