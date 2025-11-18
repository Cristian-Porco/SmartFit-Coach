<head>
    <link rel="stylesheet" type="text/css" href="/css/account/gym-programs/style_add_gym_programs.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Intestazione -->
<p><b>Aggiungi</b></p>
<h2 class="titlePage">Scheda di allenamento</h2>

<!-- Form per aggiungere una nuova scheda settimanale -->
<form class="form-container" on:submit={addGymPrograms}>
    <!-- Errore generico -->
    <div class="error" id="error1"><p></p></div>

    <!-- Selezione date -->
    <div class="form-group">
        <div class="input-container">
            <label for="start_date">Data di inizio:</label>
            <input type="date" id="start_date" required>
        </div>
        <div class="input-container">
            <label for="end_date">Data di fine:</label>
            <input type="date" id="end_date" required>
        </div>
    </div>

    <button type="submit">Aggiungi</button>
</form>

<script>
    import { getCookie } from 'svelte-cookie';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    let today = new Date().toISOString().split('T')[0];
    let selectedDate = today;

    // Reindirizza se non autenticato
    onMount(() => {
        if (getCookie('csrftoken') === "") window.location.href = "/";

        toggleClassByPathEquals({
            targetId: 'gym-program-icon-item',
            className: 'current-page',
            removeFromIds: [
                'food-program-icon-item',
                'weight-icon-item',
                'body-measurements-icon-item',
                'account-icon-item'
            ]
        });

        isLoading = false;
    });

    // Valida che la settimana inizi di lunedì e finisca di domenica (7 giorni esatti)
    function validateWeekRange(startId, endId) {
        const startDate = new Date(document.getElementById(startId).value);
        const endDate = new Date(document.getElementById(endId).value);

        if (isNaN(startDate) || isNaN(endDate)) {
            return { valid: false, message: "Inserisci date valide." };
        }

        const startDay = startDate.getDay(); // 1 = lunedì
        const endDay = endDate.getDay();     // 0 = domenica
        const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

        if (startDay !== 1) return { valid: false, message: "La data di inizio deve essere un lunedì." };
        if (endDay !== 0) return { valid: false, message: "La data di fine deve essere una domenica." };
        if (diffDays !== 6) return { valid: false, message: "Le date devono coprire una settimana esatta." };

        return { valid: true };
    }

    // Crea una nuova scheda settimanale e inizializza le sezioni e un item placeholder
    async function addGymPrograms(event) {
        event.preventDefault();

        const validation = validateWeekRange("start_date", "end_date");

        if (!validation.valid) {
            showMessage(validation.message);
            return;
        }

        // 1. Crea la scheda di allenamento
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/gym-plan/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({
                start_date: document.getElementById("start_date").value,
                end_date: document.getElementById("end_date").value,
                author: getCookie("pk")
            })
        });

        const data = await response.json();

        if (!response.ok) {
            handleServerErrors(data);
            return;
        }

        const planId = data.id;
        const author = getCookie("pk");
        const days = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"];
        const sectionIds = [];

        // 2. Crea sezioni giornaliere
        for (const day of days) {
            const res = await fetch("http://127.0.0.1:8000/api/v1/data/gym-plan-section/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'),
                },
                body: JSON.stringify({ author, gym_plan: planId, day })
            });

            if (res.ok) {
                const sectionData = await res.json();
                sectionIds.push(sectionData.id);
            }
        }

        // 3. Crea un item placeholder per ogni sezione
        for (const sectionId of sectionIds) {
            await fetch("http://127.0.0.1:8000/api/v1/data/gym-plan-item/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    section_id: sectionId,
                    order: 0,
                    intensity_techniques: ["null"]
                })
            });
        }

        // Reindirizza all'editor
        window.location.href = `/account/gym-programs/edit/${planId}`;
    }

    // Gestione errori lato server (es. form non valido)
    function handleServerErrors(data) {
        if (data.start_date?.length) {
            showMessage("Data di inizio: " + data.start_date[0]);
        } else if (data.end_date?.length) {
            showMessage("Data di fine: " + data.end_date[0]);
        } else {
            showMessage("Errore imprevisto nella creazione della scheda.");
        }
    }
</script>
