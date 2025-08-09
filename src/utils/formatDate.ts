// Formats a date string to a Nigerian format (DD/MM/YYYY, HH:MM AM/PM, WAT)
// Input: ISO 8601 string (e.g., "2025-07-10T10:00:00Z")
// Output: Localized string (e.g., "10/07/2025, 11:00 AM")
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    return date.toLocaleString('en-NG', {
      day: '2-digit',        // e.g., 10
      month: '2-digit',      // e.g., 07
      year: 'numeric',       // e.g., 2025
      hour: '2-digit',       // e.g., 11
      minute: '2-digit',     // e.g., 00
      hour12: true,          // Use AM/PM
      timeZone: 'Africa/Lagos', // WAT (UTC+1)
    });
  } catch (error) {
    console.error('Error formatting date:', (error as Error).message);
    return 'Invalid Date';
  }
};

// Formats only the date part in Nigerian format (DD/MM/YYYY)
export const formatDateOnly = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    return date.toLocaleDateString('en-NG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Africa/Lagos',
    });
  } catch (error) {
    console.error('Error formatting date:', (error as Error).message);
    return 'Invalid Date';
  }
};

// Formats only the time part in Nigerian format (HH:MM AM/PM)
export const formatTimeOnly = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    return date.toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Lagos',
    });
  } catch (error) {
    console.error('Error formatting time:', (error as Error).message);
    return 'Invalid Time';
  }
};
