<main class="rtl container mx-auto max-w-4xl px-4 py-6">
    <h1
        class="mb-6 text-center text-3xl font-bold"
        style="font-family: 'Aref Ruqaa'; margin: 0.4rem 0; text-shadow: 2px 1px #bbb;"
    >
        مُقرِئ المتون
    </h1>

    <MatnSelector change={handle_matn_change} />

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
    isFirstPlay: true,
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
    clicker = new Audio('click.mp3')

    document.addEventListener('timeupdate', e => {
        if (e.detail) {
            handle_time_update(e.detail)
        }
    })

    document.addEventListener('start-input-change', e => {
        if (e.detail && e.detail.value) {
            state.cur = e.detail.value - 1
            state.part_reps = 1

            load_part()

            if (audio && state.segs && state.segs[state.cur]) {
                audio.currentTime = state.segs[state.cur][0]
            }
        }
    })

    const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ')
    if (hash) {
        const select = document.querySelector('select')
        if (select) {
            const option = Array.from(select.options).find(opt => opt.value === hash)
            if (option) {
                load_matn(option.text, hash)
            }
        }
    }
})

async function load_matn(matnName, matnId) {
    const encoded_matnId = encodeURIComponent(matnId)
    try {
        const response = await fetch(`/data/${encoded_matnId}.txt`, {cache: 'no-cache'})
        if (!response.ok) {
            if (tpl_cont_el) {
                tpl_cont_el.innerHTML = render_title(
                    'خطأ في تحميل المتن',
                    `فشل في تحميل الملف (${response.status})`,
                )
            }
            return
        }

        const text = await response.text()

        if (!text || text.trim() === '') {
            if (tpl_cont_el) {
                tpl_cont_el.innerHTML = render_title('خطأ في تحميل المتن', 'ملف فارغ')
            }
            return
        }

        const lines = text.split('\n')

        if (lines.length < 2) {
            if (tpl_cont_el) {
                tpl_cont_el.innerHTML = render_title('خطأ في تحميل المتن', 'عدد سطور غير كافٍ')
            }
            return
        }

        const audioUrl = lines[0].trim()
        const segments = []
        let currentTitle = matnName

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
                        currentTitle = text
                    }

                    i = j - 1
                }
            }
        }

        if (segments.length === 0) {
            if (tpl_cont_el) {
                tpl_cont_el.innerHTML = render_title(
                    'خطأ في تحميل المتن',
                    'لم يتم العثور على مقاطع',
                )
            }
            return
        }

        const oldPlaybackRate = audio ? audio.playbackRate : 1

        if (!audio) {
            audio = document.querySelector('audio')
            if (!audio) {
                if (tpl_cont_el) {
                    tpl_cont_el.innerHTML = render_title(
                        'خطأ في تحميل المتن',
                        'لم يتم العثور على عنصر الصوت',
                    )
                }
                return
            }
        }

        audio.src = audioUrl
        audio.playbackRate = oldPlaybackRate

        state.title = currentTitle
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

        location.hash = matnId.replaceAll(' ', '-')
        document.title = `${matnName} | مقرئ المتون`

        const total_verses =
            state.segs.length > 0 && state.segs[0][1] === currentTitle
                ? state.segs.length - 1
                : state.segs.length

        dispatch_verses_loaded_event(total_verses)

        if (part_start_input && part_end_input) {
            part_start_input.value = 1
            const maxValue = total_verses
            part_start_input.max = maxValue
            part_end_input.max = maxValue
            part_end_input.value = maxValue
            part_start_input.min = 1
            part_end_input.min = 1

            save_settings('part-start', 1)
            save_settings('part-end', maxValue)

            reset_state()
        } else {
            reset_state()
        }
    } catch (error) {
        if (tpl_cont_el) {
            tpl_cont_el.innerHTML = render_title('خطأ في تحميل المتن', `${error.message}`)
        }
    }
}

function dispatch_verses_loaded_event(total) {
    const event = new CustomEvent('verses-loaded', {
        detail: {total: total},
    })
    document.dispatchEvent(event)
}

onDestroy(() => {
    if (audio) {
        audio.pause()
    }
    document.removeEventListener('timeupdate', handle_time_update)
})

function save_settings(id, value) {
    settings = {...settings, [id]: value}
    // localStorage.setItem('settings', JSON.stringify(settings))
}

