import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/public/Home";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import "@/index.css";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <LanguageSwitcher />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
