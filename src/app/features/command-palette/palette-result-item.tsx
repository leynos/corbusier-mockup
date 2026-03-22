/** @file Individual result row in the command palette listbox. */

import { IconArrowRight } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { pickLocalization } from "../../domain/entities/localization";
import { kindIcons, type PaletteItem } from "./command-palette-items";

interface PaletteResultItemProps {
  readonly item: PaletteItem;
  readonly isActive: boolean;
  readonly onSelect: (item: PaletteItem) => void;
  readonly onMouseEnter: () => void;
}

export function PaletteResultItem({
  item,
  isActive,
  onSelect,
  onMouseEnter,
}: PaletteResultItemProps): JSX.Element {
  const { i18n } = useTranslation();
  const Icon = kindIcons[item.kind];
  const loc = pickLocalization(item.localizations, i18n.language);

  return (
    <div
      id={`palette-item-${item.id}`}
      role="option"
      tabIndex={-1}
      aria-selected={isActive}
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[length:var(--font-size-sm)] ${
        isActive ? "bg-primary text-primary-content" : "text-base-content hover:bg-base-200"
      }`}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
      onMouseEnter={onMouseEnter}
    >
      <Icon size={16} stroke={1.5} aria-hidden="true" />
      <span className="flex-1 truncate">{loc.name}</span>
      {item.meta ? (
        <span
          className={`font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] ${isActive ? "text-primary-content" : "text-base-content/60"}`}
        >
          {item.meta}
        </span>
      ) : null}
      {isActive ? <IconArrowRight size={14} stroke={1.5} aria-hidden="true" /> : null}
    </div>
  );
}
