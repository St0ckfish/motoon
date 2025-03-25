<svelte:head>
    <title>{`${matnName} | مقرئ المتون`}</title>
</svelte:head>

<main class="rtl container mx-auto max-w-4xl px-4 py-6">
    <h1
        class="mb-6 text-center text-3xl font-bold"
        style="font-family: 'Aref Ruqaa'; margin: 0.4rem 0; text-shadow: 2px 1px #bbb;"
    >
        مُقرِئ المتون
    </h1>

    <MatnSelector change={handle_matn_change} />

    <TextDisplay bind:this={textDisplay} bind:part_progress_el />

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

let main_state = $state({
    all_reps: 1,
    part_reps: 1,
    cur: 0,
    segs: [],
    title: [],
    isFirstPlay: true,
})

let settings = $state(JSON.parse(localStorage.getItem('settings') || '{}'))

let matnName = $state('')
let audio = $state(null)
let clicker = $state(null)
let textDisplay = $state(null)

let part_start_input = $state(null)
let part_end_input = $state(null)
let part_progress_el = $state(null)
let delay_input = $state(null)
let part_reps_input = $state(null)
let all_reps_input = $state(null)

onMount(() => {
    clicker = new Audio('click.mp3')

    const timeUpdateHandler = e => {
        if (e.detail) {
            handle_time_update(e.detail)
        }
    }

    const startInputChangeHandler = e => {
        if (e.detail && e.detail.value) {
            main_state.cur = e.detail.value - 1
            main_state.part_reps = 1

            load_part()

            if (audio && main_state.segs && main_state.segs[main_state.cur]) {
                audio.currentTime = main_state.segs[main_state.cur][0]
            }
        }
    }

    window.addEventListener('timeupdate', timeUpdateHandler)
    window.addEventListener('start-input-change', startInputChangeHandler)

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

    return () => {
        window.removeEventListener('timeupdate', timeUpdateHandler)
        window.removeEventListener('start-input-change', startInputChangeHandler)
    }
})

async function load_matn(matn_name, matnId) {
    if (!matnId) {
        show_error('خطأ في تحميل المتن', 'معرّف المتن غير صالح')
        return
    }

    const encoded_matnId = encodeURIComponent(matnId)

    try {
        if (textDisplay) {
            textDisplay.setOpacity(0.5)
        }

        const cacheParam = `?t=${Date.now()}`
        const response = await fetch(`/data/${encoded_matnId}.txt${cacheParam}`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        })

        if (!response.ok) {
            show_error(
                'خطأ في تحميل المتن',
                `فشل في تحميل الملف (${response.status}). تأكد من وجود الملف على المسار الصحيح.`,
            )
            return
        }

        const text = await response.text()

        if (!text || text.trim() === '') {
            show_error('خطأ في تحميل المتن', 'ملف فارغ')
            return
        }

        const lines = text.split('\n')

        if (lines.length < 2) {
            show_error('خطأ في تحميل المتن', 'عدد سطور غير كافٍ')
            return
        }

        const audioUrl = lines[0].trim()
        const segments = []
        let currentTitle = matn_name
        matnName = matn_name

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
            show_error('خطأ في تحميل المتن', 'لم يتم العثور على مقاطع')
            return
        }

        const oldPlaybackRate = audio ? audio.playbackRate : 1

        if (!audio) {
            audio = document.querySelector('audio')
            if (!audio) {
                show_error('خطأ في تحميل المتن', 'لم يتم العثور على عنصر الصوت')
                return
            }
        }

        audio.src = audioUrl
        audio.playbackRate = oldPlaybackRate

        main_state.title = currentTitle
        main_state.segs = segments.map(seg => {
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

        history.replaceState(null, '#' + matnId.replaceAll(' ', '-'))

        const total_verses =
            main_state.segs.length > 0 && main_state.segs[0][1] === currentTitle
                ? main_state.segs.length - 1
                : main_state.segs.length

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
        show_error('خطأ في تحميل المتن', `${error.message}`)
    }
}

function show_error(title, message) {
    if (textDisplay) {
        textDisplay.setOpacity(1)
        textDisplay.setTitleContent(title, message)
    }
}

function dispatch_verses_loaded_event(total) {
    const event = new CustomEvent('verses-loaded', {
        detail: {total: total},
    })
    window.dispatchEvent(event)
}

onDestroy(() => {
    if (audio) {
        audio.pause()
    }
    window.removeEventListener('timeupdate', handle_time_update)
})

function save_settings(id, value) {
    settings = {...settings, [id]: value}
    // localStorage.setItem('settings', JSON.stringify(settings))
}

function load_part() {
    if (!textDisplay || !main_state.segs || main_state.segs.length === 0) {
        return
    }

    let cur = main_state.segs[main_state.cur]
    if (!cur) {
        return
    }

    textDisplay.setOpacity(0)

    setTimeout(() => {
        try {
            if (main_state.cur === 0) {
                let titleText = main_state.title
                if (!titleText || (Array.isArray(titleText) && titleText.length === 0)) {
                    titleText = cur[1]
                }
                let descText = cur[2] || ''
                // Pass HTML content directly to the title content
                textDisplay.setTitleContent(titleText, descText)
            } else if (cur[1] && cur[1].includes('=')) {
                const parts = cur[1].split('=')
                textDisplay.setBaytContent(parts, cur[2] || '', main_state.cur)
            } else if (cur[1] && (cur[1].includes('،') || cur[1].includes('؛'))) {
                const split_char = cur[1].includes('،') ? '،' : '؛'
                const split_index = cur[1].indexOf(split_char)

                if (split_index > 0) {
                    const parts = [
                        cur[1].substring(0, split_index + 1),
                        cur[1].substring(split_index + 1),
                    ]
                    textDisplay.setBaytContent(parts, cur[2] || '', main_state.cur)
                } else {
                    textDisplay.setTitleContent(cur[1], cur[2] || '')
                }
            } else {
                if (cur[1]) {
                    textDisplay.setTitleContent(cur[1], cur[2] || '')
                }
            }

            textDisplay.setOpacity(1)
        } catch {
            textDisplay.setTitleContent('خطأ في عرض المحتوى', 'يرجى المحاولة مرة أخرى')
            textDisplay.setOpacity(1)
        }
    }, 250)

    if (audio && audio.currentTime > cur[0] + 1) {
        audio.currentTime = cur[0]
    }
}

