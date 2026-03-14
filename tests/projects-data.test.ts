/** @file Regression tests for project/task grouping helpers. */

import { describe, expect, it } from "bun:test";

import { groupTasksByState } from "../src/data/projects";
import { APOLLO_GUIDANCE_SLUG } from "../src/data/registries/project-descriptors";
import { TASKS, TaskState, taskId } from "../src/data/tasks";

describe("groupTasksByState", () => {
  it("keeps blocked drafts in the todo bucket instead of planned", () => {
    const summary = groupTasksByState(APOLLO_GUIDANCE_SLUG, TASKS);

    expect(summary.draftBuckets.planned).toHaveLength(0);
    expect(summary.draftBuckets.todo.map((task) => task.id)).toContain(taskId("TASK-1003"));
    expect(summary.grouped[TaskState.Draft].map((task) => task.id)).toContain(taskId("TASK-1003"));
  });
});
