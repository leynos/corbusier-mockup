/** @file Branch and PR association panel. */

import { IconGitBranch, IconGitPullRequest } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

interface BranchPrPanelProps {
  readonly branchRef: string | undefined;
  readonly pullRequestRef: string | undefined;
}

export function BranchPrPanel({ branchRef, pullRequestRef }: BranchPrPanelProps): JSX.Element {
  const { t } = useTranslation();

  if (branchRef === undefined && pullRequestRef === undefined) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-base-content/60">
        {t("task-branch-none", { defaultValue: "No branch or PR associated." })}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {branchRef !== undefined ? (
        <div className="flex items-center gap-2">
          <IconGitBranch size={16} stroke={1.5} className="text-primary" aria-hidden="true" />
          <code className="rounded bg-base-200 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content">
            {branchRef}
          </code>
        </div>
      ) : null}
      {pullRequestRef !== undefined ? (
        <div className="flex items-center gap-2">
          <IconGitPullRequest size={16} stroke={1.5} className="text-success" aria-hidden="true" />
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] font-semibold text-base-content">
            {pullRequestRef}
          </span>
        </div>
      ) : null}
    </div>
  );
}
