/**
 * Format date to display string
 */
export function formatMatchDate(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format probability as percentage string
 */
export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(1)}%`;
}

/**
 * Get color class based on confidence level
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 70) return 'text-green-400';
  if (confidence >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Get form badge color
 */
export function getFormColor(result: string): string {
  switch (result) {
    case 'W': return 'bg-green-500';
    case 'D': return 'bg-yellow-500';
    case 'L': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}
