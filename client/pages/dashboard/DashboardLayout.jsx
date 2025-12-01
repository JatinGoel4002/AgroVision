import DashboardNav from "@/components/DashboardNav";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div>
      <DashboardNav />
      <div style={{ marginTop: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
