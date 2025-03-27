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
            <Tooltip.Root openDelay={tooltip_delay}>
                <Tooltip.Trigger
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
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>زيادة السرعة</p>
                </Tooltip.Content>
            </Tooltip.Root>

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
            <Tooltip.Root openDelay={tooltip_delay}>
                <Tooltip.Trigger
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
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>خفض السرعة</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </div>

        <div class="control-group mx-4 flex items-center rounded-full bg-white px-3 py-1 shadow">
            <Tooltip.Root openDelay={tooltip_delay}>
                <Tooltip.Trigger
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
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>تقديم</p>
                </Tooltip.Content>
            </Tooltip.Root>

            <p class="z-50 mx-2 text-sm font-medium text-black">5s</p>
            <Tooltip.Root openDelay={tooltip_delay}>
                <Tooltip.Trigger
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
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>إرجاع</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </div>
    </div>

    <div id="repeat-cont" class="grid grid-cols-1 gap-8 font-sans lg:grid-cols-3">
        <div class="spinner-cont control-card rounded-lg bg-white p-4 shadow-sm">
            <h3 class="katab mb-4 text-center text-lg font-medium text-gray-700">نطاق التشغيل</h3>
            <div>
                <div class="mb-5 flex items-center justify-between">
                    <p class="katab ml-3 text-sm font-medium text-gray-600 sm:text-lg">من</p>
                    <div class="flex">
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                aria-label="Decrease start"
                                onclick={() => handle_start_change(false)}
                            >
                                –
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>خفض البداية</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                        <NumberInput
                            id="part_start"
                            value={current_start}
                            display_value={current_start_display}
                            min={1}
                            max={total_verses}
                            oninput={val => handle_start_input_change(val)}
                            class="mx-2 w-16 shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                            bind:this={part_start_input}
                        />
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                aria-label="Increase start"
                                onclick={() => handle_start_change(true)}
                                >+
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>زيادة البداية</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <p class="katab ml-3 text-sm font-medium text-gray-600 sm:text-lg">إلى</p>
                    <div class="flex">
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                aria-label="Decrease end"
                                onclick={() => handle_end_change(false)}
                            >
                                –
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>خفض النهاية</p>
                            </Tooltip.Content>
                        </Tooltip.Root>

                        <NumberInput
                            id="part_end"
                            value={current_end}
                            display_value={current_end_display}
                            min={1}
                            max={total_verses}
                            oninput={val => handle_end_input_change(val)}
                            class="mx-2 w-16 shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                            bind:this={part_end_input}
                        />
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                aria-label="Increase end"
                                onclick={() => handle_end_change(true)}
                            >
                                +
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>زيادة النهاية</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
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
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                onclick={() => handle_all_reps_change(false)}
                            >
                                –
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>خفض التكرار الكامل</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                        <NumberInput
                            id="all_reps"
                            value={all_reps}
                            display_value={all_reps_display}
                            min={1}
                            max={10}
                            oninput={val => {
                                all_reps = val
                                all_reps_display = ar_nums(val.toString())
                                save_settings('all_reps', val.toString())
                            }}
                            class="mx-2 w-16 shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                        />
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                onclick={() => handle_all_reps_change(true)}
                            >
                                +
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>زيادة التكرار الكامل</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
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
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                onclick={() => handle_part_reps_change(false)}
                            >
                                –
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>خفض تكرار المقطع</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                        <NumberInput
                            id="part_reps"
                            value={part_reps}
                            display_value={part_reps_display}
                            min={1}
                            max={10}
                            oninput={val => {
                                part_reps = val
                                part_reps_display = ar_nums(val.toString())
                                save_settings('part_reps', val.toString())
                            }}
                            class="mx-2 w-16 shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none max-[1235px]:w-8 max-[1000px]:w-16"
                        />
                        <Tooltip.Root openDelay={tooltip_delay}>
                            <Tooltip.Trigger
                                class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                                onclick={() => handle_part_reps_change(true)}
                            >
                                +
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>زيادة تكرار المقطع</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
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
                <Tooltip.Root openDelay={tooltip_delay}>
                    <Tooltip.Trigger
                        class="decrease flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                        onclick={() => handle_delay_change(false)}>–</Tooltip.Trigger
                    >
                    <Tooltip.Content>
                        <p>خفض مدة السكت</p>
                    </Tooltip.Content>
                </Tooltip.Root>
                <NumberInput
                    id="delay"
                    value={delay_value}
                    display_value={delay_value_display}
                    min={0}
                    max={5}
                    oninput={val => {
                        delay_value = val
                        delay_value_display = ar_nums(val.toString())
                        save_settings('delay', val.toString())
                    }}
                    class="mx-2 w-16 border-none shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
                <Tooltip.Root openDelay={tooltip_delay}>
                    <Tooltip.Trigger
                        class="increase flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg text-black shadow-sm transition-colors hover:bg-gray-200"
                        onclick={() => handle_delay_change(true)}
                    >
                        +
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>زيادة مدة السكت</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
        </div>
    </div>
