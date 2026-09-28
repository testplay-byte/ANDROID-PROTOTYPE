/**
 * meridian / data — deterministic demo data for the desktop workspace.
 *
 * All numbers are fixed (no Math.random anywhere): the tables, charts and
 * counters must look identical on every load, exactly like the phone
 * prototypes' seeded generators.
 */

export type ProjectStatus = "on-track" | "at-risk" | "blocked" | "done";
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  owner: string;
  due: string;
  progress: number;
  budget: number;
  spent: number;
  tasksDone: number;
  tasksTotal: number;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  due: string;
  points: number;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  load: number; // 0..100
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  blocked: "Blocked",
  done: "Done",
};

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: "Backlog",
  "in-progress": "In progress",
  review: "Review",
  done: "Done",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const PROJECTS: Project[] = [
  { id: "p-atlas", name: "Atlas migration", client: "Northwind", status: "on-track", owner: "Iris Kwan", due: "Oct 14", progress: 72, budget: 240000, spent: 168400, tasksDone: 46, tasksTotal: 63 },
  { id: "p-helix", name: "Helix design system", client: "Internal", status: "at-risk", owner: "Ravi Menon", due: "Sep 30", progress: 48, budget: 120000, spent: 96400, tasksDone: 21, tasksTotal: 44 },
  { id: "p-orchard", name: "Orchard checkout", client: "Verdan Retail", status: "blocked", owner: "Maya Ellis", due: "Oct 02", progress: 31, budget: 310000, spent: 152900, tasksDone: 14, tasksTotal: 45 },
  { id: "p-lantern", name: "Lantern analytics", client: "Kestrel Labs", status: "on-track", owner: "Tomas Berg", due: "Nov 08", progress: 61, budget: 185000, spent: 98300, tasksDone: 33, tasksTotal: 54 },
  { id: "p-quarry", name: "Quarry data platform", client: "Halden Group", status: "on-track", owner: "Iris Kwan", due: "Nov 21", progress: 54, budget: 420000, spent: 214600, tasksDone: 38, tasksTotal: 71 },
  { id: "p-slate", name: "Slate billing revamp", client: "Verdan Retail", status: "at-risk", owner: "Noor Haddad", due: "Sep 26", progress: 39, budget: 156000, spent: 101300, tasksDone: 12, tasksTotal: 31 },
  { id: "p-ember", name: "Ember onboarding", client: "Pallas", status: "done", owner: "Ravi Menon", due: "Sep 05", progress: 100, budget: 88000, spent: 82100, tasksDone: 28, tasksTotal: 28 },
  { id: "p-fjord", name: "Fjord mobile parity", client: "Northwind", status: "on-track", owner: "Maya Ellis", due: "Dec 03", progress: 22, budget: 275000, spent: 61200, tasksDone: 11, tasksTotal: 49 },
];

export const TASKS: Task[] = [
  { id: "t-1", title: "Migrate billing webhooks", project: "Atlas migration", assignee: "Iris Kwan", priority: "high", status: "in-progress", due: "Sep 24", points: 5 },
  { id: "t-2", title: "Token audit: elevation ramp", project: "Helix design system", assignee: "Ravi Menon", priority: "medium", status: "review", due: "Sep 23", points: 3 },
  { id: "t-3", title: "Cart reservation endpoint", project: "Orchard checkout", assignee: "Maya Ellis", priority: "urgent", status: "in-progress", due: "Sep 22", points: 8 },
  { id: "t-4", title: "Warehouse sync SLA docs", project: "Quarry data platform", assignee: "Tomas Berg", priority: "low", status: "backlog", due: "Oct 02", points: 2 },
  { id: "t-5", title: "Funnel query optimisation", project: "Lantern analytics", assignee: "Noor Haddad", priority: "high", status: "in-progress", due: "Sep 25", points: 5 },
  { id: "t-6", title: "Proration edge cases", project: "Slate billing revamp", assignee: "Noor Haddad", priority: "urgent", status: "review", due: "Sep 23", points: 5 },
  { id: "t-7", title: "Email template cleanup", project: "Ember onboarding", assignee: "Ravi Menon", priority: "low", status: "done", due: "Sep 04", points: 2 },
  { id: "t-8", title: "Push permission copy", project: "Fjord mobile parity", assignee: "Maya Ellis", priority: "medium", status: "backlog", due: "Oct 08", points: 3 },
  { id: "t-9", title: "Nightly ingest backfill", project: "Quarry data platform", assignee: "Tomas Berg", priority: "high", status: "review", due: "Sep 26", points: 8 },
  { id: "t-10", title: "Session replay sampling", project: "Lantern analytics", assignee: "Iris Kwan", priority: "medium", status: "backlog", due: "Oct 11", points: 5 },
  { id: "t-11", title: "Tax table import", project: "Slate billing revamp", assignee: "Noor Haddad", priority: "high", status: "in-progress", due: "Sep 24", points: 3 },
  { id: "t-12", title: "Component contrast regression", project: "Helix design system", assignee: "Ravi Menon", priority: "urgent", status: "in-progress", due: "Sep 22", points: 5 },
];

