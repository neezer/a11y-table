import { bind, wire } from 'hyperhtml/cjs'
import * as most from '@most/core'
import * as mostDOM from '@most/dom-event'
import { newDefaultScheduler } from '@most/scheduler'
import makeDraggable, { GRAB, DROP } from './drag'

const target = document.getElementById('sidebar')
const dimensions = target.getBoundingClientRect()

const sections = {
  docTypes: [
    'WARRANTY DEED',
    'RELEASE',
    'BILL OF SALE',
    'POWER OF ATTORNEY',
    "SHERIFF'S DEED",
    'ASSUMED NAME',
    'DEED OF TRUST',
    'RELEASE',
    'MINERAL DEED',
    'HOSPITAL LIEN'
  ],
  grantor: [
    'JOHN TOM',
    'SMITH MELBA',
    'JNGDIRECT',
    'CURTIS GARY',
    'U S ARMY',
    'JF & W DESIGN',
    'REYES ALICE'
  ],
  grantee: [
    'RIPLEY JOHN',
    'LYDAY JOHN',
    'GIPSON JOHN',
    'FLOYD JOHN',
    'ROMAN JOHN',
    'GAMBLE JOHN'
  ]
}

const section = type => wire()`
<section class='sidebar__section'>
  <h2>${type}</h2>
  <div class='sidebar__section-contents'>
    ${sections[type].map(datum => wire()`
    <p>${datum}</p>
    `)}
  </div>
</section>
`

bind(target)`
<div class='sidebar__sections'>
  ${Object.keys(sections).map(type => section(type))}
</div>
<div class='sidebar__scroll-bar'>
  <div class='sidebar__scroll-handle'></div>
</div>
`
