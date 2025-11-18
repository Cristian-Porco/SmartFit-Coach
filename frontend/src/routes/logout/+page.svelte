<div class="loader-container">
    <div class="spinner"></div>
</div>

<script>
    import { onMount } from 'svelte';
    import { deleteCookie } from 'svelte-cookie';

    // Eseguito al montaggio del componente
    onMount(() => {
        // Rimozione dei cookie di autenticazione
        deleteCookie('csrftoken'); // Token di sessione
        deleteCookie('pk');        // ID utente
        deleteCookie('username'); // Nome utente

        // Reindirizzamento alla home dopo il logout
        location.href = "/";
    });
</script>
