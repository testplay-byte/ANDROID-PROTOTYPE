"use client";

/**
 * meridian / screens / projects — the desktop data table.
 *
 * What makes this a DESKTOP table, not a phone list:
 *   - multi-column sortable headers (click to toggle asc/desc)
 *   - a filter toolbar (search + status chips) above the data
 *   - checkbox multi-select with a bulk action bar
 *   - a right-hand INSPORER panel that opens beside the table (not over it)
 *   - a density preference that changes row height app-wide
 */

import { STATUS_LABEL, money, type ProjectStatus } from "../data";
import { useMeridian, type SortKey } from "../state/meridian-context";
import { CheckIcon, SearchIcon } from "../components/icons";
import { Inspector } from "../components/inspector";

const FILTERS: (ProjectStatus | "all")[] = ["all", "on-track", "at-risk", "blocked", "done"];

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Project" },
  { key: "owner", label: "Owner" },
  { key: "progress", label: "Progress", align: "right" },
  { key: "budget", label: "Budget", align: "right" },
];

export function ProjectsScreen() {
  const {
    filteredProjects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sort,
    toggleSort,
    selectedProject,
    selectProject,
    selectedTasks,
    toggleTask,
    clearTasks,
    density,
    notify,
  } = useMeridian();

  const allSelected = filteredProjects.length > 0 && selectedTasks.length === filteredProjects.length;

  return (
    <div className="mrd-view mrd-view--split" data-density={density}>
      <div className="mrd-tablewrap">
        <div className="mrd-toolbar">
          <label className="mrd-search">
            <SearchIcon size={16} />
            <input
              type="search"
              value={search}
              placeholder="Search projects, clients, owners"
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search projects"
            />
            <kbd>/</kbd>
          </label>
          <div className="mrd-filters" role="group" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`mrd-filter ${statusFilter === f ? "is-on" : ""}`}
                aria-pressed={statusFilter === f}
                onClick={() => setStatusFilter(f)}
              >
                {f === "all" ? "All" : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
        </div>

        {selectedTasks.length > 0 && (
          <div className="mrd-bulkbar" role="status">
            <b className="tnum">{selectedTasks.length}</b> selected
            <span className="mrd-bulkbar__sep" />
            <button type="button" onClick={() => notify("Owner reassigned to the selected projects")}>
              Reassign owner
            </button>
            <button type="button" onClick={() => notify("Status change queued for review")}>
              Change status
            </button>
            <button type="button" onClick={clearTasks} className="mrd-bulkbar__clear">
              Clear
            </button>
          </div>
        )}

        <table className="mrd-table">
          <thead>
            <tr>
              <th scope="col" className="mrd-table__check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  aria-label="Select all rows"
                  onChange={() => {
                    if (allSelected) clearTasks();
                    else filteredProjects.forEach((p) => toggleTask(p.id));
                  }}
                />
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col" style={c.align === "right" ? { textAlign: "right" } : undefined}>
                  <button type="button" onClick={() => toggleSort(c.key)} aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                    {c.label}
                    <span className={`mrd-sort ${sort.key === c.key ? "is-on" : ""}`} aria-hidden="true">
                      {sort.key === c.key && sort.dir === "asc" ? "▲" : "▼"}
                    </span>
                  </button>
                </th>
              ))}
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => {
              const checked = selectedTasks.includes(p.id);
              return (
                <tr
                  key={p.id}
                  data-selected={selectedProject === p.id || undefined}
                  data-checked={checked || undefined}
                  onClick={() => selectProject(selectedProject === p.id ? null : p.id)}
                >
                  <td className="mrd-table__check" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checked}
                      aria-label={`Select ${p.name}`}
                      onChange={() => toggleTask(p.id)}
                    />
                  </td>
                  <td>
                    <b>{p.name}</b>
                    <span className="mrd-table__sub">{p.client}</span>
                  </td>
                  <td>
                    <span className="mrd-owner">
                      <span className="mrd-avatar mrd-avatar--sm" aria-hidden="true">
                        {p.owner.split(" ").map((n) => n[0]).join("")}
                      </span>
                      {p.owner}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="mrd-progress">
                      <span className="mrd-progress__track">
                        <span className="mrd-progress__fill" style={{ width: `${p.progress}%` }} />
                      </span>
                      <b className="tnum">{p.progress}%</b>
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }} className="tnum">
                    {money(p.budget)}
                  </td>
                  <td>
                    <span className="mrd-status" data-status={p.status}>
                      <i aria-hidden="true" />
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={6} className="mrd-table__empty">
                  No projects match “{search}”. Clear the search or pick another status.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <footer className="mrd-tablefoot">
          <span className="tnum">
            {filteredProjects.length} of 8 projects
          </span>
          <span className="mrd-tablefoot__hint">
            <CheckIcon size={13} /> Click a row to inspect it on the right
          </span>
        </footer>
      </div>

      {selectedProject && <Inspector />}
    </div>
  );
}
