/**
 * quill / components / highlight — wraps the matched span of a search query.
 *
 * Deliberately minimal: a <mark> and nothing else. Tinting the whole result row
 * would compete with the match; the highlight IS the signal.
 */

import type { ReactNode } from "react";

export function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  const term = query.trim();
  if (!term) return text;
  const lower = text.toLowerCase();
  const needle = term.toLowerCase();
  const parts: ReactNode[] = [];
  let from = 0;
  let key = 0;
  for (;;) {
    const at = lower.indexOf(needle, from);
    if (at === -1) break;
    if (at > from) parts.push(text.slice(from, at));
    parts.push(<mark key={key++}>{text.slice(at, at + needle.length)}</mark>);
    from = at + needle.length;
  }
  if (parts.length === 0) return text;
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}
