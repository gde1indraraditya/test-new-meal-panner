interface FamilyBadgeProps {
  code: string;
  emoji?: string | null;
  size?: "sm" | "md";
}

export default function FamilyBadge({ code, emoji, size = "md" }: FamilyBadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-zinc-100 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 ${sizeClass}`}
    >
      {emoji && <span>{emoji}</span>}
      <span>{code}</span>
    </span>
  );
}
