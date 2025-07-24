import QueryProvider from "@/components/common/QueryProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SpriteHub - Premium SVG Sprites Library",
  description:
    "Discover, customize, and download thousands of premium SVG sprites. The ultimate resource for designers and developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${sans.className} ${poppins.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <NuqsAdapter>{children}</NuqsAdapter>
          </ThemeProvider>
        </QueryProvider>
        <Toaster/>
      </body>
    </html>
  );
}