</div>

<script>
import NumberInput from 'components/src/NumberInput.svelte'
import {ar_nums} from 'components/src/util'
import {onDestroy, onMount} from 'svelte'

import * as Tooltip from '$lib/components/ui/tooltip/index.js'

let {
    audio,
    part_start_input,
    part_end_input,
    save_settings,
    settings,
    on_start_change,
    total_verses_prop = 1,
    current_verse = 1,
    on_time_update,
} = $props()

let total_verses = $state(total_verses_prop)
let current_start = $state(1)
let current_end = $state(total_verses)
let all_reps = $state(1)
let part_reps = $state(1)
let delay_value = $state(0)
let tooltip_delay = $state(200)
let playback_rate = $state(1.0)
let playback_interval = $state(null)
let current_part_reps = $state(0)
let current_all_reps = $state(0)

let current_start_display = $state('١')
let current_end_display = $state(ar_nums(total_verses.toString()))
let all_reps_display = $state('١')
let part_reps_display = $state('١')
let delay_value_display = $state('٠')

$effect(() => {
    if (settings) {
        update_settings_from_parent(settings)
    }
})

$effect(() => {
    if (total_verses_prop !== total_verses) {
        total_verses = total_verses_prop
        current_end = total_verses
        current_end_display = ar_nums(total_verses.toString())
    }
})

$effect(() => {
    if (current_verse > 0) {
        is_verse_in_range(current_verse)
    }
})

const int_bound = (int, min, max) => Math.max(Math.min(int, max), min)

function update_settings_from_parent(settings_obj) {
    if (!settings_obj) return

    if (settings_obj['play_speed']) {
        const speed = parseFloat(settings_obj['play_speed'])
        playback_rate = speed
        if (audio) {
            audio.playbackRate = speed
        }
    }

    if (settings_obj['all_reps']) {
        const reps = parseInt(settings_obj['all_reps'], 10) || 1
        all_reps = reps
        all_reps_display = ar_nums(reps.toString())
    }

    if (settings_obj['part_reps']) {
        const reps = parseInt(settings_obj['part_reps'], 10) || 1
        part_reps = reps
        part_reps_display = ar_nums(reps.toString())
    }

    if (settings_obj['delay']) {
        const delay = parseFloat(settings_obj['delay']) || 0
        delay_value = delay
        delay_value_display = ar_nums(delay.toString())
    }

    current_start = 1
    current_start_display = ar_nums('١')

    current_end = total_verses
    current_end_display = ar_nums(total_verses.toString())
}

onMount(() => {
    update_settings_from_parent(settings)
    setup_button_interactions()

    current_end = total_verses
    current_end_display = ar_nums(total_verses.toString())
})

onDestroy(() => {
    if (playback_interval) {
        clearInterval(playback_interval)
    }
})

function handle_start_change(increase) {
    const new_value = int_bound(current_start + (increase ? 1 : -1), 1, total_verses)
    current_start = new_value
    current_start_display = ar_nums(new_value.toString())
    notify_current_part_change(new_value)
}

function handle_end_change(increase) {
    const new_value = int_bound(current_end + (increase ? 1 : -1), 1, total_verses)
    current_end = new_value
    current_end_display = ar_nums(new_value.toString())
}

function handle_start_input_change(val) {
    current_start = val
    current_start_display = ar_nums(val.toString())
    notify_current_part_change(val)
}

function handle_end_input_change(val) {
    const validated_val = Math.min(val, total_verses)
    current_end = validated_val
    current_end_display = ar_nums(validated_val.toString())
}

function notify_current_part_change(new_value) {
    if (on_start_change) {
        on_start_change({detail: {value: new_value}})
    }
}

