interface TimelineRailProps {
  /** First header on the page: no rail segment above its dot. */
  isFirst?: boolean;
  /** Last header on the page: no rail segment below its dot. */
  isLast?: boolean;
  /** Set false to render only the rail (used for the TabletImageGrid interlude). */
  showDot?: boolean;
}

/**
 * Vertical grey timeline rail + dot shown next to each FeaturedProducts
 * category header. Must be rendered as a direct child of a `relative`
 * section whose header bar is h-16 with section py-10, so the dot center
 * lands at 4.5rem (2.5rem padding + half the 4rem bar).
 *
 * Horizontal geometry: rail center = 19px from the section edge, leaving a
 * 34px gap between the dot and the grey header bar (bar starts at 60px:
 * 30px container padding + 30px bar offset).
 */
export default function TimelineRail({
  isFirst = false,
  isLast = false,
  showDot = true,
}: TimelineRailProps) {
  return (
    <>
      {!isFirst && (
        <span
          aria-hidden
          className="absolute left-[18px] top-0 bottom-[calc(100%_-_4.5rem)] w-[2px] bg-zinc-300"
        />
      )}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[18px] top-[4.5rem] bottom-0 w-[2px] bg-zinc-300"
        />
      )}
      {showDot && (
        <span
          aria-hidden
          className="absolute left-[12px] top-[4.5rem] h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-zinc-400"
        />
      )}
    </>
  );
}
