<div
    id="player-cont"
    class="mb-6 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 p-6 shadow-md"
>
    <audio
        bind:this={audio}
        preload="metadata"
        controls
        controlsList="nodownload"
        class="mb-6 w-full rounded-md"
        ontimeupdate={handle_time_update}
    ></audio>

    <div id="seek-btns" class="mb-8 flex flex-wrap items-center justify-center gap-2 font-sans">
        <div class="control-group mx-2 flex items-center rounded-full bg-white px-3 py-1 shadow">
            <Button
                class="speed increase rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Increase speed"
            >
                <svg
                    class="h-6 w-6 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M12 8L18 14L12 20" />
                </svg>
            </Button>

            <div id="play-speed" class="mx-3 flex flex-col items-center text-center">
                <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                    <path
                        d="M30.2972 18.7786C30.2972 18.7786 27.0679 27.8808 25.5334 29.4699C23.9988 31.0591 21.4665 31.1033 19.8774 29.5687C18.2882 28.0341 18.244 25.5018 19.7786 23.9127C21.3132 22.3236 30.2972 18.7786 30.2972 18.7786Z"
                        fill="#2F88FF"
                        stroke="#000000"
                        stroke-width="4"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M38.8492 38.8492C42.6495 35.049 45 29.799 45 24C45 12.402 35.598 3 24 3C12.402 3 3 12.402 3 24C3 29.799 5.35051 35.049 9.15076 38.8492"
                        stroke="#000000"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M24 4V8"
                        stroke="#000000"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M38.8454 11.1421L35.7368 13.6593"
                        stroke="#000000"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M42.5225 27.2328L38.6251 26.333"
                        stroke="#000000"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M5.47749 27.2328L9.37497 26.333"
                        stroke="#000000"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M9.15463 11.1421L12.2632 13.6593"
                        stroke="#000000"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <p class="text-sm font-medium text-black">{playback_rate.toFixed(2)}x</p>
            </div>
            <Button
                class="speed decrease rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Decrease speed"
            >
                <svg
                    class="h-6 w-6 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M12 8L6 14L12 20" />
                </svg>
            </Button>
        </div>

        <div class="control-group mx-4 flex items-center rounded-full bg-white px-3 py-1 shadow">
            <Button
                class="skip increase rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Skip forward 5 seconds"
            >
                <svg
                    class="h-6 w-6 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                </svg>
            </Button>

            <p class="z-50 mx-2 text-sm font-medium text-black">5s</p>
            <Button
                class="skip decrease rounded-full p-2 transition-colors hover:bg-gray-100"
                aria-label="Skip backward 5 seconds"
            >
                <svg
                    class="h-6 w-6 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                </svg>
            </Button>
        </div>
    </div>

    <div id="repeat-cont" class="grid grid-cols-1 gap-8 font-sans lg:grid-cols-3">
        <div class="spinner-cont control-card rounded-lg bg-white p-4 shadow-sm">
            <h3 class="katab mb-4 text-center text-lg font-medium text-gray-700">نطاق التشغيل</h3>
            <div>
                <div class="mb-5 flex items-center justify-between">
                    <p class="katab ml-3 text-sm font-medium text-gray-600 sm:text-lg">من</p>
                    <div class="flex">
                        <Button
                            class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Decrease start"
                            onclick={() => handle_start_change(false)}>–</Button
                        >
                        <input
                            type="number"
                            class="spinner mx-2 w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                            id="part-start"
                            bind:this={part_start_input}
                            value={current_start}
                            min="1"
                            max={total_verses}
                            required
                            oninput={handle_start_input_change}
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Increase start"
                            onclick={() => handle_start_change(true)}>+</Button
                        >
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <p class="katab ml-3 text-sm font-medium text-gray-600 sm:text-lg">إلى</p>
                    <div class="flex">
                        <Button
                            class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Decrease end"
                            onclick={() => handle_end_change(false)}>–</Button
                        >
                        <input
                            type="number"
                            class="spinner mx-2 w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                            id="part-end"
                            bind:this={part_end_input}
                            value={current_end}
                            min="1"
                            max={total_verses}
                            required
                            oninput={handle_end_input_change}
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Increase end"
                            onclick={() => handle_end_change(true)}>+</Button
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="spinner-cont control-card rounded-lg bg-white p-4 shadow-sm">
            <h3 class="katab mb-4 text-center text-lg font-medium text-gray-700">التكرار</h3>
            <div>
                <div class="mb-5 flex items-center">
                    <div class="ml-2 flex items-center">
                        <svg
                            class="ml-2 h-6 w-6 text-blue-500 max-[1235px]:h-5 max-[1235px]:w-5"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
                            <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3" /></svg
                        >
                        <span class="katab text-sm text-gray-600 sm:text-lg">كامل</span>
                    </div>
                    <div class="mr-auto flex items-center">
                        <Button
                            class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            >–</Button
                        >
                        <input
                            type="text"
                            class="spinner mx-2 w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                            id="all-reps"
                            value="1"
                            readonly
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            >+</Button
                        >
                    </div>
                </div>

                <div class="flex items-center">
                    <div class="ml-2 flex items-center">
                        <svg
                            class="ml-2 h-6 w-6 text-blue-500 max-[1235px]:h-5 max-[1235px]:w-5"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
                            <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3" />
                            <path d="M11 11l1 -1v4" /></svg
                        >
                        <span class="katab text-sm text-gray-600 sm:text-lg">مقطع</span>
                    </div>
                    <div class="mr-auto flex items-center">
                        <Button
                            class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            >–</Button
                        >
                        <input
                            type="text"
                            class="spinner mx-2 w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                            id="part-reps"
                            value="1"
                            readonly
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                            >+</Button
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="spinner-cont control-card rounded-lg bg-white p-4 shadow-sm">
            <h3 class="mb-4 flex items-center justify-center text-lg font-medium text-gray-700">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style="fill: rgba(59, 66, 83, 1);transform: ;msFilter:;"
                    ><path
                        d="M19 22h1v-2h-1v-1a7.014 7.014 0 0 0-3.433-6.02c-.355-.21-.567-.547-.567-.901v-.158c0-.354.212-.691.566-.9A7.016 7.016 0 0 0 19 5V4h1V2H4v2h1v1a7.016 7.016 0 0 0 3.434 6.021c.354.209.566.545.566.9v.158c0 .354-.212.691-.566.9A7.016 7.016 0 0 0 5 19v1H4v2h15zM17 4v1a5.005 5.005 0 0 1-1.004 3H8.004A5.005 5.005 0 0 1 7 5V4h10zM9.45 14.702c.971-.574 1.55-1.554 1.55-2.623V12h2v.079c0 1.068.579 2.049 1.551 2.623A4.98 4.98 0 0 1 16.573 17H7.427a4.977 4.977 0 0 1 2.023-2.298z"
                    ></path></svg
                >
                <span class="katab mr-2">السكت</span>
            </h3>
            <div class="flex items-center justify-center">
                <Button
                    class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                    >–</Button
                >
                <input
                    type="text"
                    class="spinner mx-2 w-16 rounded-md border-none border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    id="delay"
                    value="0x"
                    readonly
                />
                <Button
                    class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                    >+</Button
                >
            </div>
        </div>
    </div>
