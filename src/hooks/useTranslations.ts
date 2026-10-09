const dictionaries = {
  category: {
    ALL: 'Все',
    WORK: 'Работа',
    PROF: 'Актив',
    STUDY: 'Учеба',
    PERSONAL: 'Личное',
  },
  priority: {
    LOW: 'Низкий',
    MEDIUM: 'Средний',
    HIGH: 'Высокий',
  },
  status: {
    TODO: 'К выполнению',
    IN_PROGRESS: 'В процессе',
    DONE: 'Готово',
  },
}

export const useTranslations = () => {
  const tCategory = (key: string): string => {
    return (
      dictionaries.category[key as keyof typeof dictionaries.category] || key
    )
  }

  const tPriority = (key: string): string => {
    return (
      dictionaries.priority[key as keyof typeof dictionaries.priority] || key
    )
  }

  const tStatus = (key: string): string => {
    return dictionaries.status[key as keyof typeof dictionaries.status] || key
  }

  return { tCategory, tPriority, tStatus }
}
