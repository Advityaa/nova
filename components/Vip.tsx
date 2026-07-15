"use client";

export default function Vip() {
  return (
    <section className="sec" id="vip">
      <div className="vip">
        <div className="vbg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/vip.jpg" alt="Nova VIP room" />
        </div>
        <div className="vinner">
          <span className="eyebrow">Tables &amp; bottle service</span>
          <h2>Own the room</h2>
          <p>
            Skyline views, premium bottles and the best seats in the house —
            from the Bund rooftop to the Mass main floor. Reserved before you
            arrive.
          </p>
          <div className="vacts">
            <button
              className="solid"
              onClick={() =>
                alert(
                  "VIP table enquiry\n\nHook to your booking form / WeChat: Novaevents"
                )
              }
            >
              Book a table
            </button>
            <button
              onClick={() =>
                alert("Private events\n\nHook to your enquiry form.")
              }
            >
              Private events
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
