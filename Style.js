import { wire } from 'hyperhtml/cjs'

export default dimensions => {
  return wire(dimensions)`
  <style>${{ text: `
    .a11y-table {
      overflow-x: hidden;
      width: inherit;
      height: inherit;
    }

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
      cursor: -webkit-grab;
    }

    .a11y-table__scrollbar .a11y-table__scroll-handle--dragging {
      cursor: -webkit-grabbing;
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
  `
}
