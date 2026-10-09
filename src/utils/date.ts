export const formatDate = (isoString?: string): string => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const isOverdue = (isoString?: string): boolean => {
  if (!isoString) return false
  const date = new Date(isoString)
  return date.getTime() < Date.now()
}
