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

    <div id="seek-btns" class="mb-8 font-sans flex flex-wrap items-center justify-center gap-2">
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

            <p class="mx-2 text-sm font-medium text-black z-50">5s</p>
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

    <div id="repeat-cont" class="font-sans grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="spinner-cont control-card rounded-lg bg-white p-4 shadow-sm">
            <h3 class="mb-4 text-center text-lg font-medium text-gray-700 katab">نطاق التشغيل</h3>
            <div>
                <div class="mb-5 flex items-center justify-between">
                    <p class="ml-3 font-medium text-gray-600 text-sm sm:text-lg katab">من</p>
                    <div class="flex">
                        <Button
                            class="decrease flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Decrease start">–</Button
                        >
                        <input
                            type="number"
                            class="spinner mx-2 w-16 max-[1235px]:w-8 max-[1000px]:w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            id="part-start"
                            bind:this={part_start_input}
                            value="1"
                            min="1"
                            required
                            oninput={handle_input_change}
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Increase start">+</Button
                        >
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <p class="ml-3 font-medium text-gray-600 text-sm sm:text-lg katab">إلى</p>
                    <div class="flex">
                        <Button
                            class="decrease flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Decrease end">–</Button
                        >
                        <input
                            type="number"
                            class="spinner mx-2 w-16 max-[1235px]:w-8 max-[1000px]:w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            id="part-end"
                            bind:this={part_end_input}
                            value="1"
                            min="1"
                            required
                            oninput={handle_input_change}
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                            aria-label="Increase end">+</Button
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="spinner-cont control-card rounded-lg bg-white p-4 shadow-sm">
            <h3 class="mb-4 text-center text-lg font-medium text-gray-700 katab">التكرار</h3>
            <div>
                <div class="mb-5 flex items-center">
                    <div class="ml-2 flex items-center">
                        <svg
                            class="ml-2 h-6 w-6 max-[1235px]:w-5 max-[1235px]:h-5 text-blue-500"
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
                        <span class="text-gray-600 text-sm sm:text-lg katab">كامل</span>
                    </div>
                    <div class="mr-auto flex items-center">
                        <Button
                            class="decrease flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                            >–</Button
                        >
                        <input
                            type="text"
                            class="spinner mx-2 w-16 max-[1235px]:w-8 max-[1000px]:w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            id="all-reps"
                            value="1"
                            readonly
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                            >+</Button
                        >
                    </div>
                </div>

                <div class="flex items-center">
                    <div class="ml-2 flex items-center">
                        <svg
                            class="ml-2 h-6 w-6 text-blue-500 max-[1235px]:w-5 max-[1235px]:h-5"
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
                        <span class="text-gray-600 text-sm sm:text-lg katab">مقطع</span>
                    </div>
                    <div class="mr-auto flex items-center">
                        <Button
                            class="decrease flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                            >–</Button
                        >
                        <input
                            type="text"
                            class="spinner mx-2 w-16 max-[1235px]:w-8 max-[1000px]:w-16 rounded-md border border-gray-300 px-2 py-1 text-center shadow-inner focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            id="part-reps"
                            value="1"
                            readonly
                        />
                        <Button
                            class="increase flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
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
                <span class="mr-2 katab">السكت</span>
            </h3>
            <div class="flex items-center justify-center">
                <Button
                    class="decrease flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
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
                    class="increase flex h-8 w-8 items-center text-lg justify-center rounded-full bg-gray-100 text-black shadow-sm transition-colors hover:bg-gray-200"
                    >+</Button
                >
            </div>
        </div>
    </div>
</div>

<script>
// @ts-nocheck
import {onDestroy, onMount} from 'svelte'

import Button from '~/lib/components/ui/button/button.svelte'

let {audio, part_start_input, part_end_input, save_settings, settings} = $props()

let playback_rate = $state(1.0)
let playback_interval

const int_bound = (int, min, max) => Math.max(Math.min(int, max), min)

onMount(() => {
    const saved_settings = settings

    Object.keys(saved_settings)
        .filter(id => document.querySelector(`#${id}`))
        .forEach(id => {
            document.querySelector(`#${id}`).value = saved_settings[id]
        })

    if (audio && saved_settings['play-speed']) {
        audio.playbackRate = parseFloat(saved_settings['play-speed'])
        playback_rate = audio.playbackRate
    }
})

