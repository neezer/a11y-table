import { wire } from 'hyperhtml/cjs'

function Row (data, columns) {
  const columnNames = [...columns.keys()]
  const getFormat = i => columns.get(columnNames[i]).format || (v => v)

  return wire({ data })`
  ${data.map((datum, i) => wire()`
  <td>
    ${getFormat(i)(datum)}
  </td>
  `)}`
}

export default details => {
  return wire(details)`
  <tbody>
    ${details.data.map((datum, i) => wire(datum)`
    <tr>
      ${Row(datum, details.columns)}
    </tr>
    `)}
  </tbody>
  `
}
