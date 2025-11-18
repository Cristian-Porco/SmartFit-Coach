<!-- Collegamento al foglio di stile per la modifica delle misurazioni corporee -->
<head>
    <link rel="stylesheet" type="text/css" href="/css/account/body-measurements/style_add_edit_body_measurements.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Titolo principale della pagina -->
<h2 class="titlePage">Misure corporee</h2>

<!-- Form per modificare una misurazione esistente -->
<form class="form-container" on:submit={editBodyMeasurement}>
    <h3>Modifica misurazione</h3>

    <!-- Contenitore per errori lato client/server -->
    <div class="error" id="error1"><p></p></div>

    <!-- Gruppo 1: Torace e Avambraccio -->
    <div class="form-group">
        <div class="input-container">
            <label for="chest">Circonferenza torace (in centimetri):</label>
            <input type="text" id="chest" name="chest" placeholder="Torace...">
        </div>
        <div class="input-container">
            <label for="bicep">Circonferenza avambraccio (in centimetri):</label>
            <input type="text" id="bicep" name="bicep" placeholder="Bicipite...">
        </div>
    </div>

    <!-- Gruppo 2: Coscia e Vita -->
    <div class="form-group">
        <div class="input-container">
            <label for="thigh">Circonferenza coscia (in centimetri):</label>
            <input type="text" id="thigh" name="thigh" placeholder="Coscia...">
        </div>
        <div class="input-container">
            <label for="waist">Circonferenza vita (in centimetri):</label>
            <input type="text" id="waist" name="waist" placeholder="Vita...">
        </div>
    </div>

    <!-- Gruppo 3: Fianchi e Addome -->
    <div class="form-group">
        <div class="input-container">
            <label for="hips">Circonferenza fianchi (in centimetri):</label>
            <input type="text" id="hips" name="hips" placeholder="Fianchi...">
        </div>
        <div class="input-container">
            <label for="abdomen">Circonferenza addome (in centimetri):</label>
            <input type="text" id="abdomen" name="abdomen" placeholder="Addome...">
        </div>
    </div>

    <!-- Gruppo 4: Polpaccio e Collo -->
    <div class="form-group">
        <div class="input-container">
            <label for="calf">Circonferenza polpaccio (in centimetri):</label>
            <input type="text" id="calf" name="calf" placeholder="Polpaccio...">
        </div>
        <div class="input-container">
            <label for="neck">Circonferenza collo (in centimetri):</label>
            <input type="text" id="neck" name="neck" placeholder="Collo...">
        </div>
    </div>

    <!-- Campo spalle (singolo) -->
    <div class="input-container">
        <label for="shoulders">Lunghezza spalla (in centimetri):</label>
        <input type="text" id="shoulders" name="shoulders" placeholder="Spalle...">
    </div>

    <!-- Campo data della misurazione -->
    <div class="input-container" style="margin-top: 30px;">
        <label for="date_recorded">Data di registrazione:</label>
        <input type="date" id="date_recorded" name="date_recorded" bind:value={selectedDate} required>
    </div>

    <!-- Pulsante invio -->
    <button type="submit">Modifica</button>
</form>

<script>
    import { getCookie } from 'svelte-cookie';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    // Props in ingresso (contiene { id })
    export let data;

    // Identificativo della misurazione da modificare
    let idBodyMeasurement;

    // Inizializza data selezionata al giorno corrente (usato in bind:value)
    let today = new Date().toISOString().split('T')[0];
    let selectedDate = today;

    // Invio modifiche al backend
    async function editBodyMeasurement() {
        // Raccolta e normalizzazione valori
        const fields = ["chest", "bicep", "thigh", "waist", "hips", "abdomen", "calf", "neck", "shoulders"];
        let values_clear = {};
        for (const field of fields) {
            const el = document.getElementById(field);
            values_clear[field] = replaceAllCommasWithDots(el?.value || "");
        }

        // Richiesta PUT per aggiornare il record esistente
        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/body-measurement/update/${idBodyMeasurement}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({
                ...values_clear,
                date_recorded: selectedDate,
                author: getCookie("pk")
            })
        });

        const result = await response.json();

        if (response.ok) {
            // Ritorna alla pagina delle misurazioni
            window.location.href = "/account/body-measurements/";
        } else {
            // Mostra primo errore rilevato
            const fieldLabels = {
                chest: "Torace",
                bicep: "Bicipite",
                thigh: "Coscia",
                waist: "Vita",
                hips: "Fianchi",
                abdomen: "Addome",
                calf: "Polpaccio",
                neck: "Collo",
                shoulders: "Spalle"
            };

            for (const field of fields) {
                if (result[field]?.length) {
                    showMessage(`${fieldLabels[field]}: ${result[field][0]}`, "error1")
                    break;
                }
            }
        }
    }

    // Hook di inizializzazione
    onMount(async () => {
        // Protezione: reindirizza alla login se non autenticato
        if (getCookie('csrftoken') === "") {
            location.href = "/";
        }

        // Attiva voce del menu laterale per misurazioni
        toggleClassByPathContains({
            substring: '/account/body-measurements/edit',
            targetId: 'body-measurements-icon-item',
            className: 'current-page',
            removeFromIds: [
                'weight-icon-item',
                'food-program-icon-item',
                'account-icon-item',
                'gym-program-icon-item'
            ]
        });

        // Carica misurazione da modificare
        idBodyMeasurement = data.id;
        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/body-measurement/${idBodyMeasurement}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        const record = await response.json();

        // Imposta la data nel formato input type="date"
        selectedDate = formatDateForInput(record.date_recorded);

        // Pre-compila tutti i campi del form
        const fields = ["chest", "bicep", "thigh", "waist", "hips", "abdomen", "calf", "neck", "shoulders"];
        fields.forEach(field => {
            document.getElementById(field).value = record[field];
        });

        isLoading = false;
    });
</script>
