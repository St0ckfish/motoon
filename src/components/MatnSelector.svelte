<div class="relative mx-auto mb-6 max-w-10/12">
    <Select selected={currentValue} onSelectedChange={handleChange}>
        <SelectTrigger class="w-full rounded border border-gray-300 text-lg">
            {#if currentValue}
                <span>{currentValue}</span>
            {:else}
                <span>اختر المتن</span>
            {/if}
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={5} class="z-50 max-h-72 overflow-y-auto">
            <SelectGroup>
                <SelectLabel class="px-2 py-1 text-sm font-medium text-gray-500">متون</SelectLabel>
                <SelectItem value="الأرجوزة الميئية">الأرجوزة الميئية</SelectItem>
                <SelectItem value="الجزرية">الجزرية</SelectItem>
                <SelectItem value="تحفة الأطفال">تحفة الأطفال</SelectItem>
                <SelectItem value="نظم الآجرومية">نظم الآجرومية</SelectItem>
                <SelectItem value="نظم الورقات">نظم الورقات</SelectItem>
                <SelectItem value="الرحبية">الرحبية</SelectItem>
                <SelectItem value="نظم المقصود">نظم المقصود</SelectItem>
                <SelectItem value="مائة المعاني والبيان">مائة المعاني والبيان</SelectItem>
            </SelectGroup>

            <SelectSeparator class="my-1 h-px bg-gray-200" />

            <SelectGroup>
                <SelectLabel class="px-2 py-1 text-sm font-medium text-gray-500"
                    >المعلقات</SelectLabel
                >
                <SelectItem value="معلقة امرئ القيس">معلقة امرئ القيس</SelectItem>
                <SelectItem value="معلقة طرفة">معلقة طرفة</SelectItem>
                <SelectItem value="معلقة زهير">معلقة زهير</SelectItem>
                <SelectItem value="معلقة عمرو بن كلثوم">معلقة عمرو بن كلثوم</SelectItem>
                <SelectItem value="معلقة عنترة">معلقة عنترة</SelectItem>
                <SelectItem value="معلقة لبيد">معلقة لبيد</SelectItem>
                <SelectItem value="معلقة الحارث">معلقة الحارث</SelectItem>
                <SelectItem value="معلقة الأعشى">معلقة الأعشى</SelectItem>
                <SelectItem value="معلقة النابغة">معلقة النابغة</SelectItem>
                <SelectItem value="معلقة عبيد بن الأبرص">معلقة عبيد بن الأبرص</SelectItem>
            </SelectGroup>

            <SelectSeparator class="my-1 h-px bg-gray-200" />

            <SelectGroup>
                <SelectLabel class="px-2 py-1 text-sm font-medium text-gray-500"
                    >عيون الشعر</SelectLabel
                >
                <SelectItem value="لامية العرب">لامية العرب</SelectItem>
                <SelectItem value="البردة">البردة</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</div>

<script>
import {onMount} from 'svelte'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
} from '../lib/components/ui/select'

const {change} = $props()
let currentValue = $state('الأرجوزة الميئية')

function createChangeEvent(value) {
    const stringValue = value?.value || value?.toString?.() || value

    return {
        target: {
            value: stringValue,
            selectedIndex: 0,
            options: [{text: stringValue, value: stringValue}],
        },
        detail: {
            target: {
                value: stringValue,
                selectedIndex: 0,
                options: [{text: stringValue, value: stringValue}],
            },
        },
    }
}

onMount(() => {
    const hash = decodeURI(location.hash.slice(1)).replace(/-/g, ' ')

    if (hash && hash.trim() !== '') {
        currentValue = hash
        handleChange(hash)
    } else {
        handleChange('الأرجوزة الميئية')
    }
})

function handleChange(value) {
    if (!value) return

    const stringValue = value?.value || value?.toString?.() || value

    if (stringValue === currentValue && !change) return

    currentValue = stringValue

    if (change) {
        const evt = createChangeEvent(stringValue)
        change(evt)

        setTimeout(() => {
            window.history.pushState(null, '', '#' + stringValue.replace(/\s+/g, '-'))
        }, 100)
    }
}
</script>
