<script>
  import { onMount } from 'svelte'
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger } from "../lib/components/ui/select"

  const { change } = $props();
  let currentValue = $state('');
  
  // Create a synthetic event object that mimics a regular select element's change event
  function createChangeEvent(value) {
    // Create a custom event object with the structure expected by the parent component
    return {
      target: {
        value: value,
        selectedIndex: 0,
        options: [{ text: value, value: value }]
      },
      detail: {
        target: {
          value: value,
          selectedIndex: 0,
          options: [{ text: value, value: value }]
        }
      }
    };
  }

  onMount(() => {
    // Get the text from the hash, replace hyphens with spaces
    const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ');

    if (hash) {
      currentValue = hash;
      if (typeof change === 'function') {
        change(createChangeEvent(hash));
      }
    }
  });

  function handleChange(value) {
    console.log("Selection changed to:", value);
    currentValue = value;
    
    if (typeof change === 'function') {
      const evt = createChangeEvent(value);
      console.log("Sending event:", evt);
      change(evt);
    }
  }
</script>

<div class="relative mx-auto mb-6 max-w-10/12">
<Select value={currentValue} onValueChange={handleChange}>
  <SelectTrigger class="text-lg w-full border border-gray-300 rounded">
    {#if currentValue}
      <span>{currentValue}</span>
    {:else}
      <span>اختر النص</span>
    {/if}
  </SelectTrigger>
  <SelectContent position="popper" sideOffset={5} class="max-h-72 overflow-y-auto z-50">
    <SelectGroup>
      <SelectLabel class="px-2 py-1 text-sm font-medium text-gray-500">متون</SelectLabel>
      <SelectItem value="الأرجوزة الميئية">الأرجوزة الميئية</SelectItem>
      <SelectItem value="الجزرية">الجزرية</SelectItem>
      <SelectItem value="تحفة الأطفال">تحفة الأطفال</SelectItem>
      <SelectItem value="نظم الآجرومية">نظم الآجرومية</SelectItem>
      <SelectItem value="نظم الورقات">نظم الورقات</SelectItem>
      <SelectItem value="الرحبية">الرحبية</SelectItem>
      <SelectItem value="نظم المقصود">نظم المقصود</SelectItem>
      <SelectItem value="نظم نخبة الفكر">نظم نخبة الفكر</SelectItem>
      <SelectItem value="مائة المعاني والبيان">مائة المعاني والبيان</SelectItem>
    </SelectGroup>
    
    <SelectSeparator class="h-px bg-gray-200 my-1" />
    
    <SelectGroup>
      <SelectLabel class="px-2 py-1 text-sm font-medium text-gray-500">المعلقات</SelectLabel>
      <SelectItem value="معلقة امرئ القيس">معلقة امرئ القيس</SelectItem>
      <SelectItem value="معلقة طرفة">معلقة طرفة</SelectItem>
      <SelectItem value="معلقة زهير">معلقة زهير</SelectItem>
      <SelectItem value="معلقة عمرو بن كلثوم">معلقة عمرو بن كلثوم</SelectItem>
      <SelectItem value="معلقة عنترة">معلقة عنترة</SelectItem>
      <SelectItem value="معلقة لبيد">معلقة لبيد</SelectItem>
      <SelectItem value="معلقة الحارث">معلقة الحارث</SelectItem>
      <SelectItem value="معلقة الأعشى">معلقة الأعشى</SelectItem>
      <SelectItem value="معلقة النابغة">معلقة النابغة</SelectItem>
      <SelectItem value="معلقة عبيد بن الأبرص">معلقة عبيد بن الأبرص</SelectItem>
    </SelectGroup>
    
    <SelectSeparator class="h-px bg-gray-200 my-1" />
    
    <SelectGroup>
      <SelectLabel class="px-2 py-1 text-sm font-medium text-gray-500">عيون الشعر</SelectLabel>
      <SelectItem value="لامية العرب">لامية العرب</SelectItem>
      <SelectItem value="البردة">البردة</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
</div>