/** @file Tests for the DataTable component. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen, within } from "@testing-library/react";

import { type Column, DataTable } from "../src/app/components/data-table";
import { renderWithProviders } from "./utils/render-with-providers";

interface TestRow {
  readonly id: string;
  readonly name: string;
  readonly count: number;
}

const TEST_DATA: readonly TestRow[] = [
  { id: "r-1", name: "Alpha", count: 10 },
  { id: "r-2", name: "Beta", count: 20 },
  { id: "r-3", name: "Gamma", count: 30 },
];

const TEST_COLUMNS = [
  { key: "name", header: "Name" },
  { key: "count", header: "Count" },
] satisfies readonly Column<TestRow, keyof TestRow & string>[];

describe("DataTable", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders column headers", () => {
    renderWithProviders(
      <DataTable columns={TEST_COLUMNS} data={TEST_DATA} rowKey={(r) => r.id} label="Test table" />,
    );

    const table = screen.getByRole("table", { name: "Test table" });
    expect(table).toBeTruthy();

    const headers = within(table).getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
    expect(headers[0]?.textContent).toBe("Name");
    expect(headers[1]?.textContent).toBe("Count");
  });

  it("renders all data rows", () => {
    renderWithProviders(
      <DataTable columns={TEST_COLUMNS} data={TEST_DATA} rowKey={(r) => r.id} label="Test table" />,
    );

    const rows = screen.getAllByRole("row");
    /* 1 header row + 3 data rows */
    expect(rows).toHaveLength(4);

    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Beta")).toBeTruthy();
    expect(screen.getByText("Gamma")).toBeTruthy();
  });

  it("renders custom cell content via render prop", () => {
    const columns = [
      {
        key: "name",
        header: "Name",
        render: (_v, row) => <strong>{String(row.name)}</strong>,
      },
      { key: "count", header: "Count" },
    ] satisfies readonly Column<TestRow, keyof TestRow & string>[];

    renderWithProviders(
      <DataTable columns={columns} data={TEST_DATA} rowKey={(r) => r.id} label="Test table" />,
    );

    const alpha = screen.getByText("Alpha");
    expect(alpha).toBeTruthy();
    expect(alpha.tagName).toBe("STRONG");
  });

  it("renders focusable buttons for interactive rows", () => {
    renderWithProviders(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        rowKey={(r) => r.id}
        label="Test table"
        onRowClick={() => {}}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("renders an accessible table label", () => {
    renderWithProviders(
      <DataTable
        columns={TEST_COLUMNS}
        data={TEST_DATA}
        rowKey={(r) => r.id}
        label="Personnel directory"
      />,
    );

    expect(screen.getByRole("table", { name: "Personnel directory" })).toBeTruthy();
  });
});
