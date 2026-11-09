import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnimatedBackground } from "./AnimatedBackground";

export function Layout() {
  const location = useLocation();

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#F8F9FF] text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative flex-1">
        {/* Decorative Background */}
        <AnimatedBackground />

        {/* Page Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-14">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
