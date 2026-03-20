/** @file Reusable data table with proper semantics and accessible markup.
 *
 * Renders a `<table>` using DaisyUI `table` classes with column
 * headers (`<th scope="col">`), row hover, zebra striping, tabular
 * figures, and a minimum row height of 36 px (WCAG 2.5.8).
 */

import type { JSX, ReactNode } from "react";

/* ── Public interface ─────────────────────────────────────────────── */

export interface Column<T, K extends keyof T & string = keyof T & string> {
  readonly key: K;
  readonly header: string;
  readonly render?: (value: T[K], row: T) => ReactNode;
  readonly className?: string;
}

export interface DataTableProps<
  T,
  C extends readonly Column<T, keyof T & string>[] = readonly Column<T, keyof T & string>[],
> {
  readonly columns: C;
  readonly data: readonly T[];
  readonly rowKey: (row: T) => string;
  readonly onRowClick?: (row: T) => void;
  readonly label: string;
}

/* ── Component ────────────────────────────────────────────────────── */

export function DataTable<T, const C extends readonly Column<T, keyof T & string>[]>({
  columns,
  data,
  rowKey,
  onRowClick,
  label,
}: DataTableProps<T, C>): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full" aria-label={label}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const key = rowKey(row);
            const interactive = onRowClick !== undefined;
            return (
              <tr
                key={key}
                className={
                  interactive ? "cursor-pointer hover:bg-base-200/60" : "hover:bg-base-200/40"
                }
                onClick={interactive ? () => onRowClick(row) : undefined}
              >
                {columns.map((col, index) => {
                  const content = col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "");
                  const isPrimaryInteractiveCell = interactive && index === 0;
                  return (
                    <td
                      key={col.key}
                      className={`min-h-9 text-[length:var(--font-size-sm)] ${col.className ?? ""}`}
                    >
                      {isPrimaryInteractiveCell ? (
                        <button
                          type="button"
                          className="block w-full cursor-pointer bg-transparent text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(row);
                          }}
                        >
                          {content}
                        </button>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
