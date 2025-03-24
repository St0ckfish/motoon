<SelectPrimitive.Item
    {value}
    {disabled}
    {label}
    class={cn(
        'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-[#e2e8f0] data-[highlighted]:text-black',
        className,
    )}
    {...rest}
    on:click
    on:keydown
    on:focusin
    on:focusout
    on:pointerleave
    on:pointermove
>
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
            <Check class="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
    </span>
    {#if children}{@render children()}{:else}
        {label || value}
    {/if}
</SelectPrimitive.Item>

<script>
import {Select as SelectPrimitive} from 'bits-ui'
import Check from 'lucide-svelte/icons/check'

import {cn} from '$lib/utils.js'

let {
    class: className = undefined,
    value,
    label = undefined,
    disabled = undefined,
    children,
    ...rest
} = $props()
</script>
