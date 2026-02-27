import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function fromDateString(dateStr: string): Date {
  return parseISO(dateStr);
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return '今日';
  if (isYesterday(date)) return '昨日';
  return format(date, 'M月d日 (E)', { locale: ja });
}

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm');
}

export function formatTimeFromDate(date: Date): string {
  return format(date, 'HH:mm');
}

export function buildDatetime(date: string, time: string): string {
  // date = 'YYYY-MM-DD', time = 'HH:MM'
  return `${date}T${time}:00.000Z`;
}

export function todayString(): string {
  return toDateString(new Date());
}
