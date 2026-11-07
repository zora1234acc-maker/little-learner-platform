import { Outlet, useLocation } from "react-router-dom";
import { Breadcrumb } from "./Breadcrumb";

export function SimpleLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-blur]:bg-background/80 px-4 py-3">
        <Breadcrumb />
      </div>
      <main className="container mx-auto px-4 py-6 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
