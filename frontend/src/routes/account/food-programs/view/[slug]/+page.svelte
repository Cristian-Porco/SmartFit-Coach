<head>
    <link rel="stylesheet" type="text/css" href="/css/account/food-programs/style_view_food_programs.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<div class="container">
    <div><p><b>Visualizza</b></p><h1 class="titlePage">Scheda alimentare</h1></div>
    <div>
        <p><b>Data inizio:</b> <span id="start_date">--/--/----</span></p>
        <p><b>Data fine:</b> <span id="end_date">--/--/----</span></p>
    </div>
</div>

<div class="form-container">
    <table class="responsive-table">
        <thead>
        <tr>
            <th rowspan="2" class="header-title">✓</th>
            <th rowspan="2" class="header-title name-column">Nome</th>
            <th rowspan="2" class="header-title">Grammi</th>
            <th class="header-title">Kcal</th>
            <th class="header-title">Proteine</th>
            <th class="header-title">Carboidrati</th>
            <th rowspan="2" class="header-title">Zuccheri</th>
            <th class="header-title">Grassi</th>
            <th rowspan="2" class="header-title">Grassi Saturi</th>
            <th rowspan="2" class="header-title">Fibre</th>
        </tr>
        <tr>
            <th class="header-limits" id="max_kcal"></th>
            <th class="header-limits" id="max_protein"></th>
            <th class="header-limits" id="max_carbs"></th>
            <th class="header-limits" id="max_fats"></th>
        </tr>
        </thead>
        <tbody id="containerFoodPlan">
        </tbody>
    </table>
</div>

<script>
    import { onMount } from "svelte";
    import { getCookie } from "svelte-cookie";
    import { external_onMount } from "$lib/view_food_programs.js";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    export let data;

    onMount(async () => {
        if(getCookie('csrftoken') === "") window.location.href = "/";

        toggleClassByPathContains({
            substring: '/account/food-programs/view',
            targetId: 'food-program-icon-item',
            className: 'current-page',
            removeFromIds: [
                'weight-icon-item',
                'body-measurements-icon-item',
                'account-icon-item',
                'gym-program-icon-item'
            ]
        });

        await Promise.all([
            external_onMount(data.id)
        ]);

        isLoading = false;
    });
</script>