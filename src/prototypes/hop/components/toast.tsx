/**
 * hop / components / toast — a solid flat block that rises from behind the
 * tab bar. No blur, no shadow: it's a colour plane with knocked-out text.
 */

import { useHop } from "../state/hop-context";

export function Toast() {
  const { toast } = useHop();
  return (
    <div className={`hp-toast${toast ? " hp-toast--show" : ""}`} role="status" aria-live="polite">
      <span>{toast}</span>
    </div>
  );
}
