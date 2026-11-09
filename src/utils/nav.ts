export type ViewId = 'solo' | 'card' | 'duo'

const bus = new EventTarget()

export function onRouteChange(handler: () => void): () => void {
  const listener = () => handler()
  window.addEventListener('popstate', listener)
  bus.addEventListener('route', listener)
  return () => {
    window.removeEventListener('popstate', listener)
    bus.removeEventListener('route', listener)
  }
}

export function openView(view: ViewId, params?: Record<string, string>): void {
  const query = new URLSearchParams(params ?? {})
  if (view !== 'duo') query.set('view', view)
  const search = query.toString()
  const next = search ? `${location.pathname}?${search}` : location.pathname
  history.pushState({ view }, '', next)
  bus.dispatchEvent(new Event('route'))
}

export function openDuo(input: { sender: string; friend: string; rel: string; tag: string }): void {
  openView('duo', {
    sender: input.sender,
    friend: input.friend,
    rel: input.rel,
    tag: input.tag,
  })
}

export interface ParsedRoute {
  view: ViewId
  sender: string
  friend: string
  rel: string
  tag: string
  hasFriend: boolean
  hasRel: boolean
  hasTag: boolean
  hasSender: boolean
}

export function parseRoute(search: string): ParsedRoute {
  const query = new URLSearchParams(search)
  const friend = query.get('friend') || ''
  const viewParam = query.get('view')
  let view: ViewId = 'solo'
  if (friend || viewParam === 'duo') view = 'duo'
  else if (viewParam === 'card') view = 'card'
  return {
    view,
    sender: query.get('sender') || '我',
    friend,
    rel: query.get('rel') || '搞钱战友局',
    tag: query.get('tag') || '嘴硬心软',
    hasFriend: query.has('friend'),
    hasRel: query.has('rel'),
    hasTag: query.has('tag'),
    hasSender: query.has('sender'),
  }
}
