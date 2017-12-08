import { bind } from 'hyperhtml/cjs'

const getSampledDimensions = () => {
  const el = document.createElement('div')
  const dimensions = {
    header: {},
    row: {}
  }

  el.style.width = '1px'
  el.style.height = '1px'
  el.style.overflow = 'hidden'
  el.style.position = 'absolute'
  el.style.left = '-10000px'
  el.style.visibility = 'hidden'

  document.body.appendChild(el)

  bind(el)`
  <table class='a11y-table'>
    <thead>
      <tr id='a11y-table__test-header-row'>
        <th class='a11y-table__column-header'>testing</th>
      </tr>
    </thead>
    <tbody>
      <tr id='a11y-table__test-body-row'>
        <td class=''>testing</td>
      </tr>
    </tbody>
  </table>
  `

  const testHeaderRow = document.getElementById('a11y-table__test-header-row')
  const testBodyRow = document.getElementById('a11y-table__test-body-row')

  dimensions.header.height = testHeaderRow.getBoundingClientRect().height
  dimensions.row.height = testBodyRow.getBoundingClientRect().height

  document.body.removeChild(el)

  return dimensions
}

export default ({ target, columns, data }) => {
  const existingTable = target.querySelector('.a11y-table')

  if (existingTable) {
    existingTable.style.display = 'none'
  }

  const rect = target.getBoundingClientRect()

  if (existingTable) {
    existingTable.style.display = 'flex'
  }

  const sampledDimensions = getSampledDimensions()

  const dimensions = {
    height: rect.height,
    width: rect.width,
    table: {
      width: [...columns.values()].reduce((memo, col) => memo + col.size, 0),
      height: sampledDimensions.header.height +
        sampledDimensions.row.height * data.length,
      header: {
        height: sampledDimensions.header.height
      },
      row: {
        height: sampledDimensions.row.height
      }
    },
    scrollBar: {
      horizontal: {},
      vertical: {}
    },
    scroller: {
      size: 20, // TODO detect!
      horizontal: {},
      vertical: {}
    }
  }

  dimensions.scrollBar.horizontal.width =
    dimensions.width - dimensions.scroller.size
  dimensions.scrollBar.horizontal.height = dimensions.scroller.size
  dimensions.scrollBar.vertical.width = dimensions.scroller.size
  dimensions.scrollBar.vertical.height =
    dimensions.height - dimensions.scroller.size

  dimensions.scroller.horizontal.height = dimensions.scrollBar.horizontal.height
  dimensions.scroller.horizontal.width = Math.min(
    dimensions.scrollBar.horizontal.width *
      (dimensions.scrollBar.horizontal.width / dimensions.table.width),
    dimensions.scrollBar.horizontal.width
  )

  dimensions.scroller.vertical.width = dimensions.scrollBar.vertical.width
  dimensions.scroller.vertical.height = Math.min(
    dimensions.scrollBar.vertical.height *
      (dimensions.scrollBar.vertical.height / dimensions.table.height),
    dimensions.scrollBar.vertical.height
  )

  if (
    dimensions.scrollBar.horizontal.width ===
    dimensions.scroller.horizontal.width
  ) {
    dimensions.scrollBar.vertical.height = dimensions.height
    dimensions.scroller.vertical.height = Math.min(
      dimensions.scrollBar.vertical.height *
        (dimensions.scrollBar.vertical.height / dimensions.table.height),
      dimensions.scrollBar.vertical.height
    )
  }

  if (
    dimensions.scrollBar.vertical.height === dimensions.scroller.vertical.height
  ) {
    dimensions.scrollBar.horizontal.width = dimensions.width
    dimensions.scroller.horizontal.width = Math.min(
      dimensions.scrollBar.horizontal.width *
        (dimensions.scrollBar.horizontal.width / dimensions.table.width),
      dimensions.scrollBar.horizontal.width
    )
  }

  return dimensions
}
