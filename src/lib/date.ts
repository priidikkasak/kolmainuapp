export const TIME_ZONE = "Europe/Tallinn";

export const ET_WEEKDAYS = [
  "Pühapäev",
  "Esmaspäev",
  "Teisipäev",
  "Kolmapäev",
  "Neljapäev",
  "Reede",
  "Laupäev",
] as const;

export const ET_MONTHS = [
  "jaanuar",
  "veebruar",
  "märts",
  "aprill",
  "mai",
  "juuni",
  "juuli",
  "august",
  "september",
  "oktoober",
  "november",
  "detsember",
] as const;

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
  hour12: false,
});

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Calendar fields of `date` as seen in Tallinn, independent of server TZ. */
export function zoned(date: Date) {
  const parts = partsFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")) % 24,
    minute: Number(get("minute")),
    weekday: WEEKDAY_INDEX[get("weekday")] ?? 0,
  };
}

/** "26. juuli" */
export function formatDayMonth(date: Date) {
  const { day, month } = zoned(date);
  return `${day}. ${ET_MONTHS[month - 1]}`;
}

/** "Pühapäev" */
export function formatWeekday(date: Date) {
  return ET_WEEKDAYS[zoned(date).weekday];
}

/** "Pühapäev, 26. juuli" */
export function formatLongDate(date: Date) {
  return `${formatWeekday(date)}, ${formatDayMonth(date)}`;
}

/** "11.00" */
export function formatTime(date: Date) {
  const { hour, minute } = zoned(date);
  return `${hour}.${String(minute).padStart(2, "0")}`;
}

/** "15. kuni 20. august" — collapses the month when both ends share it. */
export function formatRange(start: Date, end?: Date | null) {
  if (!end) return formatDayMonth(start);
  const a = zoned(start);
  const b = zoned(end);
  if (a.day === b.day && a.month === b.month) return formatDayMonth(start);
  if (a.month === b.month) return `${a.day}. kuni ${b.day}. ${ET_MONTHS[b.month - 1]}`;
  return `${formatDayMonth(start)} kuni ${formatDayMonth(end)}`;
}

/** "3 päeva" / "6 päeva" — duration label for multi-day events. */
export function formatDayCount(start: Date, end?: Date | null) {
  if (!end) return null;
  const ms = end.getTime() - start.getTime();
  const days = Math.round(ms / 86_400_000) + 1;
  return days > 1 ? `${days} päeva` : null;
}

/** Value for `<input type="datetime-local">` in Tallinn time. */
export function toLocalInput(date: Date | null | undefined) {
  if (!date) return "";
  const { year, month, day, hour, minute } = zoned(date);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${year}-${p(month)}-${p(day)}T${p(hour)}:${p(minute)}`;
}

const OFFSET_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  timeZoneName: "longOffset",
});

/** Parse "2026-08-16T11:00" as Tallinn wall-clock time. */
export function fromLocalInput(value: string): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);
  if (!match) return null;
  const [, y, mo, d, h = "00", mi = "00"] = match;
  // Guess with UTC, then correct by the zone offset actually in effect then.
  const guess = new Date(`${y}-${mo}-${d}T${h}:${mi}:00Z`);
  const name = OFFSET_FORMATTER.formatToParts(guess).find(
    (p) => p.type === "timeZoneName"
  )?.value;
  const offsetMatch = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!offsetMatch) return guess;
  const sign = offsetMatch[1] === "-" ? -1 : 1;
  const offsetMs =
    sign * (Number(offsetMatch[2]) * 3_600_000 + Number(offsetMatch[3]) * 60_000);
  return new Date(guess.getTime() - offsetMs);
}