onDestroy(() => {
    if (playback_interval) {
        clearInterval(playback_interval)
    }
})

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
    const speed_buttons = document.querySelectorAll('.speed');
    const skip_buttons = document.querySelectorAll('.skip');
    
    // Make sure we're targeting the correct buttons for increase/decrease
    const spinner_buttons = document.querySelectorAll('.spinner-cont .increase, .spinner-cont .decrease');

    speed_buttons.forEach(btn => {
        btn.addEventListener('mousedown', e => handle_button_action(e, 'speed'));
        btn.addEventListener('touchstart', e => handle_button_action(e, 'speed'));
    });

    skip_buttons.forEach(btn => {
        btn.addEventListener('mousedown', e => handle_button_action(e, 'skip'));
        btn.addEventListener('touchstart', e => handle_button_action(e, 'skip'));
    });

    spinner_buttons.forEach(btn => {
        // Direct event handling for spinner buttons for reliability
        btn.addEventListener('mousedown', e => {
            const isIncrease = btn.classList.contains('increase');
            const input = isIncrease ? btn.previousElementSibling : btn.nextElementSibling;
            
            // Immediately handle the click
            handle_rep_change(input, isIncrease);
            
            // Set up interval for holding the button
            if (playback_interval) {
                clearInterval(playback_interval);
            }
            
            playback_interval = setInterval(() => {
                handle_rep_change(input, isIncrease);
            }, 150);
        });
        
        btn.addEventListener('touchstart', e => {
            const isIncrease = btn.classList.contains('increase');
            const input = isIncrease ? btn.previousElementSibling : btn.nextElementSibling;
            
            // Immediately handle the tap
            handle_rep_change(input, isIncrease);
            
            // Set up interval for holding the button
            if (playback_interval) {
                clearInterval(playback_interval);
            }
            
            playback_interval = setInterval(() => {
                handle_rep_change(input, isIncrease);
            }, 150);
        });
    });

    document.documentElement.addEventListener('mouseup', clear_action_interval);
    document.documentElement.addEventListener('touchend', clear_action_interval);

    const number_inputs = document.querySelectorAll('input[type="number"]');
    number_inputs.forEach(input => {
        input.addEventListener('keydown', handle_number_input_keydown);
    });
}

function clear_action_interval() {
    if (playback_interval) {
        clearInterval(playback_interval)
        playback_interval = null
    }
}

function handle_number_input_keydown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const target_button =
            e.key === 'ArrowDown' ? e.target.previousElementSibling : e.target.nextElementSibling;

        handle_rep_change(e.target, e.key === 'ArrowUp');
    } else if (e.key === '-') {
        // Prevent entering negative sign
        e.preventDefault();
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
        return;
    }

    const id = el.id;
    let val = el.value;
    

    if (el.type === 'number') {
        // Always convert to a number first
        val = parseInt(val, 10) || 1;
        val = val + (increase ? 1 : -1);
        
        // Set limits - never go below 1
        if (val < 1) {
            val = 1;
        } else if (val > parseInt(el.max, 10)) {
            val = parseInt(el.max, 10);
        }
    } else if (id.endsWith('-reps')) {
        if (val === '∞') {
            val = increase ? 1 : 10;
        } else {
            val = parseInt(val, 10) + (increase ? 1 : -1);
        }
        if (val === 0 || val === 11) {
            val = '∞';
        }
    } else if (id === 'delay') {
        val = parseFloat(val.slice(0, -1)) + (increase ? 0.5 : -0.5);
        if (val === 2.5) {
            val = 2;
        } else if (val < 0) {
            val = 0;
        }
        val += 'x';
    }

    // Update the element's value directly
    el.value = val;
    console.log(`New value for ${id}: ${val}`);
    
    el.classList[el.validity.valid ? 'remove' : 'add']('invalid');
    save_settings(id, val.toString());
    
    // If this is the start input changing, update the current displayed part
    if (id === 'part-start') {
        const event = new CustomEvent('start-input-change', {
            detail: { value: parseInt(val, 10) }
        });
        document.dispatchEvent(event);
    }
}

function handle_input_change(e) {
    const el = e.target;
    
    // Make sure we have a valid number
    if (el.type === 'number') {
        let val = parseInt(el.value, 10);
        
        // Prevent negative values
        if (isNaN(val) || val < 1) {
            val = 1;
            el.value = val;
        }
    }
    
    el.classList.toggle('invalid', !el.validity.valid);
    save_settings(el.id, el.value);
    
    // If this is the start input changing, update the current displayed part
    if (el.id === 'part-start' && parseInt(el.value, 10) > 0) {
        const event = new CustomEvent('start-input-change', {
            detail: { value: parseInt(el.value, 10) }
        });
        document.dispatchEvent(event);
    }
}

onMount(setup_button_interactions)

function handle_time_update() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const event = new CustomEvent('timeupdate', {detail: audio})
        document.dispatchEvent(event)
    }
}
</script>

<style>
#player-cont {
    font-family: 'Noto';
}

.katab{
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