export const PEOPLE: Person[] = [
  { id: "u-iris", name: "Iris Kwan", initials: "IK", role: "Staff engineer", load: 82 },
  { id: "u-ravi", name: "Ravi Menon", initials: "RM", role: "Design lead", load: 64 },
  { id: "u-maya", name: "Maya Ellis", initials: "ME", role: "Senior engineer", load: 91 },
  { id: "u-tomas", name: "Tomas Berg", initials: "TB", role: "Data engineer", load: 47 },
  { id: "u-noor", name: "Noor Haddad", initials: "NH", role: "Product manager", load: 73 },
];

/** Throughput, tasks completed per week (12 weeks). */
export const THROUGHPUT = [18, 22, 19, 26, 24, 31, 28, 34, 30, 38, 35, 41];

/** Needs attention — surfaced on the overview. */
export const ATTENTION: { id: string; title: string; detail: string; severity: "high" | "medium" }[] = [
  { id: "a-1", title: "Orchard checkout is blocked", detail: "Waiting on the Verdan payments team since Sep 18", severity: "high" },
  { id: "a-2", title: "Slate billing at risk", detail: "Proration edge cases unresolved 2 days past due", severity: "high" },
  { id: "a-3", title: "Maya is at 91% load", detail: "Two urgent tasks due within 48 hours", severity: "medium" },
  { id: "a-4", title: "Helix elevation ramp review", detail: "Design review scheduled for tomorrow", severity: "medium" },
];

export const ACTIVITY: { id: string; who: string; what: string; when: string }[] = [
  { id: "e-1", who: "Iris Kwan", what: "moved Billing webhooks to review", when: "12 min ago" },
  { id: "e-2", who: "Noor Haddad", what: "raised the Slate risk flag", when: "1 h ago" },
  { id: "e-3", who: "Tomas Berg", what: "closed 4 Quarry milestones", when: "3 h ago" },
  { id: "e-4", who: "Ravi Menon", what: "published Helix tokens v2.4", when: "Yesterday" },
  { id: "e-5", who: "Maya Ellis", what: "opened Orchard checkout sprint 12", when: "Yesterday" },
];

export const MILESTONES: { id: string; title: string; project: string; date: string; state: "next" | "later" | "done" }[] = [
  { id: "m-1", title: "Beta cutover rehearsal", project: "Atlas migration", date: "Sep 26", state: "next" },
  { id: "m-2", title: "Store listing review", project: "Ember onboarding", date: "Sep 30", state: "next" },
  { id: "m-3", title: "Proration sign-off", project: "Slate billing revamp", date: "Oct 04", state: "later" },
  { id: "m-4", title: "Warehouse go-live", project: "Quarry data platform", date: "Oct 18", state: "later" },
];

export const money = (n: number) =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : `$${Math.round(n / 1000)}k`;

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id);
export const personByName = (name: string) => PEOPLE.find((p) => p.name === name);
