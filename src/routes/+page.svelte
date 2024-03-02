<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>


<script>
    import { allServers, initServers } from '/src/logic/servers';
    import { onMount } from 'svelte';

    onMount(async () => {
        initServers();
        console.log(allServers);
    });
    
</script>