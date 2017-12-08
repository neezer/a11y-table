import { wire } from 'hyperhtml/cjs'
import ColGroup from './ColGroup'
import Header from './Header'
import Body from './Body'

export default (details, dimensions) => {
  const style = {
    width: `${dimensions.width}px`,
    'table-layout': 'fixed',
    'border-collapse': 'collapse'
  }

  return wire(details)`
  <table style=${style}>
    ${ColGroup(details.columns)}
    ${Header(details.columns)}
    ${Body(details)}
  </table>
  `
}
