/** @file Tests for the task state machine transitions. */

import { describe, expect, it } from "bun:test";

import { canTransitionTo, TaskState, validTransitions } from "../src/data/tasks";

describe("canTransitionTo", () => {
  it("allows draft → in_progress", () => {
    expect(canTransitionTo(TaskState.Draft, TaskState.InProgress)).toBe(true);
  });

  it("allows in_progress → in_review", () => {
    expect(canTransitionTo(TaskState.InProgress, TaskState.InReview)).toBe(true);
  });

  it("allows in_progress → paused", () => {
    expect(canTransitionTo(TaskState.InProgress, TaskState.Paused)).toBe(true);
  });

  it("allows in_review → done", () => {
    expect(canTransitionTo(TaskState.InReview, TaskState.Done)).toBe(true);
  });

  it("allows in_review → in_progress (send back)", () => {
    expect(canTransitionTo(TaskState.InReview, TaskState.InProgress)).toBe(true);
  });

  it("allows paused → in_progress", () => {
    expect(canTransitionTo(TaskState.Paused, TaskState.InProgress)).toBe(true);
  });

  it("allows any state → abandoned", () => {
    for (const state of [
      TaskState.Draft,
      TaskState.InProgress,
      TaskState.InReview,
      TaskState.Paused,
      TaskState.Done,
    ]) {
      expect(canTransitionTo(state, TaskState.Abandoned)).toBe(true);
    }
  });

  it("rejects draft → done (skip review)", () => {
    expect(canTransitionTo(TaskState.Draft, TaskState.Done)).toBe(false);
  });

  it("rejects done → in_progress (reopen)", () => {
    expect(canTransitionTo(TaskState.Done, TaskState.InProgress)).toBe(false);
  });

  it("rejects abandoned → any (terminal)", () => {
    for (const target of Object.values(TaskState)) {
      if (target === TaskState.Abandoned) continue;
      expect(canTransitionTo(TaskState.Abandoned, target)).toBe(false);
    }
  });
});

describe("validTransitions", () => {
  it("returns two targets for draft", () => {
    const targets = validTransitions(TaskState.Draft);
    expect(targets).toContain(TaskState.InProgress);
    expect(targets).toContain(TaskState.Abandoned);
    expect(targets).toHaveLength(2);
  });

  it("returns empty for abandoned", () => {
    expect(validTransitions(TaskState.Abandoned)).toHaveLength(0);
  });

  it("returns three targets for in_progress", () => {
    const targets = validTransitions(TaskState.InProgress);
    expect(targets).toHaveLength(3);
    expect(targets).toContain(TaskState.InReview);
    expect(targets).toContain(TaskState.Paused);
    expect(targets).toContain(TaskState.Abandoned);
  });
});
