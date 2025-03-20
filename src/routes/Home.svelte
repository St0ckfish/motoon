<main class="rtl container mx-auto max-w-4xl px-4 py-6">
    <h1
        class="mb-6 text-center text-3xl font-bold"
        style="font-family: 'Aref Ruqaa'; margin: 0.4rem 0; text-shadow: 2px 1px #bbb;"
    >
        مُقرِئ المتون
    </h1>

    <MatnSelector on:change={handle_matn_change} />

    <TextDisplay bind:text_container_el bind:tpl_cont_el bind:part_progress_el />

    <PlayerControls
        bind:audio
        bind:part_start_input
        bind:part_end_input
        {save_settings}
        {settings}
    />

    <Footer />
</main>

<script>
// @ts-nocheck
import {onDestroy, onMount} from 'svelte'

import Footer from '../components/Footer.svelte'
import MatnSelector from '../components/MatnSelector.svelte'
import PlayerControls from '../components/PlayerControls.svelte'
import TextDisplay from '../components/TextDisplay.svelte'

let state = $state({
    all_reps: 1,
    part_reps: 1,
    cur: 0,
    segs: [],
    title: [],
})

let settings = $state(JSON.parse(localStorage.getItem('settings') || '{}'))

let audio
let clicker

let part_start_input
let part_end_input
let part_progress_el
let text_container_el
let tpl_cont_el

onMount(() => {
    clicker = new Audio(`${window.location.origin}/click.mp3`);
    fetch(clickSoundPath)
        .then(response => {
            if (response.ok) {
                clicker = new Audio(clickSoundPath);
            } else {
                console.log('ملف الصوت غير موجود، تم تعطيل صوت النقر');
                clicker = { play: () => {} }; // كائن وهمي به دالة play فارغة
            }
        })
        .catch(error => {
            console.error('خطأ في تحميل ملف الصوت:', error);
            clicker = { play: () => {} };
        });

    const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ')

    const initial_matn = document.querySelector('#matn-select')
    if (initial_matn) {
        if (
            hash &&
            Array.from(initial_matn.options)
                .map(o => o.value)
                .includes(hash)
        ) {
            initial_matn.value = hash
        }
        if (initial_matn.selectedOptions && initial_matn.selectedOptions.length > 0) {
            load_matn(initial_matn.selectedOptions[0].text, initial_matn.value)
        }
    }

    document.addEventListener('timeupdate', e => {
        if (e.detail) {
            handle_time_update(e.detail)
        }
    })
})

onDestroy(() => {
    if (audio) {
        audio.pause()
    }
    document.removeEventListener('timeupdate', handle_time_update)
})

function save_settings(id, value) {
    const element = document.querySelector(`#${id}`)
    if (!element || !element.validity.valid) return

    settings = {...settings, [id]: value}
    // localStorage.setItem('settings', JSON.stringify(settings));
}

async function load_matn(matn_name, matn_id) {
    if (!part_start_input) part_start_input = document.querySelector('#part-start')
    if (!part_end_input) part_end_input = document.querySelector('#part-end')

    try {
        const response = await fetch(`/data/${matn_id}.txt`, {cache: 'no-cache'})
        const text = await response.text()

        if (!text || text.trim() === '') {
            return
        }

        const lines = text.split('\n')

        if (lines.length < 2) {
            return
        }

        const audio_url = lines[0].trim()

        const segments = []
        let current_title = matn_name
        let current_description = ''

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()

            if (line.startsWith('# ')) {
                const parts = line.substring(2).split(' ', 1)
                const timing = parseFloat(parts[0])

                if (!isNaN(timing)) {
                    const text = lines[i + 1] ? lines[i + 1].trim() : ''
                    let description = ''

                    let j = i + 2
                    while (j < lines.length && !lines[j].trim().startsWith('# ')) {
                        if (lines[j].trim() !== 'CONT') {
                            description += lines[j] + '\n'
                        }
                        j++
                    }

                    segments.push({
                        timing: timing,
                        text: text,
                        description: description.trim(),
                    })

                    if (timing === 0) {
                        current_title = text
                        current_description = description.trim()
                    }

                    i = j - 1
                }
            }
        }

        if (segments.length === 0) {
            return
        }

        const old_playback_rate = audio ? audio.playbackRate : 1

        if (!audio) {
            audio = document.querySelector('audio')
            if (!audio) {
                return
            }
        }

        audio.src = audio_url
        audio.playbackRate = old_playback_rate

        state.title = current_title
        state.segs = segments.map(seg => {
            let text = seg.text
            if (text && !text.includes('=') && (text.includes('،') || text.includes('؛'))) {
                const split_char = text.includes('،') ? '،' : '؛'
                const idx = text.indexOf(split_char)
                if (idx > 0) {
                    text = text.substring(0, idx + 1) + '=' + text.substring(idx + 1)
                }
            }
            return [seg.timing, text, seg.description]
        })

        location.hash = matn_id.replaceAll(' ', '-')
        document.title = `${matn_name} | مقرئ المتون`

        if (part_start_input && part_end_input) {
            part_start_input.value = 1
            const max_value = state.segs.length
            part_end_input.value = max_value
            part_start_input.max = max_value
            part_end_input.max = max_value

            reset_state()
        } else {
            setTimeout(() => {
                part_start_input = document.querySelector('#part-start')
                part_end_input = document.querySelector('#part-end')

                if (part_start_input && part_end_input) {
                    part_start_input.value = 1
                    const max_value = state.segs.length
                    part_end_input.value = max_value
                    part_start_input.max = max_value
                    part_end_input.max = max_value
                    reset_state()
                }
            }, 500)
        }
    } catch (error) {
        if (tpl_cont_el) {
            tpl_cont_el.innerHTML = render_title(
                'خطأ في تحميل المتن',
                'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى',
            )
        }
    }
}

