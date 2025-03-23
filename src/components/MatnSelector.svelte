<script>
    import { onMount } from 'svelte';
    import { ChevronUp, ChevronDown } from 'lucide-svelte';
    import * as Select from "$lib/components/ui/select";
  
    let { change } = $props();
    let currentValue = $state("");
    let selectContent;
  
    onMount(() => {
      const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ');
  
      if (hash) {
        currentValue = hash;
      }
  
      if (currentValue) {
        change({
          target: {
            value: currentValue,
            selectedOptions: [{ text: currentValue }]
          }
        });
      }
    });
  
    function handleValueChange(value) {
      currentValue = value;
      change({
        target: {
          value,
          selectedOptions: [{ text: value }]
        }
      });
    }
  
    function scrollUp() {
      if (selectContent) {
        selectContent.scrollTop -= 100;
      }
    }
  
    function scrollDown() {
      if (selectContent) {
        selectContent.scrollTop += 100;
      }
    }
  </script>
  
  <div class="relative mx-auto mb-6 max-w-10/12">
    <div class="flex">
      <Select.Root value={currentValue} onValueChange={handleValueChange}>
        <Select.Trigger class="w-full border border-gray-300 rounded text-lg">
          yyuyu
        </Select.Trigger>
        
        <Select.Content bind:element={selectContent} class="max-h-60 overflow-y-auto" portalProps={{}}>
          <div class="sticky top-0 flex justify-center bg-white border-b border-gray-200 z-10">
            <button 
              on:click|stopPropagation={scrollUp} 
              class="w-full py-1 hover:bg-gray-100 flex justify-center items-center text-gray-700"
            >
              <ChevronUp class="h-4 w-4" />
            </button>
          </div>
          
          <Select.Group>
            <div class="px-2 py-1 text-sm font-medium text-gray-500">متون</div>
            <Select.Item value="الأرجوزة الميئية" class="cursor-pointer" label="الأرجوزة الميئية">الأرجوزة الميئية</Select.Item>
            <Select.Item value="الجزرية" class="cursor-pointer" label="الجزرية">الجزرية</Select.Item>
            <Select.Item value="تحفة الأطفال" class="cursor-pointer" label="تحفة الأطفال">تحفة الأطفال</Select.Item>
            <Select.Item value="نظم الآجرومية" class="cursor-pointer" label="نظم الآجرومية">نظم الآجرومية</Select.Item>
            <Select.Item value="نظم الورقات" class="cursor-pointer" label="نظم الورقات">نظم الورقات</Select.Item>
            <Select.Item value="الرحبية" class="cursor-pointer" label="الرحبية">الرحبية</Select.Item>
            <Select.Item value="نظم المقصود" class="cursor-pointer" label="نظم المقصود">نظم المقصود</Select.Item>
            <Select.Item value="نظم نخبة الفكر" class="cursor-pointer" label="نظم نخبة الفكر">نظم نخبة الفكر</Select.Item>
            <Select.Item value="مائة المعاني والبيان" class="cursor-pointer" label="مائة المعاني والبيان">مائة المعاني والبيان</Select.Item>
          </Select.Group>
          
          <Select.Group>
            <div class="px-2 py-1 text-sm font-medium text-gray-500">المعلقات</div>
            <Select.Item value="معلقة امرئ القيس" class="cursor-pointer" label="معلقة امرئ القيس">معلقة امرئ القيس</Select.Item>
            <Select.Item value="معلقة طرفة" class="cursor-pointer" label="معلقة طرفة">معلقة طرفة</Select.Item>
            <Select.Item value="معلقة زهير" class="cursor-pointer" label="معلقة زهير">معلقة زهير</Select.Item>
            <Select.Item value="معلقة عمرو بن كلثوم" class="cursor-pointer" label="معلقة عمرو بن كلثوم">معلقة عمرو بن كلثوم</Select.Item>
            <Select.Item value="معلقة عنترة" class="cursor-pointer" label="معلقة عنترة">معلقة عنترة</Select.Item>
            <Select.Item value="معلقة لبيد" class="cursor-pointer" label="معلقة لبيد">معلقة لبيد</Select.Item>
            <Select.Item value="معلقة الحارث" class="cursor-pointer" label="معلقة الحارث">معلقة الحارث</Select.Item>
            <Select.Item value="معلقة الأعشى" class="cursor-pointer" label="معلقة الأعشى">معلقة الأعشى</Select.Item>
            <Select.Item value="معلقة النابغة" class="cursor-pointer" label="معلقة النابغة">معلقة النابغة</Select.Item>
            <Select.Item value="معلقة عبيد بن الأبرص" class="cursor-pointer" label="معلقة عبيد بن الأبرص">معلقة عبيد بن الأبرص</Select.Item>
          </Select.Group>
          
          <Select.Group>
            <div class="px-2 py-1 text-sm font-medium text-gray-500">عيون الشعر</div>
            <Select.Item value="لامية العرب" class="cursor-pointer" label="لامية العرب">لامية العرب</Select.Item>
            <Select.Item value="البردة" class="cursor-pointer" label="البردة">البردة</Select.Item>
          </Select.Group>
          
          <div class="sticky bottom-0 flex justify-center bg-white border-t border-gray-200 z-10">
            <button 
              on:click|stopPropagation={scrollDown} 
              class="w-full py-1 hover:bg-gray-100 flex justify-center items-center text-gray-700"
            >
              <ChevronDown class="h-4 w-4" />
            </button>
          </div>
        </Select.Content>
      </Select.Root>
    </div>
  </div>