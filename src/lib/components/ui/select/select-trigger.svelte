<script>
	import { Select as SelectPrimitive } from "bits-ui";
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import { cn } from "$lib/utils.js";
	let { class: className = undefined, children, ...rest } = $props();
	

	const children_render = $derived(children);
</script>

<SelectPrimitive.Trigger
	class={cn(
		        'focus:shadow-outline ring-offset-background data-[placeholder]:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border border-[#e1e3e6] bg-white px-3 py-2 text-sm shadow hover:border-[#bfc0c0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className
	)}
	{...rest}
	
	on:click
	on:keydown
>
	{#snippet children({ builder })}
		{@render children_render?.({ builder, })}
		<div>
			<ChevronDown class="h-4 w-4 opacity-50" />
		</div>
	{/snippet}
</SelectPrimitive.Trigger>
