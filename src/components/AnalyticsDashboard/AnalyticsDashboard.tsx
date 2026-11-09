import { Component, For, Show } from 'solid-js'
import { MonthlyAnalytics } from '@/api/analytics'
import { TaskCategory } from '@/constants/task'
import styles from './AnalyticsDashboard.module.scss'

interface AnalyticsDashboardProps {
  data: MonthlyAnalytics | null
  loading: boolean
  error: string | null
  onRetry: () => void
}

const categoryLabels: Record<string, string> = {
  [TaskCategory.WORK]: 'Работа',
  [TaskCategory.PROF]: 'Актив',
  [TaskCategory.STUDY]: 'Учёба',
  [TaskCategory.PERSONAL]: 'Личное',
}

const formatMonth = (year: number, month: number) =>
  new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1),
  )

const BurndownChart: Component<{
  title: string
  points: MonthlyAnalytics['burndown']
}> = (props) => {
  const maximum = () =>
    Math.max(
      5,
      Math.ceil(
        Math.max(0, ...props.points.map((point) => point.remaining_count)) * 1.2,
      ),
    )

  return (
    <section class={styles.chartCard}>
      <h3>{props.title}</h3>
      <div
        class={styles.chartWrapper}
        role="img"
        aria-label={`${props.title}: остаток задач по дням; максимум ${maximum()}`}
      >
        <div class={styles.yAxis} aria-hidden="true">
          <span>{maximum()}</span>
          <span>0</span>
        </div>
        <div class={styles.chart}>
          <For each={props.points}>
            {(point) => (
              <div
                class={styles.barColumn}
                title={`${point.date}: осталось ${point.remaining_count}`}
              >
                <span
                  class={styles.bar}
                  style={{
                    height: `${(point.remaining_count / maximum()) * 100}%`,
                  }}
                />
              </div>
            )}
          </For>
        </div>
      </div>
      <div class={styles.chartLegend}>
        <span>Остаток задач по дням месяца</span>
        <span>{props.points.length} дней</span>
      </div>
    </section>
  )
}

export const AnalyticsDashboard: Component<AnalyticsDashboardProps> = (props) => (
  <section class={styles.dashboard}>
    <Show when={props.loading}>
      <p class={styles.message} role="status">Загружаем статистику…</p>
    </Show>
    <Show when={props.error}>
      <div class={styles.error} role="alert">
        <p>{props.error}</p>
        <button type="button" onClick={props.onRetry}>Повторить</button>
      </div>
    </Show>
    <Show when={!props.loading && !props.error && props.data}>
      {(data) => (
        <>
          <h2 class={styles.heading}>
            Статистика за {formatMonth(data().year, data().month)}
          </h2>
          <div class={styles.metrics}>
            <article class={styles.metric}>
              <span>Выполнено</span>
              <strong>{data().completed_count}</strong>
            </article>
            <article class={styles.metric}>
              <span>В срок</span>
              <strong>{data().on_time_rate_percent}%</strong>
              <small>
                {data().on_time_completed_count} из{' '}
                {data().completed_with_deadline_count} с дедлайном
              </small>
            </article>
            <article class={styles.metric}>
              <span>Просрочено</span>
              <strong>{data().overdue_count}</strong>
            </article>
          </div>

          <section class={styles.chartCard}>
            <h3>Распределение задач по категориям</h3>
            <Show
              when={data().category_workload.length > 0}
              fallback={<p class={styles.empty}>В этом месяце задач пока нет.</p>}
            >
              <div class={styles.categories}>
                <For each={data().category_workload}>
                  {(category) => (
                    <div class={styles.categoryRow}>
                      <span>{categoryLabels[category.category] || category.category}</span>
                      <strong>{category.task_count}</strong>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </section>

          <BurndownChart title="Мои задачи" points={data().burndown} />
          <For each={data().team_burndown}>
            {(team) => (
              <BurndownChart
                title={team.chat_title || `Группа ${team.chat_id}`}
                points={team.points}
              />
            )}
          </For>
        </>
      )}
    </Show>
  </section>
)
