"use client";

import { useEffect } from "react";
// @ts-ignore
import { getCalApi } from "@calcom/embed-react";

export default function CalScheduler() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      const opts: any = {
        elementOrSelector: "#cal-inline-scheduler",
        calLink: "jokhendra/30min",
        layout: "month_view",
      };
      cal("inline", opts);
    })();
  }, []);

  return (
    <section id="schedule" className="pt-10 bg-white dark:bg-gray-900 flex justify-center">
      <div id="cal-inline-scheduler" style={{ width: "100%", minHeight: "300px" }} />
    </section>
  );
} 