import { bind, wire } from 'hyperhtml/cjs'
import * as most from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import Table from './Table'
import FakeHeaders from './FakeHeaders'
import Style from './Style'
import data from './data.json'
import makeDraggable, { GRAB, DROP } from './drag'
import getDimensions from './dimensions'

const handleScrolling = dimensions => {
  const draggingClass = 'a11y-table__scroll-handle--dragging'

  const ratio = {
    x: dimensions.table.width / dimensions.scrollBar.horizontal.width,
    y: dimensions.table.height / dimensions.scrollBar.vertical.height
  }

  const handleDrag = scroller => ({ dragInfo, distance }) => {
    const el = dragInfo.target

    if (dragInfo.action === GRAB) {
      el.classList.add(draggingClass)
      return
    }

    if (dragInfo.action === DROP) {
      el.classList.remove(draggingClass)
      return
    }

    scroller(distance)
  }

  const horizontalContainer = document.querySelector('.a11y-table__container')
  const verticalContainer = document.querySelector('.a11y-table__table')
  const horizontalScrollbarHandle = document.querySelector(
    '.a11y-table__scrollbar--horizontal .a11y-table__scroll-handle'
  )
  const verticalScrollbarHandle = document.querySelector(
    '.a11y-table__scrollbar--vertical .a11y-table__scroll-handle'
  )

  const horizontalDragScroll = most.tap(
    handleDrag(distance => {
      horizontalContainer.scrollLeft = distance * ratio.x
    }),
    most.map(dragInfo => {
      const min = 0
      const max = dimensions.table.width - dimensions.scrollBar.horizontal.width

      if (!dragInfo.offset) {
        return { dragInfo, distance: horizontalContainer.scrollLeft }
      }

      const distance = dragInfo.x - dragInfo.offset.dx

      if (distance < min) {
        return { dragInfo, distance: min }
      } else if (distance > max) {
        return { dragInfo, distance: max }
      } else {
        return { dragInfo, distance }
      }
    }, makeDraggable(document.body, horizontalScrollbarHandle, ratio))
  )

  const verticalDragScroll = most.tap(
    handleDrag(distance => {
      verticalContainer.scrollTop = distance * ratio.y
    }),
    most.map(dragInfo => {
      const min = 0
      const max = dimensions.table.height - dimensions.scrollBar.vertical.height

      if (!dragInfo.offset) {
        return { dragInfo, distance: verticalContainer.scrollTop }
      }

      const distance = dragInfo.y - dragInfo.offset.dy

      if (distance < min) {
        return { dragInfo, distance: min }
      } else if (distance > max) {
        return { dragInfo, distance: max }
      } else {
        return { dragInfo, distance }
      }
    }, makeDraggable(document.body, verticalScrollbarHandle, ratio))
  )

  most.runEffects(
    most.merge(horizontalDragScroll, verticalDragScroll),
    newDefaultScheduler()
  )
}

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
        const dimensions = getDimensions({
          target: this._targetEl,
          columns: this._columns,
          data: this._data
        })

        const table = Table(
          { columns: this._columns, data: this._data },
          dimensions
        )

        const fakeHeaders = FakeHeaders(this._columns, dimensions)

        const fragment = wire()`
          ${Style(dimensions)}
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

        if (!this._mutationObserver) {
          this._mutationObserver = new window.MutationObserver(mutations => {
            mutations
              .filter(m => m.target === this._targetEl)
              .forEach(mutation => {
                handleScrolling(dimensions)
              })
          })

          this._mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
          })
        } else {
          this._mutationObserver.disconnect()
        }

        resolve(fragment)
      })

    bind(this._targetEl)`
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
