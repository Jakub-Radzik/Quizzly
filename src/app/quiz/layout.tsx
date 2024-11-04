export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-layout flex flex-col w-full m-auto h-screen gap-6">
      {children}
    </div>
  );
}