</div>

<script>
import {onDestroy, onMount} from 'svelte'

import Button from '~/lib/components/ui/button/button.svelte'

let {audio, part_start_input, part_end_input, save_settings, settings} = $props()

let total_verses = $state(1)
let current_start = $state(1)
let current_end = $state(1)

let playback_rate = $state(1.0)
let playback_interval

const int_bound = (int, min, max) => Math.max(Math.min(int, max), min)

onMount(() => {
    const saved_settings = settings

    // Object.keys(saved_settings)
    //     .filter(id => document.querySelector(`#${id}`))
    //     .forEach(id => {
    //         document.querySelector(`#${id}`).value = saved_settings[id]
    //     })

    if (audio && saved_settings['play-speed']) {
        audio.playbackRate = parseFloat(saved_settings['play-speed'])
        playback_rate = audio.playbackRate
    }

    document.addEventListener('verses-loaded', handle_verses_loaded)
})

onDestroy(() => {
    if (playback_interval) {
        clearInterval(playback_interval)
    }
    document.removeEventListener('verses-loaded', handle_verses_loaded)
})

function handle_verses_loaded(e) {
    if (e.detail && e.detail.total) {
        total_verses = e.detail.total
        current_end = total_verses

        if (part_end_input) {
            part_end_input.value = total_verses
            part_end_input.max = total_verses
        }
    }
}