function load_part() {
    if (!text_container_el || !tpl_cont_el) {
        return
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
                let titleText = typeof state.title === 'string' ? state.title : cur[1]
                let descText = cur[2] || ''
                tpl_cont_el.innerHTML = render_title(titleText, descText)
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

    const delayInput = document.getElementById('delay')
    const partRepsInput = document.getElementById('part-reps')
    const allRepsInput = document.getElementById('all-reps')
    const partEndInput = part_end_input

    if (
        state.cur === 0 &&
        partEndInput?.value === '1' &&
        state.segs.length > 1 &&
        state.isFirstPlay
    ) {
        partEndInput.value = state.segs.length
        state.isFirstPlay = false
    }

    const delayValue = delayInput?.value || '0x'
    const partRepsValue = partRepsInput?.value || '1'
    const partEndValue = partEndInput?.value || String(state.segs.length)
    const allRepsValue = allRepsInput?.value || '1'

    let lastDur =
        state.cur + 1 < state.segs.length
            ? state.segs[state.cur + 1][0] - state.segs[state.cur][0]
            : 5

    let delayTime = +delayValue.slice(0, -1) * lastDur * 1000
    let partRepsVal = +partRepsValue
    let partEndVal = +partEndValue

    const isAtLastPart = state.cur + 1 >= partEndVal
    const hasCompletedPartReps = state.part_reps >= partRepsVal
    const hasCompletedAllReps = state.all_reps >= +allRepsValue
    const shouldResetState = isAtLastPart && hasCompletedPartReps && hasCompletedAllReps

    if (shouldResetState) {
        audio.pause()
        reset_state()
        return
    }

    if (state.part_reps >= partRepsVal) {
        state.part_reps = 1
        state.cur++
    } else {
        state.part_reps++
    }

    if (state.cur + 1 > partEndVal) {
        audio.pause()
        state.cur = part_start_input ? +part_start_input.value - 1 : 0
        state.all_reps++

        if (clicker) {
            clicker.volume = 0.75
            clicker.play()
        }

        delayTime = delayTime || 750
    }

    if (delayTime) {
        audio.pause()
    }

    setTimeout(() => {
        load_part()
        if (audio && audio.paused) {
            const playPromise = audio.play()
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    document.addEventListener(
                        'click',
                        function resumeAudio() {
                            audio.play()
                            document.removeEventListener('click', resumeAudio)
                        },
                        {once: true},
                    )
                })
            }
        }
    }, delayTime || 0)
}

function reset_state() {
    if (!state.segs || state.segs.length === 0) {
        return
    }

    if (!part_progress_el) {
        part_progress_el = document.querySelector('[id^="part-progress"]')
    }

    if (part_progress_el) {
        part_progress_el.style.width = '0'
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
    if (!audio || !state.segs || state.segs.length === 0) return

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

function handle_time_update(audioEl) {
    if (!audioEl || audioEl.paused) return

    if (!part_progress_el) {
        return
    }

    if (!state.segs || state.segs.length === 0 || !state.segs[state.cur]) return

    let curTime = audioEl.currentTime
    let partTime = state.segs[state.cur][0]
    let nextTime =
        state.cur < state.segs.length - 1 ? state.segs[state.cur + 1][0] : audioEl.duration

    if (state.cur > 0 && curTime < partTime) {
        seek(-1)
        return
    }

    if (state.cur < state.segs.length - 2 && curTime > state.segs[state.cur + 2][0]) {
        seek(1)
        return
    }

    if (state.cur === 0 && curTime < partTime && curTime >= partTime - 0.35) {
        load_part()
    }

    if (curTime >= nextTime) {
        part_done()
    }

    const progressPercentage = ((curTime - partTime) / (nextTime - partTime)) * 100
    if (!isNaN(progressPercentage) && isFinite(progressPercentage)) {
        part_progress_el.style.width = Math.min(100, Math.max(0, progressPercentage)) + '%'
    } else {
        part_progress_el.style.width = '0%'
    }
}

function handle_matn_change(event) {
    const select = event.detail?.target || event.target
    if (!select) {
        return
    }
    const selectedValue = select.value
    const selectedText = select.options[select.selectedIndex].text
    load_matn(selectedText, selectedValue)
}
</script>

<style>
:global(.rtl) {
    direction: rtl;
}
</style>
