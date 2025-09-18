import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts/theme-context";
import { FilterProvider } from "@/contexts/filter-context";
import { TimeTrackingProvider } from "@/contexts/time-tracking-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanban Board - Learning Tracker",
  description: "A simple kanban board for tracking learning progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <FilterProvider>
            <TimeTrackingProvider>
              {children}
            </TimeTrackingProvider>
          </FilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
