import { bind, wire } from 'hyperhtml/cjs'
import Table from './Table'
import FakeHeaders from './FakeHeaders'
import data from './data.json'

class A11yTable {
  constructor ({ targetEl, columns, data }, { shouldRender = true } = {}) {
    this._targetEl = targetEl
    this._columns = columns
    this._data = data

    this._scrollX = 0
    this._scrollingX = false
    this._scrollY = 0
    this._scrollingY = false

    this._shouldRender = this._shouldRender === undefined
      ? true
      : this._shouldRender

    this.render()
  }

  render () {
    const render = () =>
      new Promise((resolve, reject) => {
        const rect = this._targetEl.getBoundingClientRect()
        const rowDimensions = this.getRowDimensions()

        const dimensions = {
          height: rect.height,
          width: rect.width,
          table: {
            width: [...this._columns.values()].reduce(
              (memo, col) => memo + col.size,
              0
            ),
            height: rowDimensions.headerHeight +
              rowDimensions.rowHeight * data.length,
            header: {
              height: rowDimensions.headerHeight
            },
            row: {
              height: rowDimensions.rowHeight
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

        dimensions.scroller.horizontal.height =
          dimensions.scrollBar.horizontal.height
        dimensions.scroller.horizontal.width =
          dimensions.scrollBar.horizontal.width *
          (dimensions.scrollBar.horizontal.width / dimensions.table.width)

        dimensions.scroller.vertical.width = dimensions.scrollBar.vertical.width
        dimensions.scroller.vertical.height =
          dimensions.scrollBar.vertical.height *
          (dimensions.scrollBar.vertical.height / dimensions.table.height)

        const table = Table(
          { columns: this._columns, data: this._data },
          dimensions
        )

        const fakeHeaders = FakeHeaders(this._columns, dimensions)

        const fragment = wire()`
          <style>${{ text: `
            .a11y-table {
              display: flex;
              flex-wrap: wrap;
            }

            .a11y-table__container {
              overflow-x: scroll;
              height: ${dimensions.height - dimensions.scroller.size}px;
              width: ${dimensions.scrollBar.horizontal.width}px;
            }

            .a11y-table__container::-webkit-scrollbar {
              display: none;
            }

            .a11y-table__column-header {
              height: ${dimensions.table.header.height}px;
            }

            .a11y-table__table {
              overflow-y: scroll;
              overflow-x: hidden;
              flex: 0 0 auto;
              width: ${dimensions.table.width}px;
              height: ${dimensions.height - dimensions.scroller.size}px;
              margin-top: -${dimensions.table.header.height}px;
            }

            .a11y-table__table::-webkit-scrollbar {
              display: none;
            }

            .a11y-table__column-header,
            .a11y-table td {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              box-sizing: border-box;
            }

            .a11y-table__scrollbar {
              background-color: tomato;
              position: relative;
            }

            .a11y-table__scrollbar .a11y-table__scroll-handle {
              background-color: blue;
              position: relative;
            }

            .a11y-table__scrollbar.a11y-table__scrollbar--horizontal {
              height: ${dimensions.scrollBar.horizontal.height}px;
              width: ${dimensions.scrollBar.horizontal.width}px;
            }

            .a11y-table__scrollbar.a11y-table__scrollbar--horizontal .a11y-table__scroll-handle {
              height: ${dimensions.scroller.horizontal.height}px;
              width: ${dimensions.scroller.horizontal.width}px;
            }

            .a11y-table__scrollbar.a11y-table__scrollbar--vertical {
              height: ${dimensions.scrollBar.vertical.height}px;
              width: ${dimensions.scrollBar.vertical.width}px;
            }

            .a11y-table__scrollbar.a11y-table__scrollbar--vertical .a11y-table__scroll-handle {
              height: ${dimensions.scroller.vertical.height}px;
              width: ${dimensions.scroller.vertical.width}px;
            }
            ` }}
          </style>
          <div class='a11y-table__container' onscroll=${this.onHorizontalScroll.bind(this)(dimensions)}>
            ${fakeHeaders}
            <div class='a11y-table__table' onscroll=${this.onVerticalScroll.bind(this)(dimensions)}>
              ${table}
            </div>
          </div>
          <div class='a11y-table__scrollbar a11y-table__scrollbar--vertical'>
            <div class='a11y-table__scroll-handle'></div>
          </div>
          <div class='a11y-table__scrollbar a11y-table__scrollbar--horizontal'>
            <div class='a11y-table__scroll-handle'></div>
          </div>
        `

        resolve(fragment)
      })

    bind(this._targetEl)`
    <style>
      .a11y-table {
        overflow-x: hidden;
        width: inherit;
        height: inherit;
      }
    </style>
    <div class='a11y-table'>
      ${{ any: render(), placeholder: 'Loading...' }}
    </div>
    `
  }

  onHorizontalScroll (dimensions) {
    return event => {
      this._scrollX = event.target.scrollLeft
      this.requestHorizontalScrollUpdate(dimensions)
    }
  }

  onVerticalScroll (dimensions) {
    return event => {
      this._scrollY = event.target.scrollTop
      this.requestVerticalScrollUpdate(dimensions)
    }
  }

  requestHorizontalScrollUpdate (dimensions) {
    if (!this._scrollingX) {
      window.requestAnimationFrame(
        this.updateHorizontalScroll.bind(this)(dimensions)
      )
    }

    this._scrollingX = true
  }

  requestVerticalScrollUpdate (dimensions) {
    if (!this._scrollingY) {
      window.requestAnimationFrame(
        this.updateVerticalScroll.bind(this)(dimensions)
      )
    }

    this._scrollingY = true
  }

  updateHorizontalScroll (dimensions) {
    const scrollerX = document.querySelector(
      '.a11y-table__scrollbar--horizontal .a11y-table__scroll-handle'
    )

    return () => {
      this._scrollingX = false

      const currentPos = this._scrollX
      const ratio = currentPos / dimensions.table.width
      const leftOffset = dimensions.scrollBar.horizontal.width * ratio

      scrollerX.style.left = `${leftOffset}px`
    }
  }

  updateVerticalScroll (dimensions) {
    const scrollerY = document.querySelector(
      '.a11y-table__scrollbar--vertical .a11y-table__scroll-handle'
    )

    return () => {
      this._scrollingY = false

      const currentPos = this._scrollY
      const ratio = currentPos / dimensions.table.height
      const topOffset = dimensions.scrollBar.vertical.height * ratio

      scrollerY.style.top = `${topOffset}px`
    }
  }

  getRowDimensions () {
    const el = document.createElement('div')
    const dimensions = {}

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

    dimensions.headerHeight = testHeaderRow.getBoundingClientRect().height
    dimensions.rowHeight = testBodyRow.getBoundingClientRect().height

    document.body.removeChild(el)

    return dimensions
  }

  set data (newData) {
    this._data = newData

    this.render()

    return this
  }
}

export default (...args) => new A11yTable(...args)

// -------------------------------------------------------------------- userland
const columns = new Map()

columns.set('id', { label: 'Document ID', size: 50 })

columns.set('grantor', {
  label: 'Grantor',
  format: v => ({ html: v[0] }),
  size: 150
})

columns.set('grantee', {
  label: 'Grantee',
  format: v => ({ html: v[0] }),
  size: 150
})

columns.set('docType', { label: 'Doc Type', size: 150 })
columns.set('recordedDate', { label: 'Recorded Date', size: 150 })
columns.set('instrumentDate', { label: 'Instrument Date', size: 150 })
columns.set('documentNumber', { label: 'Doc Number', size: 150 })

columns.set('legalDescription', {
  label: 'Legal Description',
  format: v => (v ? { html: v[0] } : v),
  size: 150
})

columns.set('selected', { label: 'selected', size: 50 })
columns.set('inCart', { label: 'in cart', size: 50 })
columns.set('viewed', { label: 'viewed', size: 50 })

window.myTable = new A11yTable({
  targetEl: document.getElementById('container'),
  columns,
  data
})