function load_part() {
    if (!text_container_el || !tpl_cont_el) {
        text_container_el = document.querySelector('#text')
        tpl_cont_el = document.querySelector('#tpl-cont')

        if (!text_container_el || !tpl_cont_el) {
            return
        }
    }

    if (!state.segs || state.segs.length === 0) {
        return
    }

    let cur = state.segs[state.cur]
    if (!cur) {
        return
    }

    text_container_el.style.opacity = 0

    setTimeout(() => {
        try {
            if (state.cur === 0) {
                let title_text = typeof state.title === 'string' ? state.title : cur[1]
                let desc_text = cur[2] || ''
                tpl_cont_el.innerHTML = render_title(title_text, desc_text)
            } else if (cur[1] && cur[1].includes('=')) {
                const parts = cur[1].split('=')
                tpl_cont_el.innerHTML = render_bayt(parts, cur[2] || '')
            } else if (cur[1] && (cur[1].includes('،') || cur[1].includes('؛'))) {
                const split_char = cur[1].includes('،') ? '،' : '؛'
                const split_index = cur[1].indexOf(split_char)

                if (split_index > 0) {
                    const parts = [
                        cur[1].substring(0, split_index + 1),
                        cur[1].substring(split_index + 1),
                    ]
                    tpl_cont_el.innerHTML = render_bayt(parts, cur[2] || '')
                } else {
                    tpl_cont_el.innerHTML = render_title(cur[1], cur[2] || '')
                }
            } else {
                if (cur[1]) {
                    tpl_cont_el.innerHTML = render_title(cur[1], cur[2] || '')
                } else {
                    tpl_cont_el.innerHTML = render_title('جزء فارغ', '')
                }
            }

            text_container_el.style.opacity = 1
        } catch {
            tpl_cont_el.innerHTML = render_title('خطأ في عرض المحتوى', 'يرجى المحاولة مرة أخرى')
            text_container_el.style.opacity = 1
        }
    }, 250)

    if (audio && audio.currentTime > cur[0] + 1) {
        audio.currentTime = cur[0]
    }
}

function render_title(title, desc) {
    return `<div class="title">${title}</div><div class="desc">${desc}</div>`
}

function render_bayt(b, sharh) {
    if (!Array.isArray(b)) {
        if (typeof b === 'string') {
            b = b.split('=')
        } else {
            b = ['', '']
        }
    }

    if (b.length === 1) {
        if (b[0].includes('،')) {
            const parts = b[0].split('،')
            if (parts.length >= 2) {
                b = [parts[0] + '،', parts.slice(1).join('،')]
            } else {
                b[1] = b[0]
            }
        } else {
            b[1] = b[0]
        }
    }

    let first = b[0] || ''
    let second = b[1] || ''

    return `
      <div class="matn">
        <div id="part-no" style="font-size: 2rem;" class="[text-shadow:_0_4px_4px_rgb(0_0_0_/_0.5)] -translate-y-7">${ar_nums(state.cur)}</div>
        <div class="first">${first}</div>
        <div class="second">${second}</div>
      </div>
      <div class="sharh">${sharh || ''}</div>`
}

