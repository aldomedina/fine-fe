import cn from 'classnames'

import { objectValues } from '../../utils'
import style from './style.module.scss'

export type Cell = {
  [key: string]: string | number | React.ReactNode
}

interface SimpleTableProps {
  rows: Cell[]
  maxWidth?: boolean
  white?: boolean
}
const SimpleTable = ({ rows, maxWidth, white }: SimpleTableProps) => {
  return (
    <table className={cn(style.simpleTable, { [style.maxWidth]: maxWidth, [style.white]: white })}>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`row-${i}`} className={style.row}>
            {objectValues(row).map((cell, ci) => (
              <td key={`cell-${i}-${ci}`} className={style.cell}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default SimpleTable
