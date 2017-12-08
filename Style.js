import { wire } from 'hyperhtml/cjs'

export default dimensions => {
  const horizontalScrollMaxed =
    dimensions.scrollBar.horizontal.width ===
    dimensions.scroller.horizontal.width

  const verticalScrollMaxed =
    dimensions.scrollBar.vertical.height === dimensions.scroller.vertical.height

  return wire(dimensions)`
  <style>${{ text: `
    .a11y-table {
      overflow: hidden;
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      display: flex;
      flex-wrap: wrap;
    }

    .a11y-table__container {
      overflow-x: scroll;
      height: ${dimensions.height - (horizontalScrollMaxed ? 0 : dimensions.scroller.size)}px;
      width: ${dimensions.scrollBar.horizontal.width}px;
      padding-bottom: 40px;
      margin-bottom: -40px;
    }

    .a11y-table__column-header {
      height: ${dimensions.table.header.height}px;
    }

    .a11y-table__table-wrapper {
      width: ${dimensions.table.width}px;
      overflow: hidden;
    }

    .a11y-table__table {
      overflow-y: scroll;
      overflow-x: hidden;
      width: ${dimensions.table.width}px;
      height: ${dimensions.height - (horizontalScrollMaxed ? 0 : dimensions.scroller.size)}px;
      margin-top: -${dimensions.table.header.height}px;
      padding-right: 40px;
    }

    .a11y-table__column-headers.a11y-table__column-headers--fake {
      list-style: none;
      padding: 0;
      margin: 0;
      width: ${dimensions.table.width}px;
      white-space: nowrap;
      display: flex;
      background-color: white;
      z-index: 10;
      position: relative;
    }

    .a11y-table__column-header.a11y-table__column-header--fake {
      display: inline-block;
    }

    .a11y-table__column-header,
    .a11y-table td {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
    }

    .a11y-table__scrollbar {
      background-color: #ddd;
      position: relative;
    }

    .a11y-table__scrollbar .a11y-table__scroll-handle {
      background-color: #9be;
      position: relative;
      cursor: grab;
    }

    .a11y-table__scroll-handle--dragging,
    .a11y-table__scrollbar .a11y-table__scroll-handle--dragging {
      cursor: grabbing;
    }

    .a11y-table__scrollbar.a11y-table__scrollbar--horizontal {
      height: ${dimensions.scrollBar.horizontal.height}px;
      width: ${dimensions.scrollBar.horizontal.width}px;
      ${horizontalScrollMaxed ? 'display: none;' : null}
    }

    .a11y-table__scrollbar.a11y-table__scrollbar--horizontal .a11y-table__scroll-handle {
      height: ${dimensions.scroller.horizontal.height}px;
      width: ${dimensions.scroller.horizontal.width}px;
    }

    .a11y-table__scrollbar.a11y-table__scrollbar--vertical {
      height: ${dimensions.scrollBar.vertical.height}px;
      width: ${dimensions.scrollBar.vertical.width}px;
      ${verticalScrollMaxed ? 'display: none;' : null}
    }

    .a11y-table__scrollbar.a11y-table__scrollbar--vertical .a11y-table__scroll-handle {
      height: ${dimensions.scroller.vertical.height}px;
      width: ${dimensions.scroller.vertical.width}px;
    }
    ` }}
  </style>
  `
}
