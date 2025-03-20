{#if href}
    <a bind:this={ref} class={cn(buttonVariants({variant, size}), className)} {href} {...restProps}>
        {@render children?.()}
    </a>
{:else}
    <button
        bind:this={ref}
        class={cn(buttonVariants({variant, size}), className)}
        {type}
        {...restProps}
    >
        {@render children?.()}
    </button>
{/if}

<script module>
import {tv} from 'tailwind-variants'

export const buttonVariants = tv({
    base: '',
    variants: {
        variant: {
            default: ' text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline:
                'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
            default: 'h-10 w-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
})
</script>

<script>
import {cn} from '$lib/utils.js'

let {
    class: className,
    variant = 'default',
    size = 'default',
    ref = $bindable(null),
    href = undefined,
    type = 'button',
    children,
    ...restProps
} = $props()
</script>
