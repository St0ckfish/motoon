<div
    id="text"
    class="relative mb-6 min-h-64 rounded-lg bg-[#fefdfb] p-6 shadow-md transition-opacity duration-250"
    style="opacity: {opacity};"
>
    <div
        id="part-progress"
        bind:this={part_progress_el}
        class="absolute top-0 right-0 h-0.5 w-0 max-w-full bg-gradient-to-l from-[#eee] to-[#cacaca] transition-all duration-500"
    ></div>
    <div id="tpl-cont" class="text-center">
        {#if content.type === 'title'}
            <div class="title">{@html content.title}</div>
            <div class="desc">{@html content.desc}</div>
        {:else if content.type === 'bayt'}
            <div class="matn">
                <div
                    id="part-no"
                    style="font-size: 2rem;"
                    class="-translate-y-7 [text-shadow:_0_4px_4px_rgb(0_0_0_/_0.5)]"
                >
                    {content.part_number}
                </div>
                <div class="first">{content.first}</div>
                <div class="second">{content.second}</div>
            </div>
            <div class="sharh">{content.sharh}</div>
        {/if}
    </div>
</div>

<script>
let {part_progress_el = $bindable()} = $props()

let content = $state({
    type: 'title',
    title: '',
    desc: '',
    first: '',
    second: '',
    sharh: '',
    part_number: '',
})

let opacity = $state(1)

function ar_nums(s) {
    if (s === undefined || s === null) return ''
    return ('' + s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'.charAt(+d))
}

export function set_title_content(title, desc) {
    content = {
        type: 'title',
        title: title || '',
        desc: desc || '',
        first: '',
        second: '',
        sharh: '',
        part_number: '',
    }
}

export function set_bayt_content(parts, sharh, part_number) {
    let first = ''
    let second = ''

    if (Array.isArray(parts)) {
        if (parts.length === 1) {
            if (parts[0].includes('،')) {
                const split_parts = parts[0].split('،')
                if (split_parts.length >= 2) {
                    first = split_parts[0] + '،'
                    second = split_parts.slice(1).join('،')
                } else {
                    first = parts[0]
                    second = parts[0]
                }
            } else {
                first = parts[0]
                second = parts[0]
            }
        } else {
            first = parts[0] || ''
            second = parts[1] || ''
        }
    } else if (parts) {
        if (parts.includes('=')) {
            const split_parts = parts.split('=')
            first = split_parts[0] || ''
            second = split_parts[1] || ''
        } else if (parts.includes('،') || parts.includes('؛')) {
            const split_char = parts.includes('،') ? '،' : '؛'
            const split_index = parts.indexOf(split_char)

            if (split_index > 0) {
                first = parts.substring(0, split_index + 1)
                second = parts.substring(split_index + 1)
            } else {
                first = parts
                second = ''
            }
        } else {
            first = parts
            second = ''
        }
    }

    content = {
        type: 'bayt',
        title: '',
        desc: '',
        first,
        second,
        sharh: sharh || '',
        part_number: ar_nums(part_number || ''),
    }
}

export function set_opacity(value) {
    opacity = value
}
</script>

<style>
:global(.title) {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
}

:global(.desc) {
    font-size: 1.2rem;
    text-align: center;
}

:global(.matn) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
}

:global(#part-no) {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 1rem;
    color: #555;
}

:global(.first),
:global(.second) {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    text-align: center;
}

:global(.sharh) {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-top: 1rem;
    white-space: pre-line;
}
</style>
