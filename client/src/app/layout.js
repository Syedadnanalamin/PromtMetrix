import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getServerSession } from "@/lib/authentication/server.session";

export const metadata = {
  title: "PromptMatrix | AI Prompt Marketplace & Community",
  description: "Discover, share, and monetize high-quality AI prompts for ChatGPT, Midjourney, Claude, and Gemini.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased">
        <Navbar session={session} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
