<script>
// @ts-nocheck

    import { onMount, createSignal, onDestroy } from 'svelte';
    
    // Props
    export let audio;
    export let partStartInput;
    export let partEndInput;
    export let saveSettings;
    export let settings;
    
    // Local state
    const [playbackRate, setPlaybackRate] = createSignal(1.00);
    let playbackInterval;
    
    // Utility functions
    const intBound = (int, min, max) => Math.max(Math.min(int, max), min);
    
    onMount(() => {
      // Initialize controls with saved settings
      const savedSettings = settings();
      
      Object.keys(savedSettings)
        .filter(id => document.getElementById(id))
        .forEach(id => {
          document.getElementById(id).value = savedSettings[id];
        });
        
      // Set initial playback rate from settings
      if (audio && savedSettings['play-speed']) {
        audio.playbackRate = parseFloat(savedSettings['play-speed']);
        setPlaybackRate(audio.playbackRate);
      }
    });
  
    onDestroy(() => {
      if (playbackInterval) {
        clearInterval(playbackInterval);
      }
    });
    
    function handleButtonAction(e, action) {
      // Extract the information from the button clicked
      const button = e.currentTarget;
      const isIncrease = button.classList.contains('increase');
      
      // Execute the appropriate action
      if (action === 'speed') {
        handleSpeedChange(isIncrease);
      } else if (action === 'skip') {
        handleSkip(isIncrease);
      } else if (action === 'spinner') {
        // Get the associated input
        const input = isIncrease ? 
          button.previousElementSibling : 
          button.nextElementSibling;
        handleRepChange(input, isIncrease);
      }
      
      // Set up continuous action on long press
      if (playbackInterval) {
        clearInterval(playbackInterval);
      }
      
      playbackInterval = setInterval(() => {
        if (action === 'speed') {
          handleSpeedChange(isIncrease);
        } else if (action === 'skip') {
          handleSkip(isIncrease);
        } else if (action === 'spinner') {
          const input = isIncrease ? 
            button.previousElementSibling : 
            button.nextElementSibling;
          handleRepChange(input, isIncrease);
        }
      }, 150);
    }
    
    // Add event listeners for mouseup and touchend to clear interval
    function setupButtonInteractions() {
      // Button interactions for speed and skip
      const speedButtons = document.querySelectorAll('.speed');
      const skipButtons = document.querySelectorAll('.skip');
      const spinnerButtons = document.querySelectorAll('.spinner-cont button');
      
      // Add mousedown events
      speedButtons.forEach(btn => {
        btn.addEventListener('mousedown', (e) => handleButtonAction(e, 'speed'));
        btn.addEventListener('touchstart', (e) => handleButtonAction(e, 'speed'));
      });
      
      skipButtons.forEach(btn => {
        btn.addEventListener('mousedown', (e) => handleButtonAction(e, 'skip'));
        btn.addEventListener('touchstart', (e) => handleButtonAction(e, 'skip'));
      });
      
      spinnerButtons.forEach(btn => {
        btn.addEventListener('mousedown', (e) => handleButtonAction(e, 'spinner'));
        btn.addEventListener('touchstart', (e) => handleButtonAction(e, 'spinner'));
      });
      
      // Global handlers to clear interval
      document.documentElement.addEventListener('mouseup', clearActionInterval);
      document.documentElement.addEventListener('touchend', clearActionInterval);
      
      // Number input keyboard handling
      const numberInputs = document.querySelectorAll('input[type="number"]');
      numberInputs.forEach(input => {
        input.addEventListener('keydown', handleNumberInputKeydown);
      });
    }
    
    function clearActionInterval() {
      if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
      }
    }
    
    function handleNumberInputKeydown(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const targetButton = e.key === 'ArrowDown' ? 
          e.target.previousElementSibling : 
          e.target.nextElementSibling;
        
        handleRepChange(e.target, e.key === 'ArrowUp');
      }
    }
    
    function handleSpeedChange(increase) {
      if (!audio) return;
      
      const newRate = intBound(audio.playbackRate + (0.1 * (increase ? 1 : -1)), 0.4, 4);
      audio.playbackRate = newRate;
      setPlaybackRate(newRate);
      
      // Update display
      const speedDisplay = document.getElementById('play-speed');
      if (speedDisplay) {
        const span = speedDisplay.querySelector('span');
        if (span) {
          span.textContent = newRate.toFixed(2) + 'x';
        }
      }
      
      // Save setting
      saveSettings('play-speed', newRate.toString());
    }
    
    function handleSkip(increase) {
      if (!audio) return;
      audio.currentTime += 5 * (increase ? 1 : -1);
    }
    
    function handleRepChange(el, increase) {
      if (!el) return;
      
      const id = el.id;
      let val = el.value;
      
      if (el.type === 'number') {
        val = +val + (increase ? 1 : -1);
        if (val > el.max) {
          val = 1;
        } else if (val === 0) {
          val = +el.max;
        }
      } else if (id.endsWith('-reps')) {
        if (val === '∞') {
          val = increase ? 1 : 10;
        } else {
          val = +val + (increase ? 1 : -1);
        }
        if (val === 0 || val === 11) {
          val = '∞';
        }
      } else if (id === 'delay') {
        val = +(val.slice(0, -1)) + (increase ? 0.5 : -0.5);
        if (val === 2.5) {
          val = 2;
        } else if (val === -0.5) {
          val = 0;
        }
        val += 'x';
      }
      
      el.value = val;
      el.classList[el.validity.valid ? 'remove' : 'add']('invalid');
      saveSettings(id, val);
    }
    
    function handleInputChange(e) {
      const el = e.target;
      el.classList.toggle('invalid', !el.validity.valid);
      saveSettings(el.id, el.value);
    }
    
    // Setup button interactions after component mounts
    onMount(setupButtonInteractions);
  </script>
  
  <div id="player-cont" class="rounded-lg shadow-md p-6 mb-6 bg-gray-100">
    <!-- Audio Player -->
    <audio 
      bind:this={audio} 
      preload="metadata" 
      controls 
      controlsList="nodownload"
      class="w-full mb-4"
    ></audio>
    
    <!-- Playback Controls -->
    <div id="seek-btns" class="flex flex-wrap items-center justify-center mb-6">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button 
        class="speed decrease bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-1"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 8L6 14L12 20" />
        </svg>
      </button>
      
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label id="play-speed" class="mx-2 text-center">
        <svg class="h-6 w-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <br/>
        <span>{playbackRate().toFixed(2)}x</span>
      </label>
      
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button 
        class="speed increase bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-1"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 8L18 14L12 20" />
        </svg>
      </button>
      
      <span class="sep mx-4"></span>
      
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button 
        class="skip decrease bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-1"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
        </svg>
      </button>
      
      <span class="mx-2"></span>
      
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button 
        class="skip increase bg-gray-200 hover:bg-gray-300 rounded-full p-2 mx-1"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
        </svg>
      </button>
    </div>
    
    <!-- Repeat & Range Controls -->
    <div id="repeat-cont" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Range Controls -->
      <div class="spinner-cont">
        <div class="flex items-center justify-between mb-4">
          <p class="ml-2">من </p>
          <button 
            class="decrease bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >–</button>
          <input 
            type="number" 
            class="spinner border rounded px-2 py-1 w-16 text-center mx-2" 
            id="part-start" 
            bind:this={partStartInput}
            value="1" 
            min="1" 
            required
            on:input={handleInputChange}
          >
          <button 
            class="increase bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >+</button>
        </div>
        
        <div class="flex items-center justify-between">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="ml-2">إلى </label>
          <button 
            class="decrease bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >–</button>
          <input 
            type="number" 
            class="spinner border rounded px-2 py-1 w-16 text-center mx-2" 
            id="part-end" 
            bind:this={partEndInput}
            value="1" 
            min="1" 
            required
            on:input={handleInputChange}
          >
          <button 
            class="increase bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >+</button>
        </div>
      </div>
      
      <!-- Repetition Controls -->
      <div class="spinner-cont">
        <div class="flex items-center justify-between mb-4">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="flex items-center">
            <svg class="h-6 w-6 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
          </label>
          <button 
            class="decrease bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >–</button>
          <input 
            type="text" 
            class="spinner border rounded px-2 py-1 w-16 text-center mx-2" 
            id="all-reps" 
            value="1" 
            readonly
          >
          <button 
            class="increase bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >+</button>
        </div>
        
        <div class="flex items-center justify-between">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="flex items-center">
            <svg class="h-6 w-6 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M17 13v-1.5a2.5 2.5 0 012.5-2.5 2.5 2.5 0 012.5 2.5v1.5" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
          </label>
          <button 
            class="decrease bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >–</button>
          <input 
            type="text" 
            class="spinner border rounded px-2 py-1 w-16 text-center mx-2" 
            id="part-reps" 
            value="1" 
            readonly
          >
          <button 
            class="increase bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >+</button>
        </div>
      </div>
      
      <!-- Delay Controls -->
      <div class="spinner-cont">
        <h3 class="flex items-center justify-center mb-4 text-lg font-medium">
          <svg class="h-6 w-6 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 2v3M19 2v3M1 8h22M12 17l-1 2-2 1h14l-2-1-1-2" />
            <path d="M6 10v4M18 10v4" />
          </svg>
          السكت
        </h3>
        <div class="flex items-center justify-center">
          <button 
            class="decrease bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >–</button>
          <input 
            type="text" 
            class="spinner border rounded px-2 py-1 w-16 text-center mx-2" 
            id="delay" 
            value="0x" 
            readonly
          >
          <button 
            class="increase bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
          >+</button>
        </div>
      </div>
    </div>
  </div>
  
  <style>

  </style>