export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-[1280px] m-auto min-h-screen flex items-center">
        {children}
      </body>
    </html>
  );
}
