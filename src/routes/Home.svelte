<script>
  // @ts-nocheck
  import { onMount, onDestroy, createSignal } from 'svelte';
  import Footer from '../components/Footer.svelte';
  import PlayerControls from '../components/PlayerControls.svelte';
  import TextDisplay from '../components/TextDisplay.svelte';
  import MatnSelector from '../components/MatnSelector.svelte';
  
  // State management
  const [state, setState] = createSignal({
    all_reps: 1,
    part_reps: 1,
    cur: 1,
    segs: [],
    title: []
  });
  
  const [settings, setSettings] = createSignal(
    JSON.parse(localStorage.getItem('settings') || '{}')
  );
  
  // Audio elements
  let audio;
  let clicker;
  
  // References to input elements
  let partStartInput;
  let partEndInput;
  let partProgressEl;
  let textContainerEl;
  let tplContEl;
  
  onMount(() => {
    console.log("Home component mounted");
    try {
      clicker = new Audio('click.mp3');
      
      // Initialize from URL hash if available
      const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ');
      
      // Load from hash or default - with added error handling
      const initialMatn = document.getElementById('matn-select');
      if (initialMatn) {
        if (hash && Array.from(initialMatn.options).map(o => o.value).includes(hash)) {
          initialMatn.value = hash;
        }
        if (initialMatn.selectedOptions && initialMatn.selectedOptions.length > 0) {
          loadMatn(initialMatn.selectedOptions[0].text, initialMatn.value);
        } else {
          console.warn("No matn selected");
        }
      } else {
        console.error("matn-select element not found");
      }
    } catch (error) {
      console.error("Error in Home onMount:", error);
    }
  });
  
  onDestroy(() => {
    if (audio) {
      audio.pause();
    }
  });
  
  function saveSettings(id, value) {
    const element = document.getElementById(id);
    if (!element || !element.validity.valid) return;
    
    const newSettings = {...settings()};
    newSettings[id] = value;
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  }
  
  function loadMatn(matnName, matnId) {
    console.log(`Loading matn: ${matnName}`);
    
    fetch(`data/${matnId}.txt`, { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) {
          throw new Error(`Failed to fetch matn data: ${r.status} ${r.statusText}`);
        }
        return r.text();
      })
      .then(t => {
        let parts = t.split('\n# ');
        const oldPlaybackRate = audio ? audio.playbackRate : 1;
        
        if (!audio) {
          audio = document.querySelector('audio');
          if (!audio) {
            console.error("Audio element not found");
            return;
          }
        }
        
        audio.src = parts[0];
        audio.playbackRate = oldPlaybackRate;
  
        const newState = {...state()};
        newState.title = parts[1].slice(2);
        newState.segs = parts.slice(2).map(p => {
          let segParts = p.split('\n');
          // Remove superfluous timing data
          segParts[0] = segParts[0].replace(/ \|.*/g, '');
          return [+segParts[0], segParts[1], (segParts.slice(2) || '').join('\n')];
        });
  
        newState.segs.forEach((c, i) => {
          if (['CONT', 'السابق'].includes(c[2])) {
            c[2] = newState.segs[i - 1][2];
          }
        });
  
        setState(newState);
  
        location.hash = matnId.replaceAll(' ', '-');
        document.title = `${matnName} | مقرئ المتون`;
  
        if (partStartInput && partEndInput) {
          partStartInput.value = 1;
          // Remove one as the last isn't a part
          const maxValue = newState.segs.length - 1;
          partEndInput.value = maxValue;
          partStartInput.max = maxValue;
          partEndInput.max = maxValue;
  
          resetState();
        } else {
          console.error("Input elements not found");
        }
      })
      .catch(error => {
        console.error("Error loading matn data:", error);
      });
  }
  
  function loadPart() {
    if (!textContainerEl || !tplContEl || !audio) {
      console.error("Required elements not found for loadPart");
      return;
    }
    
    const currentState = state();
    if (!currentState.segs || currentState.segs.length === 0) {
      console.error("No segs data available");
      return;
    }
    
    let cur = currentState.segs[currentState.cur];
    if (!cur) {
      console.error("Current segment not found");
      return;
    }
  
    textContainerEl.style.opacity = 0;
  
    setTimeout(() => {
      try {
        if (!audio.currentTime) {
          let parts = currentState.title.split('\n');
          tplContEl.innerHTML = renderTitle(parts[0], parts.slice(1).join('\n'));
        } else if (!cur[1].includes('=')) {
          let parts = cur[1].split('\n');
          tplContEl.innerHTML = renderTitle(parts[0], parts.slice(1).join('\n'));
        } else {
          tplContEl.innerHTML = renderBayt(cur[1].split('='), cur[2] || '');
        }
  
        textContainerEl.style.opacity = 1;
      } catch (error) {
        console.error("Error rendering content:", error);
      }
    }, 250);
  
    if (audio.currentTime > cur[0] + 1) {
      audio.currentTime = cur[0];
    }
  }
  
  function renderTitle(title, desc) {
    return `<div class="title">${title}</div><div class="desc">${desc}</div>`;
  }
  
  function renderBayt(b, sharh) {
    return `
      <div class="matn">
        <div id="part-no">${arNums(state().cur + 1)}</div>
        <div class="first">${b[0]}</div><div class="second">${b[1]}</div>
      </div>
      <div class="sharh">${sharh}</div>`;
  }
  
  function arNums(s) {
    return ('' + s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'.substr(+d, 1));
  }
  
  function partDone() {
    if (!audio || !partStartInput) return;
    
    const currentState = state();
    if (!currentState.segs || currentState.segs.length === 0) return;
    
    const delay = document.getElementById('delay');
    const partReps = document.getElementById('part-reps');
    const partEnd = document.getElementById('part-end');
    const allReps = document.getElementById('all-reps');
    
    if (!delay || !partReps || !partEnd || !allReps) {
      console.error("Required input elements not found");
      return;
    }
    
    let lastDur = currentState.segs[currentState.cur + 1][0] - currentState.segs[currentState.cur][0];
    let delayTime = +delay.value.slice(0, -1) * lastDur * 1000;
    let partRepsVal = +partReps.value;
    let partEndVal = +partEnd.value;
  
    if (
      (currentState.cur + 1) === partEndVal && 
      currentState.all_reps === +allReps.value && 
      currentState.part_reps === partRepsVal
    ) {
      audio.pause();
      resetState();
      return;
    }
  
    const newState = {...currentState};
  
    if (newState.part_reps === partRepsVal) {
      newState.part_reps = 0;
      newState.cur++;
    }
  
    newState.part_reps++;
  
    if ((newState.cur + 1) > partEndVal) {
      audio.pause();
      newState.cur = +partStartInput.value - 1;
      newState.all_reps++;
      if (clicker) {
        clicker.volume = 0.75;
        clicker.play();
      }
      delayTime = delayTime || 750;
    }
  
    setState(newState);
  
    if (delayTime) {
      audio.pause();
    }
  
    setTimeout(() => {
      loadPart();
      if (audio && audio.paused) {
        audio.play();
      }
    }, delayTime);
  }
  
  function resetState() {
    if (!partProgressEl || !audio || !partStartInput) {
      console.error("Required elements not found for resetState");
      return;
    }
    
    const currentState = state();
    if (!currentState.segs || currentState.segs.length === 0) {
      console.error("No segs data available");
      return;
    }
    
    partProgressEl.style.width = 0;
    
    const newState = {...currentState};
    newState.all_reps = 1;
    newState.part_reps = 1;
    newState.cur = +partStartInput.value - 1;
    setState(newState);
    
    audio.currentTime = newState.cur ? newState.segs[newState.cur][0] : 0;
    audio.pause();
    
    loadPart();
  }
  
  function seek(dir) {
    if (!audio) return;
    
    const currentState = state();
    if (!currentState.segs || currentState.segs.length === 0) return;
    
    audio.pause();
    
    const newState = {...currentState};
    
    if (dir === 1) {
      for (; audio.currentTime > newState.segs[newState.cur][0]; newState.cur++);
      newState.cur--; // Go to start of part
    } else {
      for (; newState.cur && audio.currentTime < newState.segs[newState.cur][0]; newState.cur--);
    }
    
    setState(newState);
    audio.currentTime = newState.segs[newState.cur][0];
    
    loadPart();
    audio.play();
  }
  
  function handleTimeUpdate() {
    if (!audio || audio.paused || !partProgressEl) return;
  
    const currentState = state();
    if (!currentState.segs || currentState.segs.length === 0) return;
    
    let curTime = audio.currentTime;
    let partTime = currentState.segs[currentState.cur][0];
    let nextTime = currentState.cur < currentState.segs.length - 1 
      ? currentState.segs[currentState.cur + 1][0] 
      : audio.duration;
  
    if (currentState.cur > 0 && curTime < partTime) {
      seek(-1);
      return;
    }
  
    if (currentState.cur < (currentState.segs.length - 2) && curTime > currentState.segs[currentState.cur + 2][0]) {
      seek(1);
      return;
    }
  
    // Title -> first part
    if (currentState.cur === 0 && curTime < partTime && curTime >= (partTime - 0.35)) {
      loadPart();
    }
  
    // Normal playback
    if (curTime >= nextTime) {
      partDone();
    }
  
    partProgressEl.style.width = ((curTime - partTime) / (nextTime - partTime) * 100) + '%';
  }
  
  function handleMatnChange(e) {
    if (e && e.target && e.target.selectedOptions && e.target.selectedOptions.length > 0) {
      loadMatn(e.target.selectedOptions[0].text, e.target.value);
    } else {
      console.error("Invalid event or missing selected option");
    }
  }
  </script>
  
  <main class="rtl container max-w-4xl mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold text-center mb-6">مُقرِئ المتون</h1>
    
    <MatnSelector on:change={handleMatnChange} />
    
    <TextDisplay 
      bind:textContainerEl 
      bind:tplContEl 
      bind:partProgressEl
    />
    
    <PlayerControls 
      bind:audio
      bind:partStartInput
      bind:partEndInput
      {saveSettings}
      {settings}
    />
    
    <Footer />
  </main>
  
  <style>
    /* Component-specific styles */
    :global(.rtl) {
      direction: rtl;
    }
  </style>