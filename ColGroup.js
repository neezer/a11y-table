import { wire } from 'hyperhtml/cjs'

export default columns => {
  const sizes = [...columns.values()].map(column => column.size)

  return wire()`
  <colgroup>
    ${sizes.map(size => wire()`
    <col style=${{ width: `${size}px` }} />
    `)}
  </colgroup>
  `
}
