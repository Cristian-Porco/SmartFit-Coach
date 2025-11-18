<!-- Inclusione del file CSS specifico per lo stile della pagina misure corporee -->
<head>
    <link rel="stylesheet" type="text/css" href="/css/account/body-measurements/style_home_body_measurements.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Titolo principale della pagina -->
<h2 class="titlePage">Misure corporee</h2>

<!-- Contenitore pulsante per aggiungere una nuova misurazione -->
<div class="form-container">
    <button on:click={addBodyMeasurement}>Aggiungi misurazione</button>
</div>

<!-- Sezione per richiedere analisi AI (visibile solo se ci sono misurazioni) -->
<div id="isNotEmpty" class="form-container">
    <button id="button-ai-analysis" class="button-ai" on:click={showAIDiv}>
        Ottieni un’analisi intelligente sui dati
    </button>
</div>

<!-- Box che mostra la risposta AI dopo il click -->
<div id="ai-box" class="ai-box hidden">
    <h3>Risposta intelligente sui dati</h3>
    <!-- Loader iniziale finché l'AI non risponde -->
    <div id="ai-content" class="ai-loader"></div>
</div>

<!-- Sezione che mostra lo storico delle misurazioni dell'utente -->
<div class="form-container">
    <h3>Storico misurazioni</h3>
    <div id="body-measurements-items">
        <!-- Il contenuto viene generato dinamicamente via JS/Svelte -->
    </div>
</div>


<script>
    import { onMount } from "svelte";
    import { getCookie } from 'svelte-cookie';
    import { fade } from 'svelte/transition';

    let isLoading = true;

    let selectedId = null;
    let chartCanvas; // Riservato per eventuale grafico futuro

    // Inizializzazione al montaggio
    onMount(async () => {
        // Verifica autenticazione
        if (getCookie('csrftoken') === "") {
            window.location.href = "/";
            return;
        }

        // Evidenzia la voce attiva del menu
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

        // 📥 Recupera misurazioni utente
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/body-measurement/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        const data = await response.json();
        const container = document.getElementById('body-measurements-items');

        // 🧾 Se ci sono misurazioni...
        if (data.length > 0) {
            data.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('body-measurements-item');

                // Calcola media visiva o fallback
                const media = item.average_measurement !== null
                    ? `${parseFloat(item.average_measurement).toFixed(2)} cm`
                    : "Misurazione vuota";

                // 📦 HTML dell’item
                div.innerHTML = `
                  <div class="details">
                    <span class="average">${media}</span>
                    <span class="date">${item.date_recorded}</span>
                  </div>
                  <div class="buttons">
                    <button class="edit-btn material-icon-button" data-id="${item.id}">
                      <i class="material-icons" data-id="${item.id}">edit</i>
                    </button>
                    <button class="delete-btn material-icon-button" data-id="${item.id}">
                      <i class="material-icons" data-id="${item.id}">delete</i>
                    </button>
                  </div>
                `;

                container.appendChild(div);
            });

            // Evento modifica
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", e => {
                    selectedId = e.target.dataset.id;
                    window.location.href = `/account/body-measurements/edit/${selectedId}`;
                });
            });

            // Evento eliminazione
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async e => {
                    selectedId = e.target.dataset.id;

                    const del = await fetch(`http://127.0.0.1:8000/api/v1/data/body-measurement/delete/${selectedId}/`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token " + getCookie('csrftoken'),
                        }
                    });

                    if (del.ok) location.reload();
                });
            });
        } else {
            // Nessun dato: nascondi sezione AI e mostra messaggio
            document.getElementById("isNotEmpty").style.display = "none";

            const p = document.createElement('p');
            p.style.margin = "10px 0";
            p.innerText = "Nessuna misurazione presente!";
            container.appendChild(p);
        }

        isLoading = false;
    });

    /**
     * Richiama l’analisi AI dei dati
     */
    async function showAIDiv() {
        const aiBox = document.getElementById("ai-box");
        const aiContent = document.getElementById("ai-content");
        const buttonAI = document.getElementById("button-ai-analysis");

        // Resetta UI e attiva animazione
        aiBox.classList.add("hidden");
        aiContent.innerText = "";
        aiContent.classList.add("ai-loader");
        aiContent.classList.remove("ai-response");

        aiBox.classList.remove("hidden");
        buttonAI.disabled = true;
        setTimeout(() => aiBox.classList.add("visible"), 10);

        // Richiesta AI
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/body-measurement/analysis/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        if (response.ok) {
            const data = await response.json();
            aiContent.classList.remove("ai-loader");
            aiContent.classList.add("ai-response");
            aiContent.innerText = data.analysis;
            buttonAI.disabled = false;
        }
    }

    /**
     * Naviga alla pagina per aggiungere una nuova misurazione
     */
    function addBodyMeasurement() {
        location.href = "/account/body-measurements/add";
    }
</script>
