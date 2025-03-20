<div class="relative mb-6 w-full">
    <select
        id="matn-select"
        onchange={handle_change}
        class="focus:shadow-outline block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 text-lg leading-tight shadow hover:border-gray-400 focus:outline-none"
    >
        <optgroup label="متون">
            <option value="الأرجوزة الميئية">الأرجوزة الميئية</option>
            <option value="الجزرية">الجزرية</option>
            <option value="تحفة الأطفال">تحفة الأطفال</option>
            <option value="نظم الآجرومية">نظم الآجرومية</option>
            <option value="نظم الورقات">نظم الورقات</option>
            <option value="الرحبية">الرحبية</option>
            <option value="نظم المقصود">نظم المقصود</option>
            <option value="نظم نخبة الفكر">نظم نخبة الفكر</option>
            <option value="مائة المعاني والبيان">مائة المعاني والبيان</option>
        </optgroup>
        <optgroup label="المعلقات">
            <option value="معلقة امرئ القيس">معلقة امرئ القيس</option>
            <option value="معلقة طرفة">معلقة طرفة</option>
            <option value="معلقة زهير">معلقة زهير</option>
            <option value="معلقة عمرو بن كلثوم">معلقة عمرو بن كلثوم</option>
            <option value="معلقة عنترة">معلقة عنترة</option>
            <option value="معلقة لبيد">معلقة لبيد</option>
            <option value="معلقة الحارث">معلقة الحارث</option>
            <option value="معلقة الأعشى">معلقة الأعشى</option>
            <option value="معلقة النابغة">معلقة النابغة</option>
            <option value="معلقة عبيد بن الأبرص">معلقة عبيد بن الأبرص</option>
        </optgroup>
        <optgroup label="عيون الشعر">
            <option value="لامية العرب">لامية العرب</option>
            <option value="البردة">البردة</option>
        </optgroup>
    </select>
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
        <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    </div>
</div>

<script>
// @ts-nocheck
import {createEventDispatcher, onMount} from 'svelte'

const dispatch = createEventDispatcher()

onMount(async () => {
    const select = document.querySelector('#matn-select')
    if (select && select.options.length > 0) {
        if (select.selectedOptions && select.selectedOptions.length > 0) {
            dispatch('change', {
                target: select,
            })
        }
    }
})

function handle_change(e) {
    if (e.target && e.target.selectedOptions && e.target.selectedOptions.length > 0) {
        dispatch('change', e)
    }
}
</script>
