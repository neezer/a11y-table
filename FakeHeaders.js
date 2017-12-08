import { wire } from 'hyperhtml/cjs'

function Column (info) {
  const style = { flex: `0 0 ${info.size}px` }

  return wire(info)`
  <li class='a11y-table__column-header a11y-table__column-header--fake' style=${style}>
    ${info.label}
  </li>
  `
}

export default (columns, dimensions) => {
  return wire(columns)`
  <ul aria-hidden='true' class='a11y-table__column-headers a11y-table__column-headers--fake'>
    ${[...columns].map(([name, config]) => Column(config))}
  </ul>
  `
}
