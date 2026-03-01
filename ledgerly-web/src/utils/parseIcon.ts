import type { IconProp } from '@fortawesome/fontawesome-svg-core'

export function parseIcon(icon: string): IconProp {
    const parts = icon.split(' ')
    const prefix = parts[0] === 'fa-solid' ? 'fas' : 'far'
    const name = parts[1].replace('fa-', '')
    return [prefix, name as never]
}
