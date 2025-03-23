// @ts-nocheck
import {clsx} from 'clsx'
import {fly} from 'svelte/transition'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const flyAndScale = (node, options) => {
    const defaults = {y: 5, duration: 150}
    const opts = {...defaults, ...options}

    return {
        ...fly(node, opts),
        css: t => {
            const scale = 0.95 + 0.05 * t
            const opacity = t
            return `
                transform: scale(${scale});
                opacity: ${opacity};
            `
        },
    }
}
