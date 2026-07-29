import type { ReactNode } from "react";

export function PageHeader({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

export function AIDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={
        "rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs text-muted-foreground " +
        (className ?? "")
      }
    >
      <strong className="text-foreground">Reminder:</strong> AI output may be inaccurate. Verify
      important facts, names, dates, and references before using in professional decisions.
    </div>
  );
}