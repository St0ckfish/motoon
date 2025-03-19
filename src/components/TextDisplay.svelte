<script>
    
    export let textContainerEl;
    export let tplContEl;
    export let partProgressEl;
  </script>
  
  <div 
    id="text" 
    bind:this={textContainerEl} 
    class="bg-white rounded-lg shadow-md p-6 mb-6 transition-opacity duration-250 relative min-h-64"
  >
    <div 
      id="part-progress" 
      bind:this={partProgressEl} 
      class="absolute top-0 left-0 h-1 bg-blue-500 transition-width duration-100"
    ></div>
    <div 
      id="tpl-cont" 
      bind:this={tplContEl} 
      class="text-center"
    ></div>
  </div>
  
  <style>
    #text {
      opacity: 1;
    }
    
    /* Styles for the rendered matn content */
    :global(.title) {
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1rem;
    }
    
    :global(.desc) {
      font-size: 1.2rem;
      text-align: center;
    }
    
    :global(.matn) {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    :global(#part-no) {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 1rem;
      color: #555;
    }
    
    :global(.first), :global(.second) {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0.5rem 0;
      text-align: center;
    }
    
    :global(.sharh) {
      font-size: 1.2rem;
      line-height: 1.6;
      margin-top: 1rem;
      white-space: pre-line;
    }
  </style>