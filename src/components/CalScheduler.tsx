"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export default function CalScheduler() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

  useEffect(() => {
    if (!calLink) return;
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      const opts: any = {
        elementOrSelector: "#cal-inline-scheduler",
        calLink,
        layout: "month_view",
      };
      cal("inline", opts);
    })();
  }, [calLink]);

  if (!calLink) return null;

  return (
    <section id="schedule" className="pt-10 bg-white dark:bg-gray-900 flex justify-center">
      <div id="cal-inline-scheduler" style={{ width: "100%", minHeight: "300px" }} />
    </section>
  );
} 