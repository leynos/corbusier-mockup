/** @file Overlapping circular avatars rendered from initials. */

import type { JSX } from "react";

import type { Assignee } from "../../data/tasks";

interface AvatarStackProps {
  readonly assignees: readonly Assignee[];
  /** Maximum avatars to show before "+N". Defaults to 3. */
  readonly max?: number;
  readonly className?: string;
}

export function AvatarStack({ assignees, max = 3, className = "" }: AvatarStackProps): JSX.Element {
  const visible = assignees.slice(0, max);
  const overflow = assignees.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visible.map((a) => (
        <span
          key={a.initials}
          role="img"
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-base-100 bg-primary/15 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-bold text-primary"
          title={a.name}
          aria-label={a.name}
        >
          {a.initials}
        </span>
      ))}
      {overflow > 0 ? (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-base-100 bg-base-300 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] font-bold text-base-content/70">
          +{overflow}
        </div>
      ) : null}
    </div>
  );
}
