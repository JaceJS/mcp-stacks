import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <div className="grain-overlay" />
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
