import { wire } from 'hyperhtml/cjs'

function Column (info) {
  return wire(info)`
  <th class='a11y-table__column-header'>
    ${info.label}
  </th>
  `
}

export default columns => {
  return wire(columns)`
  <thead>
    <tr>
      ${[...columns].map(([name, config]) => Column(config))}
    </tr>
  </thead>
  `
}
