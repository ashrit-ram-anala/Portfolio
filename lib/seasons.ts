export type Season = "winter" | "spring" | "summer" | "fall";
export function seasonForMonth(month: number): Season {
  return month <= 1 || month >= 10 ? "winter" : month <= 4 ? "spring" : month <= 7 ? "summer" : "fall";
}

/** The development preview may override the calendar through the root attribute. */
export function currentSeason(): Season {
  if (typeof document !== "undefined") {
    const value = document.documentElement.dataset.oceanSeason;
    if (value === "winter" || value === "spring" || value === "summer" || value === "fall") return value;
  }
  return seasonForMonth(new Date().getMonth());
}
