<!-- Collegamento al foglio di stile per la pagina del peso -->
<head>
    <link rel="stylesheet" type="text/css" href="/css/account/weights/style_weights.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Titolo della pagina -->
<h2 class="titlePage">Peso</h2>

<!-- Form per aggiungere un nuovo peso -->
<form class="form-container" on:submit={addWeight}>
    <h3>Aggiungi peso</h3>

    <!-- Messaggi di errore e informativi -->
    <div class="error" id="error1"><p></p></div>
    <div class="info" id="info1"><p></p></div>

    <!-- Input per peso e data -->
    <div class="form-group">
        <div class="input-container">
            <label for="add-weight">Peso:</label>
            <input type="text" id="add-weight" name="weight" placeholder="Peso..." required>
        </div>
        <div class="input-container">
            <label for="add-date">Data di registrazione:</label>
            <input type="date" id="add-date" name="date_recorded" required>
        </div>
    </div>

    <!-- Pulsante di invio -->
    <div class="form-group">
        <button type="submit">Aggiungi</button>
    </div>
</form>

<!-- Area del grafico del peso e analisi AI -->
<div id="chartWeights" class="areaChartZone">
    <!-- Canvas del grafico (es. Chart.js), collegato via bind:this -->
    <canvas bind:this={chartCanvas} style="width:100%; height:100%;"></canvas>

    <!-- Bottone per attivare l'analisi AI -->
    <button id="button-ai-analysis" class="button-ai" on:click={showAIDiv}>
        Ottieni un’analisi intelligente sui dati
    </button>
</div>

<!-- Sezione analisi AI -->
<div id="ai-box" class="ai-box hidden">
    <h3>Risposta intelligente sui dati</h3>
    <div id="ai-content" class="ai-loader"></div>
</div>

<!-- Storico delle pesate -->
<div>
    <h3>Storico peso</h3>
    <div id="weight-items">
        <!-- Qui verranno iniettati dinamicamente gli elementi del peso storico -->
    </div>
</div>

<!-- Popup per modificare un peso esistente -->
<div id="edit-popup" class="popup-overlay">
    <div class="popup">
        <h3>Modifica Peso</h3>

        <!-- Messaggio di errore -->
        <div class="error" id="error2"><p></p></div>

        <!-- Form di modifica peso e data -->
        <div class="form-group">
            <div class="input-container">
                <label for="edit-weight">Peso:</label>
                <input type="text" id="edit-weight" required>
            </div>
            <div class="input-container">
                <label for="edit-date">Data di registrazione:</label>
                <input type="date" id="edit-date" required>
            </div>
        </div>

        <!-- Pulsanti per salvare o annullare -->
        <div class="form-group">
            <button id="save-edit">Salva</button>
            <button id="cancel-edit">Annulla</button>
        </div>
    </div>
</div>