function handle_start_change(increase) {
    const new_value = int_bound(current_start + (increase ? 1 : -1), 1, total_verses)
    current_start = new_value

    if (part_start_input) {
        part_start_input.value = new_value
    }

    save_settings('part-start', new_value.toString())
    notify_current_part_change(new_value)
}

function handle_end_change(increase) {
    const new_value = int_bound(current_end + (increase ? 1 : -1), 1, total_verses)
    current_end = new_value

    if (part_end_input) {
        part_end_input.value = new_value
    }

    save_settings('part-end', new_value.toString())
}

function handle_start_input_change(e) {
    const input_value = parseInt(e.target.value, 10)

    if (isNaN(input_value) || input_value < 1) {
        current_start = 1
        if (part_start_input) {
            part_start_input.value = 1
        }
    } else if (input_value > total_verses) {
        current_start = total_verses
        if (part_start_input) {
            part_start_input.value = total_verses
        }
    } else {
        current_start = input_value
    }

    save_settings('part-start', current_start.toString())
    notify_current_part_change(current_start)
}

function handle_end_input_change(e) {
    const input_value = parseInt(e.target.value, 10)

    if (isNaN(input_value) || input_value < 1) {
        current_end = 1
        if (part_end_input) {
            part_end_input.value = 1
        }
    } else if (input_value > total_verses) {
        current_end = total_verses
        if (part_end_input) {
            part_end_input.value = total_verses
        }
    } else {
        current_end = input_value
    }

    save_settings('part-end', current_end.toString())
}

function notify_current_part_change(new_value) {
    const event = new CustomEvent('start-input-change', {
        detail: {value: new_value},
    })
    document.dispatchEvent(event)
}

function handle_button_action(e, action) {
    const button = e.currentTarget
    const is_increase = button.classList.contains('increase')

    if (action === 'speed') {
        handle_speed_change(is_increase)
    } else if (action === 'skip') {
        handle_skip(is_increase)
    } else if (action === 'spinner') {
        const input = is_increase ? button.previousElementSibling : button.nextElementSibling
        handle_rep_change(input, is_increase)
    }

    if (playback_interval) {
        clearInterval(playback_interval)
    }

    playback_interval = setInterval(() => {
        if (action === 'speed') {
            handle_speed_change(is_increase)
        } else if (action === 'skip') {
            handle_skip(is_increase)
        } else if (action === 'spinner') {
            const input = is_increase ? button.previousElementSibling : button.nextElementSibling
            handle_rep_change(input, is_increase)
        }
    }, 150)
}