function part_done() {
    if (!audio) return

    if (!main_state.segs || main_state.segs.length === 0) return

    if (
        main_state.cur === 0 &&
        part_end_input?.value === '1' &&
        main_state.segs.length > 1 &&
        main_state.isFirstPlay
    ) {
        part_end_input.value = main_state.segs.length
        main_state.isFirstPlay = false
    }

    const delayValue = delay_input?.value || '0x'
    const partRepsValue = part_reps_input?.value || '1'
    const partEndValue = part_end_input?.value || String(main_state.segs.length)
    const allRepsValue = all_reps_input?.value || '1'

    let lastDur =
        main_state.cur + 1 < main_state.segs.length
            ? main_state.segs[main_state.cur + 1][0] - main_state.segs[main_state.cur][0]
            : 5

    let delayTime = +delayValue.slice(0, -1) * lastDur * 1000
    let partRepsVal = +partRepsValue
    let partEndVal = +partEndValue

    const isAtLastPart = main_state.cur + 1 >= partEndVal
    const hasCompletedPartReps = main_state.part_reps >= partRepsVal
    const hasCompletedAllReps = main_state.all_reps >= +allRepsValue
    const shouldResetState = isAtLastPart && hasCompletedPartReps && hasCompletedAllReps

    if (shouldResetState) {
        audio.pause()
        reset_state()
        return
    }

    if (main_state.part_reps >= partRepsVal) {
        main_state.part_reps = 1
        main_state.cur++
    } else {
        main_state.part_reps++
    }

    if (main_state.cur + 1 > partEndVal) {
        audio.pause()
        if (allRepsValue > 1 && main_state.all_reps < +allRepsValue) {
            main_state.cur = part_start_input ? +part_start_input.value - 1 : 0
            main_state.all_reps++

            if (clicker) {
                clicker.volume = 0.75
                clicker.play()
            }

            delayTime = delayTime || 750
        } else {
            reset_state()
            return
        }
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
                    window.addEventListener(
                        'click',
                        function resumeAudio() {
                            audio.play()
                            window.removeEventListener('click', resumeAudio)
                        },
                        {once: true},
                    )
                })
            }
        }
    }, delayTime || 0)
}

function reset_state() {
    if (!main_state.segs || main_state.segs.length === 0) {
        return
    }

    if (part_progress_el) {
        part_progress_el.style.width = '0'
    }

    main_state.all_reps = 1
    main_state.part_reps = 1
    main_state.cur = 0

    if (audio) {
        audio.currentTime = 0
        audio.pause()
    }

    load_part()
}

function seek(dir) {
    if (!audio || !main_state.segs || main_state.segs.length === 0) return

    audio.pause()

    if (dir === 1) {
        for (
            ;
            main_state.cur < main_state.segs.length - 1 &&
            audio.currentTime > main_state.segs[main_state.cur][0];
            main_state.cur++
        );
        main_state.cur--
    } else {
        for (
            ;
            main_state.cur > 0 && audio.currentTime < main_state.segs[main_state.cur][0];
            main_state.cur--
        );
    }

    audio.currentTime = main_state.segs[main_state.cur][0]

    load_part()
    audio.play()
}

function handle_time_update(audioEl) {
    if (!audioEl || audioEl.paused) return

    if (!part_progress_el) {
        return
    }

    if (!main_state.segs || main_state.segs.length === 0 || !main_state.segs[main_state.cur]) return

    let curTime = audioEl.currentTime
    let partTime = main_state.segs[main_state.cur][0]
    let nextTime =
        main_state.cur < main_state.segs.length - 1
            ? main_state.segs[main_state.cur + 1][0]
            : audioEl.duration

    if (main_state.cur > 0 && curTime < partTime) {
        seek(-1)
        return
    }

    if (
        main_state.cur < main_state.segs.length - 2 &&
        curTime > main_state.segs[main_state.cur + 2][0]
    ) {
        seek(1)
        return
    }

    if (main_state.cur === 0 && curTime < partTime && curTime >= partTime - 0.35) {
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
    const target = event.detail?.target || event.target
    if (!target) {
        show_error('خطأ في التحديد', 'لم يتم العثور على عنصر الهدف في الحدث')
        return
    }
    let selectedValue = target.value
    if (selectedValue === null || selectedValue === undefined) {
        show_error('خطأ في التحديد', 'لم يتم العثور على قيمة للعنصر المحدد')
        return
    }

    let selectedText = selectedValue
    if (target.options && target.selectedIndex !== undefined) {
        const option = target.options[target.selectedIndex]
        if (option) {
            selectedText = option.text || selectedValue
        }
    }
    load_matn(selectedText, selectedValue)
}
</script>