function handle_button_action(e, action) {
    const button = e.currentTarget
    const is_increase = button.classList.contains('increase')

    if (action === 'speed') {
        handle_speed_change(is_increase)
    } else if (action === 'skip') {
        handle_skip(is_increase)
    }

    if (playback_interval) {
        clearInterval(playback_interval)
    }

    playback_interval = setInterval(() => {
        if (action === 'speed') {
            handle_speed_change(is_increase)
        } else if (action === 'skip') {
            handle_skip(is_increase)
        }
    }, 150)
}

function setup_button_interactions() {
    const speed_buttons = document.querySelectorAll('.speed')
    const skip_buttons = document.querySelectorAll('.skip')

    speed_buttons.forEach(btn => {
        btn.addEventListener('mousedown', e => handle_button_action(e, 'speed'))
        btn.addEventListener('touchstart', e => handle_button_action(e, 'speed'))
    })

    skip_buttons.forEach(btn => {
        btn.addEventListener('mousedown', e => handle_button_action(e, 'skip'))
        btn.addEventListener('touchstart', e => handle_button_action(e, 'skip'))
    })

    window.addEventListener('mouseup', clear_action_interval)
    window.addEventListener('touchend', clear_action_interval)
}

function clear_action_interval() {
    if (playback_interval) {
        clearInterval(playback_interval)
        playback_interval = null
    }
}

function handle_speed_change(increase) {
    if (!audio) return

    const new_rate = int_bound(audio.playbackRate + 0.1 * (increase ? 1 : -1), 0.4, 4)
    audio.playbackRate = new_rate
    playback_rate = new_rate

    save_settings('play_speed', new_rate.toFixed(2))
}

function handle_skip(increase) {
    if (!audio) return
    audio.currentTime += 5 * (increase ? 1 : -1)
}

function handle_all_reps_change(increase) {
    const new_value = int_bound(all_reps + (increase ? 1 : -1), 1, 10)
    all_reps = new_value
    all_reps_display = ar_nums(new_value.toString())
    if (part_start_input) {
        part_start_input.value = new_value
    }
    save_settings('all_reps', new_value.toString())
}

function handle_part_reps_change(increase) {
    const new_value = int_bound(part_reps + (increase ? 1 : -1), 1, 10)
    part_reps = new_value
    part_reps_display = ar_nums(new_value.toString())
    if (part_end_input) {
        part_end_input.value = new_value
    }
    save_settings('part_reps', new_value.toString())
}

function handle_delay_change(increase) {
    const new_value = int_bound(delay_value + (increase ? 1 : -1), 0, 5)
    delay_value = new_value
    delay_value_display = ar_nums(new_value.toString())
    save_settings('delay', new_value.toString())
}

function handle_time_update() {
    if (!audio) return

    if (audio.currentTime >= audio.duration - 0.2) {
        audio.pause()

        if (part_reps > 1 && current_part_reps < part_reps - 1) {
            current_part_reps++
            setTimeout(() => {
                audio.currentTime = 0
                audio.play()
            }, delay_value * 1000)
        } else {
            current_part_reps = 0
            handle_verse_completed({detail: {current_verse: current_start}})
        }
        return
    }

    if (on_time_update) {
        on_time_update(audio)
    }
}

function handle_verse_completed(e) {
    if (!audio) return

    const current_verse = e.detail.current_verse

    if (current_verse >= current_end) {
        if (all_reps > 1 && current_all_reps < all_reps - 1) {
            current_all_reps++
            current_start = 1
            current_start_display = ar_nums('١')

            notify_current_part_change(1)

            setTimeout(() => {
                audio.currentTime = 0
                audio.play()
            }, delay_value * 1000)
        } else {
            current_all_reps = 0
            current_part_reps = 0
            audio.pause()
            audio.currentTime = 0
        }
    } else {
        const next_verse = current_verse + 1
        current_start = next_verse
        current_start_display = ar_nums(next_verse.toString())

        notify_current_part_change(next_verse)

        setTimeout(() => {
            audio.currentTime = 0
            audio.play()
        }, delay_value * 1000)
    }
}

function is_verse_in_range(verse) {
    const in_range = verse >= current_start && verse <= current_end
    if (!in_range && audio) {
        audio.pause()
        audio.currentTime = 0
        current_all_reps = 0
        current_part_reps = 0
    }
    return in_range
}
</script>

<style>
#player-cont {
    font-family: 'Noto';
}

.katab {
    font-family: 'Kitab';
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
