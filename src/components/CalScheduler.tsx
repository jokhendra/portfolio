"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export default function CalScheduler() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

  useEffect(() => {
    if (!calLink) return;
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("inline", {
        elementOrSelector: "#cal-inline-scheduler",
        calLink,
        layout: "month_view",
      });
    })();
  }, [calLink]);

  if (!calLink) return null;

  return (
    <section id="schedule" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Schedule</p>
          <h2 className="section-heading mt-4">Book a technical call</h2>
          <p className="lede mt-5">
            Thirty minutes to walk through your architecture, or to talk about a role.
          </p>
        </div>

        <div
          id="cal-inline-scheduler"
          className="mt-12 border bg-surface"
          style={{ borderColor: 'var(--line)', width: '100%', minHeight: '520px' }}
        />
      </div>
    </section>
  );
}
