<!-- Collegamento al CSS specifico per la lista delle schede alimentari -->
<head>
    <link rel="stylesheet" type="text/css" href="/css/account/food-programs/style_list_food_programs.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Se visibile, mostra un modale di conferma duplicazione -->
{#if showDuplicateModal}
    <div class="modal">
        <div class="modal-content" style="width: 500px;">
            <h3>Duplica scheda alimentare</h3>
            <p style="margin-bottom: 10px">
                Piano duplicato con successo! Verrai reindirizzato tra 5 secondi...
            </p>
        </div>
    </div>
{/if}

<!-- Titolo della pagina -->
<h2 class="titlePage">Schede alimentari</h2>

<!-- Pulsante per aggiungere una nuova scheda -->
<div class="form-container">
    <button on:click={addFoodPrograms}>Aggiungi scheda</button>
</div>

<!-- Sezione contenente tutte le schede precedenti -->
<div class="form-container">
    <h3>Storico schede</h3>
    <div id="food-programs-items">
        <!-- Il contenuto sarà generato dinamicamente via JS/Svelte -->
    </div>
</div>

<script>
    import { onMount } from "svelte";
    import { getCookie } from 'svelte-cookie';
    import { fade } from 'svelte/transition';

    let isLoading = true;

    let selectedId = null;
    let showDuplicateModal = false;

    // Redireziona alla creazione di una nuova scheda
    function addFoodPrograms() {
        window.location.href = "/account/food-programs/add";
    }

    // Inizializzazione del componente
    onMount(async () => {
        // Reindirizza se non autenticato
        if (getCookie('csrftoken') === "") {
            window.location.href = "/";
            return;
        }

        // Evidenzia l'icona attiva nel menu laterale
        toggleClassByPathEquals({
            targetId: 'food-program-icon-item',
            className: 'current-page',
            removeFromIds: [
                'weight-icon-item',
                'body-measurements-icon-item',
                'account-icon-item',
                'gym-program-icon-item'
            ]
        });

        // Fetch delle schede alimentari dell’utente
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        const data = await response.json();
        const container = document.getElementById('food-programs-items');

        // Se esistono schede, generazione dinamica dell'elenco
        if (data.length > 0) {
            data.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('food-programs-item');

                // Format data in base a inizio/fine
                const sameDate = item.start_date === item.end_date;
                const dateText = sameDate
                    ? `Scheda alimentare del ${item.start_date}`
                    : `Scheda alimentare dal ${item.start_date} al ${item.end_date}`;

                // HTML per ogni card
                div.innerHTML = `
                  <div class="details">
                    <span class="average">${dateText}</span>
                  </div>
                  <div class="buttons">
                    <button class="view-btn" data-id="${item.id}">Visualizza</button>
                    <button class="edit-btn material-icon-button" data-id="${item.id}">
                      <i class="material-icons" data-id="${item.id}">edit</i>
                    </button>
                    <button class="duplicate-btn material-icon-button" data-id="${item.id}">
                      <i class="material-icons" data-id="${item.id}">content_copy</i>
                    </button>
                    <button class="delete-btn material-icon-button" data-id="${item.id}">
                      <i class="material-icons" data-id="${item.id}">delete</i>
                    </button>
                  </div>
                `;

                container.appendChild(div);
            });

            // Visualizzazione piano
            document.querySelectorAll(".view-btn").forEach(button => {
                button.addEventListener("click", event => {
                    selectedId = event.target.dataset.id;
                    window.location.href = `/account/food-programs/view/${selectedId}`;
                });
            });

            // Modifica piano
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", event => {
                    selectedId = event.target.dataset.id;
                    window.location.href = `/account/food-programs/edit/${selectedId}`;
                });
            });

            // Duplica piano alimentare
            document.querySelectorAll(".duplicate-btn").forEach(button => {
                button.addEventListener("click", async event => {
                    const selectedId = event.target.dataset.id;

                    const res = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan/clone/${selectedId}/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token " + getCookie('csrftoken'),
                        }
                    });

                    if (!res.ok) {
                        console.error("Errore duplicazione piano.");
                        return;
                    }

                    const { new_plan_id } = await res.json();

                    // Mostra modale e reindirizza dopo 5 sec
                    showDuplicateModal = true;
                    setTimeout(() => {
                        window.location.href = `/account/food-programs/edit/${new_plan_id}`;
                    }, 5000);
                });
            });

            // Elimina piano
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async event => {
                    selectedId = event.target.dataset.id;

                    const del = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan/delete/${selectedId}/`, {
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
            // Nessuna scheda trovata
            const p = document.createElement('p');
            p.style.margin = "10px 0";
            p.innerText = "Nessuna scheda presente!";
            container.appendChild(p);
        }

        isLoading = false;
    });
</script>
