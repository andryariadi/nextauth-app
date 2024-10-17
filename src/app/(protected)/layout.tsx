import Navbar from "./_components/Navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] min-h-screen w-full flex flex-col items-center justify-center gap-16">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
