export const TABLE_GRID = '40px minmax(0, 1fr) 120px 110px 150px 100px 160px 120px 40px'

export const TABLE_COLUMNS = ['chevron', 'project', 'empresa', 'status', 'responsible', 'priority', 'date', 'progress', 'actions'] as const

export type TableColumn = typeof TABLE_COLUMNS[number]
