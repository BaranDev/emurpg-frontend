import { ClockIcon, CalendarIcon, ScrollIcon } from "./EmuconIcons";

const scheduleItems = [
  { time: "1:00 PM", event: "Doors Open", eventTr: "Kapılar Açılır" },
  { time: "2:00 PM", event: "Activities Begin", eventTr: "Etkinlikler Başlar" },
  { time: "5:00 PM", event: "Peak Hours", eventTr: "Yoğun Saatler" },
  {
    time: "7:00 PM",
    event: "Main Stage Finals",
    eventTr: "Ana Sahne Finalleri",
  },
  { time: "10:00 PM", event: "Event Closes", eventTr: "Etkinlik Kapanışı" },
];

const EmuconSchedule = () => {
  return (
    <div
      className="relative rounded-xl p-4 md:p-6 lg:p-10 text-center border border-forest-medium/70 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, rgba(26, 46, 26, 0.75), rgba(13, 31, 13, 0.9))",
      }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(107,155,107,0.3), transparent)",
        }}
      />

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-forest-light/30 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-forest-light/30 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-forest-light/30 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-forest-light/30 rounded-br-xl" />

      {/* Inner decorative border */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-forest-light/10 rounded-lg pointer-events-none" />

      {/* Header with calendar icon */}
      <div className="relative mb-4 md:mb-6 lg:mb-8">
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-lg"
      style={{
        background:
              "linear-gradient(135deg, rgba(45, 74, 45, 0.4), rgba(26, 46, 26, 0.5))",
            border: "1px solid rgba(74, 124, 74, 0.3)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      }}
    >
          <div
            className="p-2 rounded-md"
            style={{
              background: "rgba(201, 162, 39, 0.15)",
              border: "1px solid rgba(201, 162, 39, 0.25)",
            }}
          >
            <CalendarIcon size={20} className="text-gold-light" />
          </div>
          <h3 className="font-cinzel text-xl md:text-2xl text-cream">
        December 20, 2025
      </h3>
        </div>
      </div>

      {/* Schedule timeline */}
      <div className="relative py-4">
        {/* Connecting line - desktop */}
        <div
          className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 transform -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(74,124,74,0.4) 20%, rgba(74,124,74,0.4) 80%, transparent)",
          }}
        />

      {/* Schedule items */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-5">
        {scheduleItems.map((item, index) => (
          <div
            key={index}
              className="group relative flex flex-col items-center px-4 md:px-5 lg:px-6 py-3 md:py-4 lg:py-5 rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] min-w-[100px] md:min-w-[120px] lg:min-w-[140px]"
              style={{
                background:
                  "linear-gradient(145deg, rgba(45, 74, 45, 0.6), rgba(26, 46, 26, 0.8))",
                border: "1px solid rgba(74, 124, 74, 0.35)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              {/* Inner highlight */}
              <div className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Time badge */}
              <div
                className="flex items-center gap-2 mb-2 md:mb-3 px-2 md:px-3 py-1 md:py-1.5 rounded-md"
                style={{
                  background: "rgba(201, 162, 39, 0.12)",
                  border: "1px solid rgba(201, 162, 39, 0.2)",
                }}
          >
                <ClockIcon
                  size={14}
                  className="text-gold-light/80 group-hover:text-gold-light transition-colors"
                />
                <span className="text-gold-light font-semibold text-sm md:text-base">
                  {item.time}
                </span>
              </div>

              {/* Event name */}
              <span className="text-cream text-sm md:text-base text-center leading-tight font-medium">
            {item.event}
              </span>
              <span className="text-emucon-text-muted text-xs mt-1">
                {item.eventTr}
              </span>

              {/* Dot connector */}
              <div className="hidden lg:block absolute -bottom-2.5 left-1/2 transform -translate-x-1/2">
                <div className="w-2.5 h-2.5 rounded-full bg-forest-light/40 group-hover:bg-gold/50 transition-colors border border-forest-medium" />
              </div>
          </div>
        ))}
        </div>
      </div>

      {/* Disclaimer section */}
      <div
        className="mt-6 md:mt-8 lg:mt-10 pt-4 md:pt-5 lg:pt-6 mx-4 md:mx-8 rounded-lg"
        style={{
          borderTop: "1px solid rgba(74, 124, 74, 0.25)",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
          <div
            className="p-1.5 rounded"
            style={{ background: "rgba(74, 124, 74, 0.2)" }}
          >
            <ScrollIcon size={14} className="text-forest-light/60" />
          </div>
          <span className="text-forest-light/60 text-xs uppercase tracking-wider font-medium">
            Schedule Notice
          </span>
        </div>
        <p className="text-emucon-text-secondary text-sm md:text-base leading-relaxed">
          This plan can be changed. Detailed schedule will be announced closer
          to the event.
        </p>
        <p className="text-emucon-text-muted text-xs md:text-sm mt-2 italic">
          Detaylı program etkinliğe yakın duyurulacaktır. Program değişebilir.
      </p>
      </div>
    </div>
  );
};

export default EmuconSchedule;
