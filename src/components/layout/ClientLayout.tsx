"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { VoiceAssistantProvider } from "@/context/VoiceAssistantContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VoiceTranscriptOverlay } from "@/components/voice/VoiceTranscriptOverlay";
import { Toaster } from "@/components/ui/toaster";

const authPages = ['/login', '/register'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);

  // Auth pages (login/register) render without sidebar/topbar
  if (isAuthPage) {
    return (
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <VoiceAssistantProvider>
          <div className="flex h-screen overflow-hidden bg-[var(--background-solid)]">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
            >
              Skip to content
            </a>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
              <main id="main-content" className="flex-1 overflow-auto p-3 sm:p-6">
                <ErrorBoundary>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pathname}
                      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        filter: 'blur(2px)',
                        transition: { duration: 0.2 }
                      }}
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </ErrorBoundary>
              </main>
            </div>
          </div>
          <VoiceTranscriptOverlay />
          <Toaster />
        </VoiceAssistantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
