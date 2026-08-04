import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageSkeleton } from "@/shared/components/PageSkeleton";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";

export function AppLayout() {
  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />

        <div style={{ flex: 1, overflowY: "auto", padding: "28px" }} className="rn-scrollbar">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
