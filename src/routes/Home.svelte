<script>
  // @ts-nocheck
  import { onMount, onDestroy } from 'svelte';
  import Footer from '../components/Footer.svelte';
  import PlayerControls from '../components/PlayerControls.svelte';
  import TextDisplay from '../components/TextDisplay.svelte';
  import MatnSelector from '../components/MatnSelector.svelte';
  
  // State management using Svelte 5 reactive state
  let state = $state({
    all_reps: 1,
    part_reps: 1,
    cur: 1,
    segs: [],
    title: []
  });
  
  let settings = $state(
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

      // Add event listener for timeupdate events from PlayerControls
      document.addEventListener('timeupdate', (e) => {
        if (e.detail) {
          handleTimeUpdate(e.detail);
        }
      });
    } catch (error) {
      console.error("Error in Home onMount:", error);
    }
  });
  
  onDestroy(() => {
    if (audio) {
      audio.pause();
    }
    // Clean up event listener
    document.removeEventListener('timeupdate', handleTimeUpdate);
  });
  
  function saveSettings(id, value) {
    const element = document.getElementById(id);
    if (!element || !element.validity.valid) return;
    
    settings = { ...settings, [id]: value };
    localStorage.setItem('settings', JSON.stringify(settings));
  }
  
  function loadMatn(matnName, matnId) {
  console.log(`Loading matn: ${matnName}`);
  
  fetch(`/data/الأرجوزة الميئية.txt`, { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) {
        console.error(`HTTP error: ${r.status} ${r.statusText}`);
        throw new Error(`Failed to fetch matn data: ${r.status} ${r.statusText}`);
      }
      return r.text();
    })
    .then(t => {
      // طباعة محتوى الملف للتصحيح
      console.log("Raw file content (first 200 chars):", t.substring(0, 200));
      console.log("Content length:", t.length);
      
      // التحقق من خلو الملف
      if (!t || t.trim() === '') {
        console.error("Empty file content");
        return;
      }
      
      // محاولة تقسيم النص بطرق مختلفة
      const lines = t.split('\n');
      console.log("File has", lines.length, "lines");
      
      if (lines.length < 2) {
        console.error("File has less than 2 lines");
        return;
      }
      
      // رابط الصوت في السطر الأول
      const audioUrl = lines[0].trim();
      console.log("Audio URL:", audioUrl);
      
      // نحاول تحديد الأجزاء يدويًا
      const segments = [];
      let currentTitle = matnName;
      let currentDescription = "";
      
      // البحث عن الأجزاء التي تبدأ بـ #
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('# ')) {
          // جزء جديد
          const parts = line.substring(2).split(' ', 1);
          const timing = parseFloat(parts[0]);
          
          if (!isNaN(timing)) {
            // هذا سطر توقيت (# 10.5)
            const text = lines[i+1] ? lines[i+1].trim() : "";
            let description = "";
            
            // جمع سطور الوصف حتى الجزء التالي
            let j = i + 2;
            while (j < lines.length && !lines[j].trim().startsWith('# ')) {
              description += lines[j] + '\n';
              j++;
            }
            
            segments.push({
              timing: timing,
              text: text,
              description: description.trim()
            });
            
            // إذا كان التوقيت هو 0، نعتبره العنوان
            if (timing === 0) {
              currentTitle = text;
              currentDescription = description.trim();
            }
            
            i = j - 1; // نتخطى السطور التي قرأناها بالفعل
          }
        }
      }
      
      console.log("Found", segments.length, "segments");
      
      if (segments.length === 0) {
        console.error("No segments found in the file");
        return;
      }
      
      // إعداد مشغل الصوت
      const oldPlaybackRate = audio ? audio.playbackRate : 1;
      
      if (!audio) {
        audio = document.querySelector('audio');
        if (!audio) {
          console.error("Audio element not found");
          return;
        }
      }
      
      // تعيين مصدر الصوت
      audio.src = audioUrl;
      audio.playbackRate = oldPlaybackRate;
      
      // تحديث حالة التطبيق
      state.title = currentTitle;
      state.segs = segments.map(seg => {
        return [seg.timing, seg.text, seg.description];
      });
      
      console.log("State updated with", state.segs.length, "segments");
      
      // تحديث عنوان الصفحة
      location.hash = matnId.replaceAll(' ', '-');
      document.title = `${matnName} | مقرئ المتون`;
      
      // تحديث عناصر التحكم
      if (partStartInput && partEndInput) {
        partStartInput.value = 1;
        const maxValue = state.segs.length;
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
      
      // محاولة استخدام مسار بديل
      console.log("Trying alternate path...");
      fetch(`/data/الأرجوزة الميئية.txt`, { cache: 'no-cache' })
        .then(r => {
          console.log("Alternate path result:", r.status, r.ok);
          if (!r.ok) {
            console.error("Alternate path also failed");
          }
        })
        .catch(e => console.error("Alternate path error:", e));
    });
}
  
