<!-- Collegamento al foglio di stile della pagina -->
<head>
    <link rel="stylesheet" type="text/css" href="/css/account/body-measurements/style_add_edit_body_measurements.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Titolo della pagina -->
<h2 class="titlePage">Misure corporee</h2>

<!-- Form di inserimento misurazioni, collegato a una funzione Svelte -->
<form class="form-container" on:submit={addBodyMeasurement}>
    <h3>Aggiungi misurazione</h3>

    <!-- Contenitore per eventuali errori di validazione -->
    <div class="error" id="error1"><p></p></div>

    <!-- Primo gruppo: torace e avambraccio -->
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

    <!-- Secondo gruppo: coscia e vita -->
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

    <!-- Terzo gruppo: fianchi e addome -->
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

    <!-- Quarto gruppo: polpaccio e collo -->
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

    <!-- Campo singolo: larghezza spalle -->
    <div class="input-container">
        <label for="shoulders">Lunghezza spalla (in centimetri):</label>
        <input type="text" id="shoulders" name="shoulders" placeholder="Spalle...">
    </div>

    <!-- Campo obbligatorio: data della misurazione -->
    <div class="input-container" style="margin-top: 30px;">
        <label for="date_recorded">Data di registrazione:</label>
        <input
                type="date"
                id="date_recorded"
                name="date_recorded"
                bind:value={selectedDate}
                required
        >
    </div>

    <!-- Pulsante invio form -->
    <button type="submit">Aggiungi</button>
</form>

<script>
    import { getCookie } from 'svelte-cookie';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    // Imposta la data odierna come valore predefinito del campo data
    let today = new Date().toISOString().split('T')[0];
    let selectedDate = today;

    // Hook eseguito al montaggio del componente
    onMount(() => {
        // Reindirizza alla home se l'utente non è autenticato
        if (getCookie('csrftoken') === "") {
            window.location.href = "/";
        }

        // Evidenzia nel menu la voce "Misure corporee"
        toggleClassByPathEquals({
            targetId: 'body-measurements-icon-item',
            className: 'current-page',
            removeFromIds: [
                'weight-icon-item',
                'food-program-icon-item',
                'account-icon-item',
                'gym-program-icon-item'
            ]
        });

        isLoading = false;
    });

    /**
     * Funzione per inviare le misurazioni corporee all'API
     */
    async function addBodyMeasurement() {
        // Raccoglie e normalizza i valori (converte virgole in punti)
        const fields = ["chest", "bicep", "thigh", "waist", "hips", "abdomen", "calf", "neck", "shoulders"];
        let values_clear = {};
        for (const field of fields) {
            const el = document.getElementById(field);
            values_clear[field] = replaceAllCommasWithDots(el?.value || "");
        }

        // Invia richiesta POST all'API per salvare la misurazione
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/body-measurement/create/", {
            method: "POST",
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

        const data = await response.json();

        if (response.ok) {
            // Reindirizza alla pagina delle misurazioni dopo inserimento riuscito
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
                if (data[field]?.length) {
                    showMessage(`${fieldLabels[field]}: ${data[field][0]}`, "error1")
                    break;
                }
            }
        }
    }
</script>