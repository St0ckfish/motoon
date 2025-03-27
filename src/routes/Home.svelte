<svelte:head>
    <title>{`${matn_name} | مقرئ المتون`}</title>
</svelte:head>

<main class="rtl container mx-auto max-w-4xl px-4 py-6">
    <h1
        class="mb-6 text-center text-3xl font-bold"
        style="font-family: 'Aref Ruqaa'; margin: 0.4rem 0; text-shadow: 2px 1px #bbb;"
    >
        مُقرِئ المتون
    </h1>

    <MatnSelector change={handle_matn_change} />

    <TextDisplay bind:this={text_display} bind:part_progress_el />

    <PlayerControls
        bind:audio
        bind:part_start_input
        bind:part_end_input
        {save_settings}
        {settings}
        on_start_change={handle_start_change}
        total_verses_prop={main_state.segs
            ? main_state.segs.length > 0 && main_state.segs[0][1] === main_state.title
                ? main_state.segs.length - 1
                : main_state.segs.length
            : 1}
        current_verse={main_state.cur + 1}
        on_time_update={handle_audio_time_update}
    />

    <div class="mb-4 flex justify-center">
        <button
            class="cursor-pointer text-black transition-colors hover:underline"
            onclick={reset_settings}
        >
            إعادة تعيين الإعدادات
        </button>
    </div>

    <Footer />
</main>

<script>
import * as kv from 'idb-keyval'
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
    is_first_play: true,
})

let settings = $state({
    play_speed: '1.0',
    all_reps: '1',
    part_reps: '1',
    delay: '0',
    part_start: '1',
    part_end: '1',
})

let matn_name = $state('')
let audio = $state(null)
let text_display = $state(null)

let part_start_input = $state(null)
let part_end_input = $state(null)
let part_progress_el = $state(null)
let settings_loaded = $state(false)

onMount(() => {
    const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ')
    if (hash) {
        const select = document.querySelector('select')
        if (select) {
            const option = [...select.options].find(opt => opt.value === hash)
            if (option) {
                load_matn(option.text, hash)
            }
        }
    }
})

onMount(async () => {
    const stored_settings = await kv.get('settings')
    if (stored_settings) {
        settings = {
            play_speed: String(stored_settings['play_speed'] || '1.0'),
            all_reps: String(stored_settings['all_reps'] || '1'),
            part_reps: String(stored_settings['part_reps'] || '1'),
            delay: String(stored_settings['delay'] || '0'),
            part_start: String(stored_settings['part_start'] || '1'),
            part_end: String(stored_settings['part_end'] || '1'),
        }

        if (audio) {
            audio.playbackRate = parseFloat(settings['play_speed'])
        }

        settings_loaded = true
    }
})

async function load_matn(input_matn_name, matn_id) {
    if (!matn_id) {
        show_error('خطأ في تحميل المتن', 'معرّف المتن غير صالح')
        return
    }

    const encoded_matn_id = encodeURIComponent(matn_id)

    try {
        if (text_display) {
            text_display.set_opacity(0.5)
        }

        const cache_param = `?t=${Date.now()}`
        const response = await fetch(`/data/${encoded_matn_id}.txt${cache_param}`, {
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

        const audio_url = lines[0].trim()
        const segments = []
        let current_title = input_matn_name
        matn_name = input_matn_name

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
                    }

                    i = j - 1
                }
            }
        }

        if (segments.length === 0) {
            show_error('خطأ في تحميل المتن', 'لم يتم العثور على مقاطع')
            return
        }

        if (!audio) {
            audio = document.querySelector('audio')
            if (!audio) {
                show_error('خطأ في تحميل المتن', 'لم يتم العثور على عنصر الصوت')
                return
            }
        }

        audio.src = audio_url
        audio.playbackRate = parseFloat(settings['play_speed'] || '1.0')

        main_state.title = current_title
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

        history.replaceState(null, '#' + matn_id.replaceAll(' ', '-'))

        const total_verses =
            main_state.segs.length > 0 && main_state.segs[0][1] === current_title
                ? main_state.segs.length - 1
                : main_state.segs.length

        if (part_start_input && part_end_input) {
            part_start_input.value = 1
            const max_value = total_verses
            part_start_input.max = max_value
            part_end_input.max = max_value

            const start_value =
                settings_loaded && settings['part_start'] ? parseInt(settings['part_start'], 10) : 1
            const end_value =
                settings_loaded && settings['part_end']
                    ? parseInt(settings['part_end'], 10)
                    : max_value

            const validated_start = Math.max(1, Math.min(start_value, max_value))
            const validated_end = Math.max(validated_start, Math.min(end_value, max_value))

            part_start_input.value = validated_start
            part_end_input.value = validated_end
            part_start_input.min = 1
            part_end_input.min = 1

            settings = {
                ...settings,
                part_start: String(validated_start),
                part_end: String(validated_end),
            }

            save_settings('part_start', validated_start)
            save_settings('part_end', validated_end)

            reset_state()
        } else {
            reset_state()
        }
    } catch (error) {
        show_error('خطأ في تحميل المتن', `${error.message}`)
    }
}

