"use client";

/* simmer / components/toast — a puffy clay snackbar that rises from
   behind the tab bar and melts back down. */

import { useSimmer } from "../state/simmer-context";
import { CheckIcon, HeartIcon, InfoIcon, PotIcon } from "./icons";

export function Toast() {
  const { toast } = useSimmer();
  if (!toast) return null;
  const Icon =
    toast.icon === "check" ? CheckIcon : toast.icon === "heart" ? HeartIcon : toast.icon === "pot" ? PotIcon : InfoIcon;
  return (
    <div className="sm-toast" role="status" key={toast.msg}>
      <span className="sm-toast-ico">
        <Icon size={15} />
      </span>
      {toast.msg}
    </div>
  );
}
