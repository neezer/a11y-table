import * as most from '@most/core'
import * as mostDOM from '@most/dom-event'

export const DROP = 0
export const GRAB = 1
export const DRAG = 2

const preventDefault = e => e.preventDefault()

const eventToDragInfo = (action, target, e, dragOffset) => ({
  action: action,
  target: target,
  x: e.clientX,
  y: e.clientY,
  offset: dragOffset
})

const beginDrag = (area, draggable, ratio) => e => {
  const dragOffset = {
    dx: e.clientX - draggable.offsetLeft, // * ratio.x,
    dy: e.clientY - draggable.offsetTop // * ratio.y
  }

  const mousemoves = mostDOM.mousemove(area)
  const mouseleaves = mostDOM.mouseleave(area)
  const dragInfos = most.map(
    e => eventToDragInfo(DRAG, draggable, e, dragOffset),
    most.until(mouseleaves, mousemoves)
  )

  return most.startWith(eventToDragInfo(GRAB, draggable, e), dragInfos)
}

const endDrag = draggable => e =>
  most.at(0, eventToDragInfo(DROP, draggable, e))

export default (area, draggable, ratio) => {
  const mousedowns = most.tap(preventDefault, mostDOM.mousedown(draggable))
  const mouseups = mostDOM.mouseup(area)
  const drag = most.map(beginDrag(area, draggable, ratio), mousedowns)
  const drop = most.map(endDrag(draggable), mouseups)

  return most.switchLatest(most.merge(drag, drop))
}
