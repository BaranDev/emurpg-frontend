function parseHour(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const hour = Number(value);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return null;
  }

  return hour;
}

export function getRegistrationOpenAt(event) {
  const hour = parseHour(event?.registration_start_hour);
  const startDate = event?.registration_start_date || event?.start_date;

  if (hour === null || typeof startDate !== "string") {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(startDate);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const result = new Date(year, monthIndex, day, hour, 0, 0, 0);

  if (
    result.getFullYear() !== year ||
    result.getMonth() !== monthIndex ||
    result.getDate() !== day
  ) {
    return null;
  }

  return result;
}

export function isRegistrationOpen(event, now = new Date()) {
  const openAt = getRegistrationOpenAt(event);
  if (!openAt) {
    return true;
  }

  return now.getTime() >= openAt.getTime();
}

export function formatRegistrationCountdown(targetDate, now = new Date()) {
  const diffMs = targetDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return "0m";
  }

  let totalMinutes = Math.ceil(diffMs / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  totalMinutes -= days * 24 * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes - hours * 60;

  const parts = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0 || days > 0) {
    parts.push(`${hours}h`);
  }
  parts.push(`${minutes}m`);

  return parts.join(" ");
}
