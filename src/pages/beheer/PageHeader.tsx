import { LayoutDashboard } from "lucide-react";
import { AppPill } from "@/components/ui/app-surface";

interface PageHeaderProps {
  title: string;
  description?: string;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}

const PageHeader = ({
  title,
  description,
  label = "Beheer",
  icon = LayoutDashboard,
  action,
}: PageHeaderProps) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <AppPill icon={icon} className="mb-4">
        {label}
      </AppPill>
      <h1 className="app-title">{title}</h1>
      {description && <p className="text-slate-400 mt-2 leading-relaxed">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;
