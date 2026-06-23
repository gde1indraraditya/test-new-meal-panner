"use client";

import { useEffect, useState } from "react";
import type { FamilyMember } from "@/lib/types";
import FamilyBadge from "@/components/Family/FamilyBadge";

interface FamilyPickerProps {
  selected: string[];
  onChange: (codes: string[]) => void;
}

export default function FamilyPicker({ selected, onChange }: FamilyPickerProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    fetch("/api/family-members")
      .then((r) => r.json())
      .then(setMembers);
  }, []);

  const toggle = (code: string) => {
    if (selected.includes(code)) {
      onChange(selected.filter((c) => c !== code));
    } else {
      onChange([...selected, code]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => {
        const active = selected.includes(m.code);
        return (
          <button
            key={m.code}
            type="button"
            onClick={() => toggle(m.code)}
            className={`rounded-full border-2 px-3 py-1 text-sm font-medium transition-colors ${
              active
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            {m.emoji && <span className="mr-1">{m.emoji}</span>}
            {m.code}
          </button>
        );
      })}
    </div>
  );
}