function setup_button_interactions() {
    const speed_buttons = document.querySelectorAll('.speed')
    const skip_buttons = document.querySelectorAll('.skip')
    const spinner_buttons = document.querySelectorAll(
        '.spinner-cont .increase, .spinner-cont .decrease',
    )

    speed_buttons.forEach(btn => {
        btn.addEventListener('mousedown', e => handle_button_action(e, 'speed'))
        btn.addEventListener('touchstart', e => handle_button_action(e, 'speed'))
    })

    skip_buttons.forEach(btn => {
        btn.addEventListener('mousedown', e => handle_button_action(e, 'skip'))
        btn.addEventListener('touchstart', e => handle_button_action(e, 'skip'))
    })

    spinner_buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            const isIncrease = btn.classList.contains('increase')
            const input = isIncrease ? btn.previousElementSibling : btn.nextElementSibling

            handle_rep_change(input, isIncrease)

            if (playback_interval) {
                clearInterval(playback_interval)
            }

            playback_interval = setInterval(() => {
                handle_rep_change(input, isIncrease)
            }, 150)
        })

        btn.addEventListener('touchstart', () => {
            const isIncrease = btn.classList.contains('increase')
            const input = isIncrease ? btn.previousElementSibling : btn.nextElementSibling

            handle_rep_change(input, isIncrease)

            if (playback_interval) {
                clearInterval(playback_interval)
            }

            playback_interval = setInterval(() => {
                handle_rep_change(input, isIncrease)
            }, 150)
        })
    })

    document.documentElement.addEventListener('mouseup', clear_action_interval)
    document.documentElement.addEventListener('touchend', clear_action_interval)

    const number_inputs = document.querySelectorAll('input[type="number"]')
    number_inputs.forEach(input => {
        input.addEventListener('keydown', handle_number_input_keydown)
    })
}

function clear_action_interval() {
    if (playback_interval) {
        clearInterval(playback_interval)
        playback_interval = null
    }
}

function handle_number_input_keydown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()

        handle_rep_change(e.target, e.key === 'ArrowUp')
    } else if (e.key === '-') {
        e.preventDefault()
    }
}

function handle_speed_change(increase) {
    if (!audio) return

    const new_rate = int_bound(audio.playbackRate + 0.1 * (increase ? 1 : -1), 0.4, 4)
    audio.playbackRate = new_rate
    playback_rate = new_rate

    const speed_display = document.querySelector('#play-speed')
    if (speed_display) {
        const span = speed_display.querySelector('span')
        if (span) {
            span.textContent = new_rate.toFixed(2) + 'x'
        }
    }

    save_settings('play-speed', new_rate.toString())
}

function handle_skip(increase) {
    if (!audio) return
    audio.currentTime += 5 * (increase ? 1 : -1)
}

function handle_rep_change(el, increase) {
    if (!el) {
        return
    }

    const id = el.id
    let val = el.value

    if (el.type === 'number') {
        val = parseInt(val, 10) || 1
        val = val + (increase ? 1 : -1)

        if (val < 1) {
            val = 1
        } else if (val > parseInt(el.max, 10)) {
            val = parseInt(el.max, 10)
        }
    } else if (id.endsWith('-reps')) {
        if (val === '∞') {
            val = increase ? 1 : 10
        } else {
            val = parseInt(val, 10) + (increase ? 1 : -1)
        }
        if (val === 0 || val === 11) {
            val = '∞'
        }
    } else if (id === 'delay') {
        val = parseFloat(val.slice(0, -1)) + (increase ? 0.5 : -0.5)
        if (val === 2.5) {
            val = 2
        } else if (val < 0) {
            val = 0
        }
        val += 'x'
    }

    el.value = val

    if (id === 'part-start') {
        current_start = parseInt(val, 10)
        notify_current_part_change(current_start)
    } else if (id === 'part-end') {
        current_end = parseInt(val, 10)
    }

    el.classList[el.validity.valid ? 'remove' : 'add']('invalid')
    save_settings(id, val.toString())
}

function handle_time_update() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const event = new CustomEvent('timeupdate', {detail: audio})
        document.dispatchEvent(event)
    }
}

onMount(setup_button_interactions)
</script>

<style>
#player-cont {
    font-family: 'Noto';
}

.katab {
    font-family: 'Kitab';
}
button {
    transition: all 0.2s ease;
}

button:active {
    transform: scale(0.95);
}

input.invalid {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.1);
}

.control-card {
    transition: transform 0.2s ease;
}

.control-card:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    #repeat-cont {
        gap: 1rem;
    }

    .control-card {
        padding: 1rem;
    }
}
</style>
