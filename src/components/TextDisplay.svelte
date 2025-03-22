<div
    id="text"
    bind:this={text_container_el}
    class="relative mb-6 min-h-64 rounded-lg bg-[#fefdfb] p-6 shadow-md transition-opacity duration-250"
>
    <div
        id="part-progress"
        bind:this={part_progress_el}
        class="absolute top-0 right-0 h-0.5 w-0 max-w-full bg-gradient-to-l from-[#eee] to-[#cacaca] transition-all duration-500"
    ></div>
    <div id="tpl-cont" bind:this={tpl_cont_el} class="text-center"></div>
</div>

<script>
import {onMount} from 'svelte'

let text_container_el
let tpl_cont_el
let part_progress_el

// نصدر هذه المتغيرات لتكون متاحة للمكون الأب
export {text_container_el, tpl_cont_el, part_progress_el}

onMount(() => {
    console.log('TextDisplay mounted')
    console.log('text_container_el:', text_container_el)
    console.log('tpl_cont_el:', tpl_cont_el)
    console.log('part_progress_el:', part_progress_el)
})
</script>

<style>
#text {
    opacity: 1;
}

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