<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { getCookie } from "svelte-cookie";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    let chartCanvas;
    let selectedId = null;

    /**
     * Analisi AI sui dati del peso utente
     */
    async function showAIDiv() {
        // Recupera elementi DOM coinvolti: contenitore, contenuto e bottone
        const aiBox = document.getElementById("ai-box");
        const aiContent = document.getElementById("ai-content");
        const button = document.getElementById("button-ai-analysis");

        // Mostra il contenitore dell’AI (rimuove "hidden" e aggiunge "visible")
        aiBox.classList.remove("hidden");
        aiBox.classList.add("visible");

        // Imposta lo stato di caricamento (spinner)
        aiContent.className = "ai-loader";
        aiContent.innerText = "";

        // Disabilita il bottone per evitare clic multipli
        button.disabled = true;

        // Effettua una richiesta GET all'endpoint AI per ottenere l'analisi dei dati peso
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/weight/analysis/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"), // Autenticazione
            },
        });

        // Se la richiesta è andata a buon fine
        if (response.ok) {
            const data = await response.json(); // Estrae il contenuto JSON

            // Mostra il risultato dell’analisi
            aiContent.className = "ai-response";
            aiContent.innerText = data.analysis;

            // Riabilita il bottone
            button.disabled = false;
        }
    }

    /**
     * Aggiunta peso
     */
    async function addWeight() {
        // Legge e normalizza il valore del peso (converte virgole in punti decimali)
        const weight = replaceAllCommasWithDots(document.getElementById("add-weight").value);

        // Legge la data di registrazione inserita dall’utente
        const date = document.getElementById("add-date").value;

        // Invia una richiesta POST all'API per creare un nuovo record del peso
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/weight/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"), // Autenticazione via cookie
            },
            body: JSON.stringify({
                author: getCookie("pk"),      // ID utente autenticato
                weight_value: weight,         // Valore del peso
                date_recorded: date           // Data inserita
            }),
        });

        const data = await response.json(); // Parsing della risposta JSON

        // Se la risposta è OK, ricarica la pagina per aggiornare lista/grafico
        if (response.ok) {
            location.reload();
        } else {
            // Altrimenti mostra messaggi di errore nel contenitore #error1
            showMessage(data, "error1");
        }
    }

    /**
     * Al caricamento del componente
     */
    onMount(async () => {
        // 1. Verifica autenticazione
        if (getCookie("csrftoken") === "")
            window.location.href = "/"; // Redirect alla login se non autenticato

        // 2. Evidenziazione menu attivo
        toggleClassByPathEquals({
            targetId: "weight-icon-item", // Attiva l’icona del peso
            className: "current-page",
            removeFromIds: [
                "account-icon-item",
                "body-measurements-icon-item",
                "food-program-icon-item",
                "gym-program-icon-item"
            ]
        });

        // 3. Fetch dei dati peso
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/weight/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken")
            }
        });
        const data = await response.json();
        const container = document.getElementById("weight-items");

        // 4. Visualizza elenco pesi (o messaggio se vuoto)
        if (data.length > 0) {
            data.forEach((item) => {
                const div = document.createElement("div");
                div.classList.add("weight-item");

                const dateITA = formatDateForInput(item.date_recorded); // Data formattata per input

                // Inietta HTML con valore e azioni (icone mod/modifica)
                div.innerHTML = `
                  <div class="details">
                    <span class="weight">${item.weight_value} kg</span>
                    <span class="date">${item.date_recorded}</span>
                  </div>
                  <div class="buttons">
                    <button class="edit-btn material-icon-button" data-id="${item.id}" data-weight="${item.weight_value}" data-date="${dateITA}">
                      <i class="material-icons" data-id="${item.id}" data-weight="${item.weight_value}" data-date="${dateITA}">edit</i>
                    </button>
                    <button class="delete-btn material-icon-button" data-id="${item.id}">
                      <i class="material-icons" data-id="${item.id}">delete</i>
                    </button>
                  </div>
                `;
                container.appendChild(div);
            });
        } else {
            // Nasconde il grafico se non ci sono dati
            document.getElementById("chartWeights").style.display = "none";
            const p = document.createElement("p");
            p.style = "margin: 10px 0;";
            p.innerText = "Nessun peso presente!";
            container.appendChild(p);
        }

        // 5. Eventi per UI dinamica

        // Apre popup modifica con dati precompilati
        document.querySelectorAll(".edit-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => {
                selectedId = e.target.dataset.id;
                document.getElementById("edit-weight").value = e.target.dataset.weight;
                document.getElementById("edit-date").value = e.target.dataset.date;
                document.getElementById("edit-popup").style.display = "flex";
            })
        );

        // Elimina un record peso
        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", async (e) => {
                selectedId = e.target.dataset.id;
                const del = await fetch(`http://127.0.0.1:8000/api/v1/data/weight/delete/${selectedId}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + getCookie("csrftoken")
                    }
                });
                if (del.ok) location.reload(); // Aggiorna la lista
            })
        );

        // Chiude il popup modifica
        document.getElementById("cancel-edit").addEventListener("click", () => {
            document.getElementById("edit-popup").style.display = "none";
        });

        // Salva la modifica del peso
        document.getElementById("save-edit").addEventListener("click", async () => {
            const weight = replaceAllCommasWithDots(document.getElementById("edit-weight").value);
            const date = document.getElementById("edit-date").value;

            const response = await fetch(`http://127.0.0.1:8000/api/v1/data/weight/update/${selectedId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie("csrftoken")
                },
                body: JSON.stringify({
                    author: getCookie("pk"),
                    weight_value: weight,
                    date_recorded: date
                })
            });

            const result = await response.json();
            if (response.ok) location.reload();
            else showMessage(result, "error2"); // Mostra eventuale errore validazione
        });

        // 6. Crea grafico con Chart.js

        // Ordina dal più vecchio al più recente, ma poi inverte per mostrare dal più recente
        data.sort((a, b) => formatDateForInput(a.date_recorded) - formatDateForInput(b.date_recorded));
        const labels = data.map(d => d.date_recorded).reverse();
        const values = data.map(d => d.weight_value).reverse();

        const ctx = chartCanvas.getContext("2d");

        new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Peso",
                    data: values,
                    fill: true,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderColor: "white",
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        ticks: { color: "white" },
                        grid: { color: "rgba(255,255,255,0.2)" }
                    },
                    y: {
                        ticks: { color: "white" },
                        grid: { color: "rgba(255,255,255,0.2)" }
                    }
                }
            }
        });
        isLoading = false;
    });
</script>