function show_error(title, message) {
    if (text_display) {
        text_display.set_opacity(1)
        text_display.set_title_content(title, message)
    }
}

onDestroy(() => {
    if (audio) {
        audio.pause()
    }
    window.removeEventListener('timeupdate', handle_time_update)
})

function save_settings(id, value) {
    if (['play_speed', 'all_reps', 'part_reps', 'delay', 'part_start', 'part_end'].includes(id)) {
        const string_value = String(value)
        settings = {...settings, [id]: string_value}
    }
}

function reset_settings() {
    const default_settings = {
        play_speed: '1.0',
        all_reps: '1',
        part_reps: '1',
        delay: '0',
        part_start: '1',
        part_end: settings.part_end || '1',
    }

    settings = default_settings

    kv.set('settings', default_settings).then(() => {
        if (audio) {
            audio.playbackRate = parseFloat(default_settings['play_speed'])
        }
    })
}

function load_part() {
    if (!text_display || !main_state.segs || main_state.segs.length === 0) {
        return
    }

    let cur = main_state.segs[main_state.cur]
    if (!cur) {
        return
    }

    text_display.set_opacity(0)

    setTimeout(() => {
        try {
            if (main_state.cur === 0) {
                let title_text = main_state.title
                if (!title_text || (Array.isArray(title_text) && title_text.length === 0)) {
                    title_text = cur[1]
                }
                let desc_text = cur[2] || ''
                text_display.set_title_content(title_text, desc_text)
            } else if (cur[1] && cur[1].includes('=')) {
                const parts = cur[1].split('=')
                text_display.set_bayt_content(parts, cur[2] || '', main_state.cur)
            } else if (cur[1] && (cur[1].includes('،') || cur[1].includes('؛'))) {
                const split_char = cur[1].includes('،') ? '،' : '؛'
                const split_index = cur[1].indexOf(split_char)

                if (split_index > 0) {
                    const parts = [
                        cur[1].substring(0, split_index + 1),
                        cur[1].substring(split_index + 1),
                    ]
                    text_display.set_bayt_content(parts, cur[2] || '', main_state.cur)
                } else {
                    text_display.set_title_content(cur[1], cur[2] || '')
                }
            } else {
                if (cur[1]) {
                    text_display.set_title_content(cur[1], cur[2] || '')
                }
            }

            text_display.set_opacity(1)
        } catch {
            text_display.set_title_content('خطأ في عرض المحتوى', 'يرجى المحاولة مرة أخرى')
            text_display.set_opacity(1)
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
        main_state.is_first_play
    ) {
        part_end_input.value = main_state.segs.length
        main_state.is_first_play = false
    }

    const delay_value = settings['delay'] || '0'
    const part_reps_value = settings['part_reps'] || '1'
    const part_end_value = settings['part_end'] || String(main_state.segs.length)
    const all_reps_value = settings['all_reps'] || '1'

    const delay_time = parseFloat(delay_value) * 1000
    const part_reps_val = parseInt(part_reps_value, 10)
    const part_end_val = parseInt(part_end_value, 10)
    const all_reps_val = parseInt(all_reps_value, 10)

    const is_at_last_part = main_state.cur >= part_end_val - 1
    const has_completed_part_reps = main_state.part_reps >= part_reps_val
    const has_completed_all_reps = main_state.all_reps >= all_reps_val

    if (is_at_last_part && has_completed_part_reps && has_completed_all_reps) {
        audio.pause()
        reset_state()
        return
    }

    if (main_state.part_reps < part_reps_val) {
        main_state.part_reps++
        audio.pause()

        setTimeout(() => {
            audio.currentTime = main_state.segs[main_state.cur][0]
            audio.play()
        }, delay_time)

        return
    }

    main_state.part_reps = 1
    main_state.cur++

    if (main_state.cur >= part_end_val) {
        if (all_reps_val > 1 && main_state.all_reps < all_reps_val) {
            audio.pause()
            main_state.cur = parseInt(settings['part_start'], 10) - 1 || 0
            main_state.all_reps++

            setTimeout(() => {
                load_part()
                audio.play()
            }, delay_time || 750)
        } else {
            audio.pause()
            reset_state()
        }
        return
    }

    audio.pause()
    setTimeout(() => {
        load_part()
        audio.play()
    }, delay_time)
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

    const start_value = settings['part_start'] ? parseInt(settings['part_start'], 10) : 1
    main_state.cur = Math.max(0, start_value - 1)

    if (audio) {
        audio.currentTime = 0
        audio.pause()
    }

    load_part()
}

function handle_time_update(audio_el) {
    handle_audio_time_update(audio_el)
}

function handle_audio_time_update(audio_el) {
    if (!audio_el || audio_el.paused) return

    if (!part_progress_el) {
        return
    }

    if (!main_state.segs || main_state.segs.length === 0 || !main_state.segs[main_state.cur]) return

    let cur_time = audio_el.currentTime
    let part_time = main_state.segs[main_state.cur][0]
    let next_time =
        main_state.cur < main_state.segs.length - 1
            ? main_state.segs[main_state.cur + 1][0]
            : audio_el.duration

    if (main_state.cur > 0 && cur_time < part_time - 0.2) {
        find_correct_segment(cur_time)
        return
    }

    if (
        main_state.cur < main_state.segs.length - 1 &&
        cur_time > main_state.segs[main_state.cur + 1][0] + 0.2
    ) {
        find_correct_segment(cur_time)
        return
    }

    if (main_state.cur === 0 && cur_time < part_time && cur_time >= part_time - 0.35) {
        load_part()
    }

    if (cur_time >= next_time - 0.1) {
        part_done()
    }

    const progress_percentage = ((cur_time - part_time) / (next_time - part_time)) * 100
    if (!isNaN(progress_percentage) && isFinite(progress_percentage)) {
        part_progress_el.style.width = Math.min(100, Math.max(0, progress_percentage)) + '%'
    } else {
        part_progress_el.style.width = '0%'
    }
}

function find_correct_segment(current_time) {
    if (!audio || !main_state.segs || main_state.segs.length === 0) return

    let found_segment = false
    let new_segment_index = main_state.cur

    for (let i = 0; i < main_state.segs.length - 1; i++) {
        if (current_time >= main_state.segs[i][0] && current_time < main_state.segs[i + 1][0]) {
            new_segment_index = i
            found_segment = true
            break
        }
    }

    if (!found_segment && current_time >= main_state.segs[main_state.segs.length - 1][0]) {
        new_segment_index = main_state.segs.length - 1
        found_segment = true
    }

    const part_start_val = parseInt(settings.part_start, 10) || 1
    const part_end_val = parseInt(settings.part_end, 10) || main_state.segs.length

    if (new_segment_index + 1 < part_start_val || new_segment_index + 1 > part_end_val) {
        audio.pause()
        return
    }

    if (new_segment_index !== main_state.cur) {
        main_state.cur = new_segment_index
        main_state.part_reps = 1
        load_part()
    }
}

function handle_matn_change(event) {
    const target = event.detail?.target || event.target
    if (!target) {
        show_error('خطأ في التحديد', 'لم يتم العثور على عنصر الهدف في الحدث')
        return
    }
    let selected_value = target.value
    if (selected_value === null || selected_value === undefined) {
        show_error('خطأ في التحديد', 'لم يتم العثور على قيمة للعنصر المحدد')
        return
    }

    let selected_text = selected_value
    if (target.options && target.selectedIndex !== undefined) {
        const option = target.options[target.selectedIndex]
        if (option) {
            selected_text = option.text || selected_value
        }
    }
    load_matn(selected_text, selected_value)
}

function handle_start_change(e) {
    if (e?.detail?.value) {
        main_state.cur = e.detail.value - 1
        main_state.part_reps = 1

        load_part()

        if (audio && main_state.segs && main_state.segs[main_state.cur]) {
            audio.currentTime = main_state.segs[main_state.cur][0]
        }
    }
}
</script>
