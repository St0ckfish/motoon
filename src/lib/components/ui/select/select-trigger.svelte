<SelectPrimitive.Trigger
    bind:ref
    class={cn(
        'focus:shadow-outline ring-offset-background data-[placeholder]:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border border-[#e1e3e6] bg-white px-3 py-2 text-sm shadow hover:border-[#bfc0c0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className,
    )}
    {...restProps}
>
    {@render children?.()}
    <ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>

<script>
import ChevronDown from '@lucide/svelte/icons/chevron-down'
import {Select as SelectPrimitive} from 'bits-ui'

import {cn} from '$lib/utils.js'

let {ref = $bindable(null), class: className, children, ...restProps} = $props()
</script>
