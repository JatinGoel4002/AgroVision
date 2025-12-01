import DashboardNav from "@/components/DashboardNav";

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-secondary/30">
      <DashboardNav />
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
        <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
          <p>
            This page is ready to be filled with your AI logic. Tell me to wire it up to Supabase, Neon, or an AI API when you’re ready.
          </p>
        </div>
      </div>
    </div>
  );
}
