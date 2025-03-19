<script>
// @ts-nocheck

    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    function handleChange(e) {
      dispatch('change', e);
    }
  </script>
  
  <div class="relative w-full mb-6">
    <select 
      id="matn-select" 
      on:change={handleChange}
      class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-lg"
    >
      <optgroup label="متون">
        <option value="الأرجوزة الميئية">الأرجوزة الميئية</option>
        <option value="الجزرية">الجزرية</option>
        <option value="تحفة الأطفال">تحفة الأطفال</option>
        <option value="نظم الآجرومية">نظم الآجرومية</option>
        <option value="نظم الورقات">نظم الورقات</option>
        <option value="الرحبية">الرحبية</option>
        <option value="نظم المقصود">نظم المقصود</option>
        <option value="نظم نخبة الفكر">نظم نخبة الفكر</option>
        <option value="مائة المعاني والبيان">مائة المعاني والبيان</option>
      </optgroup>
      <optgroup label="المعلقات">
        <option value="معلقة امرئ القيس">معلقة امرئ القيس</option>
        <option value="معلقة طرفة">معلقة طرفة</option>
        <option value="معلقة زهير">معلقة زهير</option>
        <option value="معلقة عمرو بن كلثوم">معلقة عمرو بن كلثوم</option>
        <option value="معلقة عنترة">معلقة عنترة</option>
        <option value="معلقة لبيد">معلقة لبيد</option>
        <option value="معلقة الحارث">معلقة الحارث</option>
        <option value="معلقة الأعشى">معلقة الأعشى</option>
        <option value="معلقة النابغة">معلقة النابغة</option>
        <option value="معلقة عبيد بن الأبرص">معلقة عبيد بن الأبرص</option>
      </optgroup>
      <optgroup label="عيون الشعر">
        <option value="لامية العرب">لامية العرب</option>
        <option value="البردة">البردة</option>
      </optgroup>
    </select>
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>