<div class="relative mx-auto mb-6 max-w-10/12">
    <Select selected={current_value} onSelectedChange={handle_change}>
        <SelectTrigger class="w-full rounded border border-gray-300 text-lg">
            {#if current_value.value}
                <span>{current_value.value}</span>
            {:else}
                <span>اختر المتن</span>
            {/if}
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={5} class="z-50 max-h-72 overflow-y-auto">
            {#each mutoon as group, i}
                <SelectGroup>
                    <SelectLabel class="px-2 py-1 text-sm font-medium text-gray-500"
                        >{group.label}</SelectLabel
                    >
                    {#each group.items as item}
                        <SelectItem value={item}>{item}</SelectItem>
                    {/each}
                </SelectGroup>
                {#if i < mutoon.length - 1}
                    <SelectSeparator class="my-1 h-px bg-gray-200" />
                {/if}
            {/each}
        </SelectContent>
    </Select>
</div>

<script>
import {onMount} from 'svelte'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
} from '../lib/components/ui/select'
import {mutoon} from '../lib/data/mutoon.js'

const {change} = $props()
let current_value = $state({value: 'الأرجوزة الميئية'})

function create_change_event(value) {
    const string_value = value?.value || value?.toString?.() || value

    return {
        target: {
            value: string_value,
            selectedIndex: 0,
            options: [{text: string_value, value: string_value}],
        },
        detail: {
            target: {
                value: string_value,
                selectedIndex: 0,
                options: [{text: string_value, value: string_value}],
            },
        },
    }
}

onMount(() => {
    const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ')

    if (hash && hash.trim() !== '') {
        current_value = {value: hash}
        handle_change(hash)
    } else {
        handle_change('الأرجوزة الميئية')
    }
})

function handle_change(value) {
    if (!value) return

    const string_value = value?.value || value?.toString?.() || value

    if (string_value === current_value.value && !change) return

    current_value = {value: string_value}

    if (change) {
        const evt = create_change_event(string_value)
        change(evt)

        setTimeout(() => {
            window.history.pushState(null, '', '#' + string_value.replace(/\s+/g, '-'))
        }, 100)
    }
}
</script>