function loadPart() {
  if (!textContainerEl || !tplContEl || !audio) {
    console.error("Required elements not found for loadPart");
    return;
  }
  
  if (!state.segs || state.segs.length === 0) {
    console.error("No segs data available");
    return;
  }
  
  let cur = state.segs[state.cur];
  if (!cur) {
    console.error("Current segment not found, cur =", state.cur);
    return;
  }

  textContainerEl.style.opacity = 0;

  setTimeout(() => {
    try {
      // للعنوان (الجزء الأول)
      if (state.cur === 0) {
        // إذا كان جزء العنوان
        let titleText = typeof state.title === 'string' ? state.title : cur[1];
        let descText = cur[2] || "";
        tplContEl.innerHTML = renderTitle(titleText, descText);
      } 
      // للأبيات العادية
      else if (cur[1] && cur[1].includes('=')) {
        // إذا كان بيت شعري يحتوي على علامة =
        tplContEl.innerHTML = renderBayt(cur[1].split('='), cur[2] || "");
      } 
      // للنصوص التي لا تحتوي على علامة =
      else {
        // إذا كان نص عادي
        if (cur[1]) {
          tplContEl.innerHTML = renderTitle(cur[1], cur[2] || "");
        } else {
          // إذا لم يكن هناك نص أصلاً
          tplContEl.innerHTML = renderTitle("جزء فارغ", "");
        }
      }

      textContainerEl.style.opacity = 1;
    } catch (error) {
      console.error("Error rendering content:", error, cur);
      tplContEl.innerHTML = renderTitle("خطأ في عرض المحتوى", "يرجى المحاولة مرة أخرى");
      textContainerEl.style.opacity = 1;
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
  // إذا كان b مصفوفة بها عنصر واحد فقط، أضف نفس النص في الشطر الثاني
  if (b.length === 1) {
    b[1] = b[0];
  }
  
  // إذا كان b غير محدد أو فارغ، استخدم قيمة افتراضية
  let first = b[0] || "";
  let second = b[1] || "";
  
  return `
    <div class="matn">
      <div id="part-no">${arNums(state.cur + 1)}</div>
      <div class="first">${first}</div><div class="second">${second}</div>
    </div>
    <div class="sharh">${sharh || ""}</div>`;
}
  
  function arNums(s) {
    return ('' + s).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'.substr(+d, 1));
  }
  
  function partDone() {
    if (!audio || !partStartInput) return;
    
    if (!state.segs || state.segs.length === 0) return;
    
    const delay = document.getElementById('delay');
    const partReps = document.getElementById('part-reps');
    const partEnd = document.getElementById('part-end');
    const allReps = document.getElementById('all-reps');
    
    if (!delay || !partReps || !partEnd || !allReps) {
      console.error("Required input elements not found");
      return;
    }
    
    let lastDur = state.segs[state.cur + 1][0] - state.segs[state.cur][0];
    let delayTime = +delay.value.slice(0, -1) * lastDur * 1000;
    let partRepsVal = +partReps.value;
    let partEndVal = +partEnd.value;
  
    if (
      (state.cur + 1) === partEndVal && 
      state.all_reps === +allReps.value && 
      state.part_reps === partRepsVal
    ) {
      audio.pause();
      resetState();
      return;
    }
  
    if (state.part_reps === partRepsVal) {
      state.part_reps = 0;
      state.cur++;
    }
  
    state.part_reps++;
  
    if ((state.cur + 1) > partEndVal) {
      audio.pause();
      state.cur = +partStartInput.value - 1;
      state.all_reps++;
      if (clicker) {
        clicker.volume = 0.75;
        clicker.play();
      }
      delayTime = delayTime || 750;
    }
  
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
  
  if (!state.segs || state.segs.length === 0) {
    console.error("No segs data available");
    return;
  }
  
  partProgressEl.style.width = 0;
  
  state.all_reps = 1;
  state.part_reps = 1;
  state.cur = 0; // نبدأ من العنوان
  
  audio.currentTime = 0;
  audio.pause();
  
  loadPart();
  
  console.log("State reset completed. Current segment:", state.cur);
}
  
  function seek(dir) {
    if (!audio) return;
    
    if (!state.segs || state.segs.length === 0) return;
    
    audio.pause();
    
    if (dir === 1) {
      for (; audio.currentTime > state.segs[state.cur][0]; state.cur++);
      state.cur--; // Go to start of part
    } else {
      for (; state.cur && audio.currentTime < state.segs[state.cur][0]; state.cur--);
    }
    
    audio.currentTime = state.segs[state.cur][0];
    
    loadPart();
    audio.play();
  }
  
  function handleTimeUpdate(audioEl) {
    if (!audioEl || audioEl.paused || !partProgressEl) return;
  
    if (!state.segs || state.segs.length === 0) return;
    
    let curTime = audioEl.currentTime;
    let partTime = state.segs[state.cur][0];
    let nextTime = state.cur < state.segs.length - 1 
      ? state.segs[state.cur + 1][0] 
      : audioEl.duration;
  
    if (state.cur > 0 && curTime < partTime) {
      seek(-1);
      return;
    }
  
    if (state.cur < (state.segs.length - 2) && curTime > state.segs[state.cur + 2][0]) {
      seek(1);
      return;
    }
  
    // Title -> first part
    if (state.cur === 0 && curTime < partTime && curTime >= (partTime - 0.35)) {
      loadPart();
    }
  
    // Normal playback
    if (curTime >= nextTime) {
      partDone();
    }
  
    partProgressEl.style.width = ((curTime - partTime) / (nextTime - partTime) * 100) + '%';
  }
  
// في ملف Home.svelte - قم باستبدال الدالة handleMatnChange بهذه الدالة البسيطة
function handleMatnChange(e) {
  console.log("handleMatnChange triggered");
  
  // استخدم querySelector مباشرة لأخذ القيمة المختارة
  const select = document.getElementById('matn-select');
  if (!select) {
    console.error("Select element not found");
    return;
  }
  
  const selectedValue = select.value;
  const selectedText = select.options[select.selectedIndex].text;
  
  console.log(`Loading matn: ${selectedText} (${selectedValue})`);
  
  // استدعاء loadMatn بالقيمة المختارة
  loadMatn(selectedText, selectedValue);
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
    audio={audio}
    partStartInput={partStartInput}
    partEndInput={partEndInput}
    saveSettings={saveSettings}
    settings={settings}
  />
  
  <Footer />
</main>
  
<style>
  /* Component-specific styles */
  :global(.rtl) {
    direction: rtl;
  }
</style>