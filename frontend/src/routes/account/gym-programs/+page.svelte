<head>
    <link rel="stylesheet" type="text/css" href="/css/account/gym-programs/style_list_gym_programs.css">
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

<h2 class="titlePage">Schede di allenamento</h2>

<div class="form-container">
    <button on:click={addGymPrograms}>Aggiungi scheda</button>
</div>

<div class="form-container">
    <h3>Storico schede</h3>
    <div id="gym-programs-items">

    </div>
</div>

<script>
    import { onMount } from "svelte";
    import { getCookie } from 'svelte-cookie';
    import { fade } from 'svelte/transition';

    let isLoading = true;

    let selectedId = null;
    let showDuplicateModal = false;

    // Aggiungi nuova scheda
    function addGymPrograms() {
        location.href = "/account/gym-programs/add";
    }

    onMount(async () => {
        // Redirect se non autenticato
        if (getCookie('csrftoken') === "") {
            location.href = "/";
            return;
        }

        // Attiva l'icona "Schede Allenamento"
        toggleClassByPathEquals({
            targetId: 'gym-program-icon-item',
            className: 'current-page',
            removeFromIds: [
                'weight-icon-item',
                'body-measurements-icon-item',
                'account-icon-item',
                'food-program-icon-item'
            ]
        });

        // Recupera le schede dell'utente
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/gym-plan/me-min/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        const data = await response.json();
        const container = document.getElementById('gym-programs-items');

        if (data.length > 0) {
            data.forEach(renderGymProgramCard);
        } else {
            // Nessuna scheda trovata
            const p = document.createElement('p');
            p.style.margin = "10px 0";
            p.innerText = "Nessuna scheda presente!";
            container.appendChild(p);
        }

        isLoading = false;
    });

    // Funzione per renderizzare una singola scheda
    function renderGymProgramCard(item) {
        const container = document.getElementById('gym-programs-items');
        const div = document.createElement('div');
        div.classList.add('gym-programs-item');

        const dateText = `Scheda di allenamento dal ${item.start_date} al ${item.end_date}`;
        const today = new Date();
        const start = new Date(formatDateForInput(item.start_date));
        const end = new Date(formatDateForInput(item.end_date));

        // Sezione con la data
        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("details");

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("average");
        dateSpan.textContent = dateText;
        detailsDiv.appendChild(dateSpan);

        // Bottoni (view, edit, delete)
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("buttons");

        // Pulsante View / Allenati!
        const viewBtn = document.createElement("button");
        viewBtn.dataset.id = item.id;
        viewBtn.className = (today >= start && today <= end)
            ? "view-btn button-ai"
            : "view-btn";
        viewBtn.textContent = (today >= start && today <= end)
            ? "Allenati!"
            : "Visualizza";
        viewBtn.addEventListener("click", () => {
            window.location.href = `/account/gym-programs/view/${item.id}`;
        });

        // Pulsante Modifica
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn material-icon-button";
        editBtn.dataset.id = item.id;
        editBtn.innerHTML = "<i class=\"material-icons\" data-id=\"${item.id}\">edit</i>";
        editBtn.addEventListener("click", () => {
            window.location.href = `/account/gym-programs/edit/${item.id}`;
        });

        // Pulsante Duplicazione
        const duplicateBtn = document.createElement("button");
        duplicateBtn.className = "duplicate-btn material-icon-button";
        duplicateBtn.dataset.id = item.id;
        duplicateBtn.innerHTML = "<i class=\"material-icons\" data-id=\"${item.id}\">content_copy</i>";
        duplicateBtn.addEventListener("click", async () => {
            const res = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan/clone/${item.id}/`, {
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
                window.location.href = `/account/gym-programs/edit/${new_plan_id}`;
            }, 5000);
        });

        // Pulsante Elimina
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn material-icon-button";
        deleteBtn.dataset.id = item.id;
        deleteBtn.innerHTML = "<i class=\"material-icons\" data-id=\"${item.id}\">delete</i>";
        deleteBtn.addEventListener("click", async () => {
            const deleteResponse = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan/delete/${item.id}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'),
                }
            });

            if (deleteResponse.ok) location.reload();
        });

        buttonsDiv.append(viewBtn, editBtn, duplicateBtn, deleteBtn);
        div.append(detailsDiv, buttonsDiv);
        container.appendChild(div);
    }
</script>
