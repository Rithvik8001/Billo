import Nav from "@/components/landing/nav";
import Header from "@/components/landing/header";

export const dynamic = 'force-dynamic';

export default function Landing() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#F4EDEB]">
        <Nav />
        <Header />
      </div>
    </>
  );
}
