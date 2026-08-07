import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared visual language for the app shell (/beheer and /dashboard).
 * Mirrors the Hero / Features / Services sections of the public site.
 * The underlying classes live once in index.css (.app-card, .app-pill, ...).
 */

/** Soft blue/indigo light glows behind a dark section. Purely decorative. */
export const AppGlow = ({ className }: { className?: string }) => (
  <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} aria-hidden>
    <div className="absolute -top-40 -right-32 w-[420px] h-[420px] rounded-full bg-blue-600/15 blur-[130px]" />
    <div className="absolute top-1/3 -left-40 w-[380px] h-[380px] rounded-full bg-indigo-900/30 blur-[140px]" />
    <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-blue-600/10 blur-[140px]" />
  </div>
);

/** Glass card, identical recipe to the Features cards on the homepage. */
export const AppCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean; solid?: boolean }
>(({ className, interactive, solid, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      solid ? "app-card-solid" : interactive ? "app-card-interactive" : "app-card",
      className
    )}
    {...props}
  />
));
AppCard.displayName = "AppCard";

/** Card heading row with a small coloured icon, matching the site's card style. */
export const AppCardHeader = ({
  icon: Icon,
  title,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-row items-center justify-between gap-3 px-6 pt-6 pb-4", className)}>
    <h2 className="flex items-center gap-2.5 text-base font-semibold text-white">
      {Icon && (
        <span className="app-icon-tile h-8 w-8">
          <Icon className="h-4 w-4" />
        </span>
      )}
      {title}
    </h2>
    {action}
  </div>
);

/** Pill label used above every section title on the public site. */
export const AppPill = ({
  icon: Icon,
  children,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) => (
  <span className={cn("app-pill", className)}>
    {Icon && <Icon className="h-4 w-4 text-blue-400" />}
    {children}
  </span>
);
