import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home" },
  { to: "/dashboard/crop-recommendation", label: "Crop Recommendation" },
  { to: "/dashboard/disease-detection", label: "Disease Detection" },
  { to: "/dashboard/chat", label: "Chat Bot" },
  { to: "/dashboard/about", label: "About Us" },
];

export default function DashboardNav() {
  const { pathname } = useLocation();
  return (
    <div className="dashboard-nav-bar">
      <div className="dashboard-nav-tabs">
        {items.map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn("dashboard-nav-tab", active && "active")}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
