import type { EventPublic } from '../types';

/**
 * Format a date string (YYYY-MM-DD) and optional time string (HH:MM or HH:MM:SS)
 * into iCal format: YYYYMMDDTHHmm00 (or YYYYMMDD for all-day).
 */
export function formatIcsDate(dateStr: string | null, timeStr: string | null): string {
  if (!dateStr) {
    const now = new Date();
    return now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const cleanDate = dateStr.replace(/-/g, '').slice(0, 8);

  if (!timeStr) {
    return cleanDate;
  }

  const timeParts = timeStr.split(':');
  const hh = (timeParts[0] || '00').padStart(2, '0');
  const mm = (timeParts[1] || '00').padStart(2, '0');
  const ss = (timeParts[2] || '00').padStart(2, '0');

  return `${cleanDate}T${hh}${mm}${ss}`;
}

/**
 * Generates an iCalendar (.ics) string for a single event.
 */
export function generateSingleEventIcs(event: EventPublic): string {
  const dtStart = formatIcsDate(event.start_date, event.start_time);
  const dtEnd = formatIcsDate(
    event.end_date || event.start_date,
    event.end_time || (event.start_time ? `${parseInt(event.start_time.split(':')[0], 10) + 1}:00` : null)
  );

  const cleanSummary = (event.title || 'Church Event').replace(/\n/g, ' ');
  const cleanDescription = (event.description || '').replace(/\r\n/g, '\\n').replace(/\n/g, '\\n');
  const cleanLocation = (event.location || '').replace(/\n/g, ' ');
  const uid = `event-${event.id || 'horaios'}@horaiosbaptist.org`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Horaios Baptist Church//Church Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generates an iCalendar (.ics) string for multiple events.
 */
export function generateMultipleEventsIcs(events: EventPublic[]): string {
  const vEvents = events.map((event) => {
    const dtStart = formatIcsDate(event.start_date, event.start_time);
    const dtEnd = formatIcsDate(
      event.end_date || event.start_date,
      event.end_time || (event.start_time ? `${parseInt(event.start_time.split(':')[0], 10) + 1}:00` : null)
    );

    const cleanSummary = (event.title || 'Church Event').replace(/\n/g, ' ');
    const cleanDescription = (event.description || '').replace(/\r\n/g, '\\n').replace(/\n/g, '\\n');
    const cleanLocation = (event.location || '').replace(/\n/g, ' ');
    const uid = `event-${event.id}@horaiosbaptist.org`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${cleanSummary}`,
      `DESCRIPTION:${cleanDescription}`,
      `LOCATION:${cleanLocation}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Horaios Baptist Church//Church Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...vEvents,
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers browser download of an .ics file from string content.
 */
export function downloadIcsFile(content: string, filename = 'church-event.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a direct Google Calendar add event URL.
 */
export function getGoogleCalendarUrl(event: EventPublic): string {
  const dtStart = formatIcsDate(event.start_date, event.start_time);
  const dtEnd = formatIcsDate(
    event.end_date || event.start_date,
    event.end_time || (event.start_time ? `${parseInt(event.start_time.split(':')[0], 10) + 1}:00` : null)
  );

  const datesParam = `${dtStart}/${dtEnd}`;
  const details = event.description || '';
  const location = event.location || '';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || 'Church Event',
    dates: datesParam,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
