
/**
 * Format a date to Dutch locale format
 * @param dateString Date string to format
 * @returns Formatted date string in Dutch locale
 */
export function formatDutchDate(dateString: string | null): string {
  if (!dateString) return 'Nooit';
  return new Date(dateString).toLocaleDateString('nl-NL');
}
