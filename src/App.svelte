<main>
    <Component params={route.params} />
    {#if is404}
        <h1>404</h1>
        <a href="/">Home</a>
    {/if}
</main>

<script module>
import navaid from 'navaid'
import {setContext} from 'svelte'

// prettier-ignore
const routes = [
      ['/', import('./routes/Home.svelte')],
  ]
let Component = $state(null)
let is404 = $state(false)
let route = $state({path: location.pathname, params: null})

export const router = navaid('/', async uri => {
    is404 = true
    Component = null
    route.path = uri
    route.params = null
})

for (const [path, cmp_] of routes) {
    router.on(path, params => {
        is404 = false
        document.startViewTransition(async () => {
            const {default: cmp, ...exports} = await cmp_

            if (exports?.validate_params && !(await exports.validate_params(params))) {
                router.route('/')
                return
            }

            Component = cmp
            route.path = location.pathname
            route.params = params
        })
    })
}

router.listen()
</script>

<script>
setContext('router', router)
</script>
