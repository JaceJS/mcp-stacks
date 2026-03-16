/**
 * Layout for public / marketing pages.
 * No auth check — accessible to everyone.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* TODO: Add public navbar here */}
      <main>{children}</main>
    </div>
  );
}