function ar_nums(s) {
    return ('' + s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'.substr(+d, 1))
}

function part_done() {
    if (!audio) return

    if (!state.segs || state.segs.length === 0) return

    if (!part_start_input) part_start_input = document.querySelector('#part-start')

    const delay = document.querySelector('#delay')
    const part_reps = document.querySelector('#part-reps')
    const part_end = document.querySelector('#part-end')
    const all_reps = document.querySelector('#all-reps')

    if (!delay || !part_reps || !part_end || !all_reps) {
        return
    }

    let last_dur =
        state.cur + 1 < state.segs.length
            ? state.segs[state.cur + 1][0] - state.segs[state.cur][0]
            : 5

    let delay_time = +delay.value.slice(0, -1) * last_dur * 1000
    let part_reps_val = +part_reps.value
    let part_end_val = +part_end.value

    if (
        state.cur + 1 === part_end_val &&
        state.all_reps === +all_reps.value &&
        state.part_reps === part_reps_val
    ) {
        audio.pause()
        reset_state()
        return
    }

    if (state.part_reps === part_reps_val) {
        state.part_reps = 0
        state.cur++
    }

    state.part_reps++

    if (state.cur + 1 > part_end_val) {
        audio.pause()
        state.cur = part_start_input ? +part_start_input.value - 1 : 0
        state.all_reps++
        if (clicker) {
            clicker.volume = 0.75
            clicker.play()
        }
        delay_time = delay_time || 750
    }

    if (delay_time) {
        audio.pause()
    }

    setTimeout(() => {
        load_part()
        if (audio && audio.paused) {
            audio.play()
        }
    }, delay_time)
}

function reset_state() {
    if (!part_progress_el) {
        part_progress_el = document.querySelector('#part-progress')
    }

    if (!state.segs || state.segs.length === 0) {
        return
    }

    if (part_progress_el) {
        part_progress_el.style.width = 0
    }

    state.all_reps = 1
    state.part_reps = 1
    state.cur = 0

    if (audio) {
        audio.currentTime = 0
        audio.pause()
    }

    load_part()
}

function seek(dir) {
    if (!audio) return

    if (!state.segs || state.segs.length === 0) return

    audio.pause()

    if (dir === 1) {
        for (
            ;
            state.cur < state.segs.length - 1 && audio.currentTime > state.segs[state.cur][0];
            state.cur++
        );
        state.cur--
    } else {
        for (; state.cur > 0 && audio.currentTime < state.segs[state.cur][0]; state.cur--);
    }

    audio.currentTime = state.segs[state.cur][0]

    load_part()
    audio.play()
}

function handle_time_update(audio_el) {
    if (!audio_el || audio_el.paused) return

    if (!part_progress_el) {
        part_progress_el = document.querySelector('#part-progress')
        if (!part_progress_el) return
    }

    if (!state.segs || state.segs.length === 0 || !state.segs[state.cur]) return

    let cur_time = audio_el.currentTime
    let part_time = state.segs[state.cur][0]
    let next_time =
        state.cur < state.segs.length - 1 ? state.segs[state.cur + 1][0] : audio_el.duration

    if (state.cur > 0 && cur_time < part_time) {
        seek(-1)
        return
    }

    if (state.cur < state.segs.length - 2 && cur_time > state.segs[state.cur + 2][0]) {
        seek(1)
        return
    }

    if (state.cur === 0 && cur_time < part_time && cur_time >= part_time - 0.35) {
        load_part()
    }

    if (cur_time >= next_time) {
        part_done()
    }

    const progress_percentage = ((cur_time - part_time) / (next_time - part_time)) * 100
    if (!isNaN(progress_percentage) && isFinite(progress_percentage)) {
        part_progress_el.style.width = Math.min(100, Math.max(0, progress_percentage)) + '%'
    } else {
        part_progress_el.style.width = '0%'
    }
}

function handle_matn_change() {
    const select = document.querySelector('#matn-select')
    if (!select) {
        return
    }

    const selected_value = select.value
    const selected_text = select.options[select.selectedIndex].text

    load_matn(selected_text, selected_value)
}
</script>

<style>
:global(.rtl) {
    direction: rtl;
}
</style>
