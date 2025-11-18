<!-- Collegamento al file CSS per lo stile del profilo utente -->
<head>
    <link rel="stylesheet" type="text/css" href="/css/account/style_account.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Overlay di caricamento -->
<div id="loading-overlay" style="display: none;">
    <div class="spinnerIA">Sto elaborando...</div>
</div>

<!-- Messaggio di benvenuto e obiettivo scelto dall’IA -->
<div class="recap">
    <h2>Bentornato, {account.first_name}</h2>
    <p>
        La IA ha scelto che l'obiettivo che fa per te è
        <b style="color:white">{account.goal_targets}</b>.
        {account.goal_targets_explanation}
    </p>
</div>

<!-- Form per aggiornamento dati anagrafici -->
<form class="form-container" id="updateDetailsForm" on:submit={updateDetails}>
    <h3>Dati anagrafici</h3>

    <!-- Messaggi di stato (errore, avviso, info) -->
    <div class="error" id="error1"><p></p></div>
    <div class="warning" id="warning1"><p></p></div>
    <div class="info" id="info1"><p></p></div>

    <!-- Input username -->
    <div class="input-container">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" bind:value={account.username}>
    </div>

    <!-- Email disabilitata (non modificabile) -->
    <div class="input-container">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="Email..." bind:value={account.email} required disabled>
    </div>

    <!-- Nome e cognome -->
    <div class="form-group">
        <div class="input-container">
            <label for="name">Nome:</label>
            <input type="text" id="name" name="name" placeholder="Nome..." bind:value={account.first_name} required>
        </div>
        <div class="input-container">
            <label for="surname">Cognome:</label>
            <input type="text" id="surname" name="surname" placeholder="Cognome..." bind:value={account.last_name} required>
        </div>
    </div>

    <!-- Data di nascita -->
    <div class="input-container">
        <label for="birthdate">Data di nascita:</label>
        <input type="date" id="birthdate" name="birthdate" bind:value={account.date_of_birth} required>
    </div>

    <!-- Sesso e altezza -->
    <div class="form-group">
        <div class="input-container">
            <label for="gender">Sesso biologico:</label>
            <select id="gender" name="gender" bind:value={account.biological_gender} required>
                <option value="M">Maschile</option>
                <option value="F">Femminile</option>
            </select>
        </div>
        <div class="input-container">
            <label for="height">Altezza (in centimetri):</label>
            <input type="number" id="height" name="height" min="1" max="300" placeholder="Altezza..." bind:value={account.height_cm} required>
        </div>
    </div>

    <!-- Upload immagine profilo -->
    <div class="input-container">
        <label for="file">Immagine di profilo:</label>
        <input type="file" id="file" name="file" accept="image/*" on:change={handleFileChange}>
    </div>

    <!-- Pulsante invio -->
    <div class="form-group">
        <button type="submit">Aggiorna dati</button>
    </div>
</form>

<!-- Form per aggiornare l'obiettivo -->
<form class="form-container" id="updateObjectiveForm" method="POST">
    <h3>Obiettivo</h3>
    <div class="error" id="error2"><p></p></div>
    <div class="input-container">
        <label for="goal_description">Qual'è il tuo obiettivo?</label>
        <textarea id="goal_description" name="goal_description" placeholder="Descrivi il tuo obiettivo..." required>{account.goal_description}</textarea>
    </div>
    <div class="form-group">
        <button class="button-ai" type="submit" on:click={updateGoal}>Aggiorna obiettivo</button>
    </div>
</form>

<!-- Form per aggiornare la password -->
<form class="form-container" id="updatePasswordForm" on:submit={updatePassword}>
    <h3>Aggiorna password</h3>
    <div class="error" id="error3"><p></p></div>
    <div class="warning" id="warning3"><p></p></div>
    <div class="info" id="info3"><p></p></div>

    <div class="form-group">
        <div class="input-container">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Password..." bind:value={password} required>
        </div>
        <div class="input-container">
            <label for="conf-password">Conferma password:</label>
            <input type="password" id="conf-password" name="conf-password" placeholder="Conferma password..." bind:value={conf_password} required>
        </div>
    </div>

    <div class="form-group">
        <button type="submit">Aggiorna password</button>
    </div>
</form>

<!-- Sezione lista alimenti modificabili -->
<div class="form-container">
    <h3>Alimenti aggiunti</h3>
    <p>Puoi modificare alimenti già aggiunti.</p>
    <div class="food-item-list">
        {#if foodItems.length > 0}
            <ul class="food-list">
                {#each foodItems as item}
                    <li class="food-list-item">
                        <span>{item.name}{item.brand ? ` (${item.brand})` : ''}</span>
                        <button class="edit-button" on:click={() => editFoodModal(item)}>Modifica</button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Nessun alimento aggiunto!</p>
        {/if}
    </div>
</div>

<!-- Sezione lista sezioni pasti -->
<div class="form-container">
    <h3>Sezioni aggiunte</h3>
    <p>Puoi modificare le sezioni dei tuoi pasti.</p>
    <div class="food-item-section-list">
        {#if foodSectionItems.length > 0}
            <ul class="food-list">
                {#each foodSectionItems as item}
                    <li class="food-list-item">
                        <span>{item.name} (orario previsto {item.start_time})</span>
                        <button class="edit-button" on:click={() => editFoodSectionModal(item)}>Modifica</button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Nessuna sezione di alimenti aggiunto!</p>
        {/if}
    </div>
</div>

<!-- Modal modifica alimento -->
{#if showFoodModal}
    <div class="modal">
        <div class="modal-content food-item-add" style="width: 800px">
            <h3>Modifica Alimento</h3>

            <div class="error" id="errorFood"><p></p></div>

            <!-- Nome e marca -->
            <div class="form-group">
                <div class="input-container">
                    <label for="name">Nome:</label>
                    <input bind:value={edit_food_item.name} type="text" id="name" placeholder="Nome alimento..." />
                </div>
                <div class="input-container">
                    <label for="brand">Marca:</label>
                    <input bind:value={edit_food_item.brand} type="text" id="brand" placeholder="Marca (opzionale)..." />
                </div>
            </div>

            <!-- Barcode manuale o via fotocamera -->
            <label>Barcode:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input bind:value={edit_food_item.barcode} type="text" placeholder="Inserisci barcode..." />
                <button type="button" on:click={startScanner}>Tramite fotocamera</button>
            </div>

            <!-- Valori nutrizionali -->
            {#each [
                { id: "kcal", label: "Kcal" },
                { id: "protein", label: "Proteine" },
                { id: "carboids", label: "Carboidrati" },
                { id: "sugar", label: "Zuccheri" },
                { id: "fats", label: "Grassi" },
                { id: "saturated_fats", label: "Grassi Saturi" },
                { id: "fiber", label: "Fibre" }
            ] as field}
                <div class="form-group">
                    <div class="input-container">
                        <label for={field.id}>{field.label} per 100g:</label>
                        <input bind:value={edit_food_item[field.id]} type="number" id={field.id} />
                    </div>
                </div>
            {/each}

            <div class="separator-row"></div>

            <button on:click={editFoodItem}>Modifica</button>
            <button class="close-button" on:click={() => showFoodModal = false}>Annulla</button>
        </div>
    </div>
{/if}

<!-- Modal scanner barcode -->
{#if showScannerModal}
    <div class="modal">
        <div class="modal-content modal-scan" style="width: 90%; max-width: 500px;">
            <h3>Scansione Barcode</h3>
            <div id="barcode-reader"></div>
            <div class="separator-row"></div>
            <button class="close-button" on:click={() => { stopScanner(); showScannerModal = false; }}>Chiudi</button>
        </div>
    </div>
{/if}

<!-- Modal modifica sezione -->
{#if showSectionModal}
    <div class="modal">
        <div class="modal-content modal-section" style="width: 500px">
            <h3>Modifica Sezione</h3>
            <div class="error" id="errorSection"><p></p></div>
            <label for="newSectionName">Nome sezione:</label>
            <input type="text" id="newSectionName" bind:value={newSectionName} placeholder="Es: Colazione, Pranzo..." />
            <label for="newSectionTime">Orario previsto:</label>
            <input type="number" id="newSectionTime" min="0" max="24" bind:value={newSectionTime} placeholder="Solo ora (0-24)" />
            <div class="separator-row"></div>
            <button on:click={editFoodSection}>Salva</button>
            <button class="close-button" on:click={() => showSectionModal = false}>Annulla</button>
        </div>
    </div>
{/if}


<script>
    import { onMount, tick } from "svelte";
    import { getCookie } from 'svelte-cookie';
    import { Html5Qrcode } from "html5-qrcode";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    // Account utente e valore iniziale dell'username
    let account = {};
    let first_username = "";

    // File immagine profilo selezionato
    let selectedFile = null;

    // Lista alimenti aggiunti e stato modale alimento
    let foodItems = [];
    let showFoodModal = false;

    // Dati dell’alimento da modificare
    let edit_food_item = {
        id: 0,
        name: "",
        brand: "",
        barcode: "",
        kcal: 0,
        protein: 0,
        carboids: 0,
        sugar: 0,
        fats: 0,
        saturated_fats: 0,
        fiber: 0
    };

    // Scanner barcode (istanza e stato)
    let scanner;
    let scanning = false;
    let showScannerModal = false;

    // Lista sezioni dei pasti e stato modale sezione
    let foodSectionItems = [];
    let showSectionModal = false;
    let newSectionId = 0;
    let newSectionName = "";
    let newSectionTime = "";

    /**
     * Avvia la fotocamera e inizializza il lettore barcode.
     * Viene visualizzato il modale con l'elemento #barcode-reader.
     */
    async function startScanner() {
        showScannerModal = true;
        await tick(); // Aspetta che il DOM sia pronto (render modale)

        scanner = new Html5Qrcode("barcode-reader");
        scanner.start(
            { facingMode: "environment" },  // Fotocamera posteriore
            { fps: 10, qrbox: 250 },        // Impostazioni di scansione
            (decodedText) => {
                // Comportamento se barcode è stato scansionato
                if (showFoodModal) {
                    // Se modale alimento è aperto, assegna direttamente
                    edit_food_item.barcode = decodedText;
                } else {
                    // Altrimenti, lo inserisce nel campo ricerca e simula input
                    const searchInput = document.getElementById("search");
                    if (searchInput) {
                        searchInput.value = decodedText;
                        searchInput.focus();
                        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }

                // Ferma scanner e chiude modale
                stopScanner();
                showScannerModal = false;
            }
        );

        scanning = true;
    }

    /**
     * Ferma la scansione del barcode e libera risorse.
     */
    function stopScanner() {
        if (scanner && scanning) {
            scanner.stop().then(() => {
                scanning = false;
                scanner.clear(); // Rimuove contenuto da #barcode-reader
            });
        }
    }

    /**
     * Effettua una richiesta GET per recuperare i dettagli dell'account utente.
     */
    async function fetchAccount() {
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/detailsaccount/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"), // Token CSRF come autorizzazione
            },
        });

        account = await response.json(); // Parsing e salvataggio dati account
        account.date_of_birth = formatDateForInput(account.date_of_birth)
        first_username = account.username;
    }

    /**
     * Recupera tutti gli alimenti associati all’utente.
     */
    async function fetchFoodItems() {
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-item/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"),
            },
        });

        foodItems = await response.json(); // Parsing lista alimenti utente
    }

    /**
     * Recupera tutte le sezioni (pasti) dell’utente.
     */
    async function fetchFoodSectionItems() {
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan-section/me/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"),
            },
        });

        foodSectionItems = await response.json(); // Parsing lista sezioni pasti
    }

    /**
     * Apre il modale di modifica alimento e imposta i dati correnti
     */
    function editFoodModal(item) {
        showFoodModal = true;

        // Popola il form con i valori esistenti dell'alimento selezionato
        edit_food_item = {
            id: item.id,
            name: item.name,
            brand: item.brand,
            barcode: item.barcode,
            kcal: item.kcal_per_100g,
            protein: item.protein_per_100g,
            carboids: item.carbs_per_100g,
            sugar: item.sugars_per_100g,
            fats: item.fats_per_100g,
            saturated_fats: item.saturated_fats_per_100g,
            fiber: item.fiber_per_100g
        };
    }

    /**
     * Invia una richiesta PATCH per aggiornare l'alimento e gestisce errori
     */
    async function editFoodItem() {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/food-item/update/${edit_food_item.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"),
            },
            body: JSON.stringify({
                name: edit_food_item.name,
                barcode: edit_food_item.barcode,
                brand: edit_food_item.brand,
                kcal_per_100g: edit_food_item.kcal,
                protein_per_100g: edit_food_item.protein,
                carbs_per_100g: edit_food_item.carboids,
                sugars_per_100g: edit_food_item.sugar,
                fats_per_100g: edit_food_item.fats,
                saturated_fats_per_100g: edit_food_item.saturated_fats,
                fiber_per_100g: edit_food_item.fiber,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("errorFood").style.display = "none";
            showFoodModal = false;
            location.reload(); // Ricarica dati dopo modifica
        } else {
            displayFoodError(result);
        }
    }

    /**
     * Mostra un messaggio di errore nella sezione alimento
     */
    function displayFoodError(errors) {
        const errorBox = document.getElementById("errorFood");
        errorBox.style.display = "block";

        const fieldMap = {
            name: "NOME",
            barcode: "BARCODE",
            brand: "MARCA",
            kcal_per_100g: "CHILOCALORIE",
            protein_per_100g: "PROTEINE",
            carbs_per_100g: "CARBOIDRATI",
            sugars_per_100g: "ZUCCHERI",
            fats_per_100g: "GRASSI",
            saturated_fats_per_100g: "GRASSI SATURI",
            fiber_per_100g: "FIBRE"
        };

        for (const field in fieldMap) {
            if (errors[field]) {
                errorBox.firstChild.textContent = `${fieldMap[field]}: ${errors[field][0]}`;
                break;
            }
        }
    }

    /**
     * Apre il modale per la modifica sezione e imposta i dati correnti
     */
    function editFoodSectionModal(item) {
        showSectionModal = true;
        newSectionId = item.id;
        newSectionName = item.name;
        newSectionTime = item.start_time;
    }

    /**
     * Invia una richiesta PATCH per aggiornare la sezione del pasto
     */
    async function editFoodSection() {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan-section/update/${newSectionId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"),
            },
            body: JSON.stringify({
                name: newSectionName,
                start_time: newSectionTime,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            location.reload();
        } else {
            if(result.name) showMessage("NOME SEZIONE: " + result.name[0], "errorSection")
            else if(result.start_time) showMessage("NOME SEZIONE: " + result.start_time[0], "errorSection")
        }
    }

    // Gestisce il cambio dell'immagine profilo e aggiorna la variabile `selectedFile`
    function handleFileChange(event) {
        selectedFile = event.target.files[0];
    }

    /**
     * Aggiorna i dettagli dell'account (username, nome, cognome, data di nascita, altezza, sesso)
     * Invia fino a 3 richieste successive: auth PUT, account PATCH, immagine PATCH
     */
    async function updateDetails(event) {
        event.preventDefault();

        // Se username non è cambiato, cambia temporaneamente per evitare conflitti
        if (first_username === account.username) {
            await fetch("http://127.0.0.1:8000/api/v1/auth/user/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie("csrftoken"),
                },
                body: JSON.stringify({ username: account.username + "1234567890" })
            });
        }

        // Aggiorna auth user (username, nome, cognome)
        const response1 = await fetch("http://127.0.0.1:8000/api/v1/auth/user/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"),
            },
            body: JSON.stringify({
                username: account.username,
                first_name: account.first_name,
                last_name: account.last_name
            })
        });

        const data1 = await response1.json();

        if (response1.ok) {
            // Aggiorna dati personali (altezza, genere, data di nascita)
            const response2 = await fetch("http://127.0.0.1:8000/api/v1/data/detailsaccount/me/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie("csrftoken"),
                },
                body: JSON.stringify({
                    author: account.author,
                    date_of_birth: account.date_of_birth,
                    biological_gender: account.biological_gender,
                    height_cm: account.height_cm
                })
            });

            const data2 = await response2.json();

            if (response2.ok) {
                // Se è stato selezionato un file, aggiorna immagine profilo
                if (selectedFile) {
                    const formData = new FormData();
                    formData.append("profile_picture", selectedFile);

                    const response3 = await fetch("http://127.0.0.1:8000/api/v1/data/detailsaccount/me/", {
                        method: "PATCH",
                        body: formData,
                        headers: {
                            "Authorization": "Token " + getCookie("csrftoken")
                        }
                    });

                    if (response3.ok) {
                        showMessage("Dati anagrafici aggiornati!", "info1");
                    } else if (data1.profile_picture?.length) {
                        showMessage(data1.profile_picture[0], "error1");
                    }
                } else {
                    showMessage("Dati anagrafici aggiornati!", "info1");
                }
            } else {
                // Gestione errori da response2
                const fields = ["date_of_birth", "biological_gender", "height_cm", "profile_picture"];
                for (const field of fields) {
                    if (data1[field]?.length) {
                        showMessage(data1[field][0], "error1");
                        break;
                    }
                }
            }
        } else {
            // Gestione errori da response1
            const fields = ["username", "first_name", "last_name"];
            for (const field of fields) {
                if (data1[field]?.length) {
                    showMessage(data1[field][0], "error1");
                    break;
                }
            }
        }

        first_username = account.username;
    }

    /**
     * Aggiorna la descrizione dell'obiettivo
     */
    async function updateGoal(event) {
        event.preventDefault();

        document.getElementById("loading-overlay").style.display = "flex";

        const goal_description = document.getElementById("goal_description").value;

        const response = await fetch("http://127.0.0.1:8000/api/v1/data/detailsaccount/me/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie("csrftoken"),
            },
            body: JSON.stringify({ goal_description })
        });

        if (response.ok) {
            location.reload();
        } else {
            alert("Errore nell'aggiornamento. Riprova.");
            document.getElementById("loading-overlay").style.display = "none";
        }
    }

    let password = "";
    let conf_password = "";

    /**
     * Cambia la password utente previa conferma
     */
    async function updatePassword(event) {
        event.preventDefault();

        if (password === conf_password) {
            const response = await fetch("http://127.0.0.1:8000/api/v1/auth/password/change/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie("csrftoken"),
                },
                body: JSON.stringify({
                    new_password1: password,
                    new_password2: conf_password
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage("Password aggiornata!", "info3")
            } else {
                showMessage(data.new_password2[0], "error3")
            }
        } else {
            showMessage("Le password inserite non coincidono!", "warning3")
        }
    }

    /**
     * Hook Svelte che si attiva al montaggio del componente.
     * Esegue:
     * - verifica autenticazione
     * - evidenziazione voce corrente nel menu
     * - fetch dei dati principali dell’utente
     */
    onMount(async () => {
        if (getCookie("csrftoken") === "") {
            location.href = "/";
            return;
        }

        toggleClassByPathEquals({
            targetId: "account-icon-item",
            className: "current-page",
            removeFromIds: [
                "weight-icon-item",
                "body-measurements-icon-item",
                "food-program-icon-item",
                "gym-program-icon-item"
            ]
        });

        await Promise.all([
            fetchAccount(),
            fetchFoodItems(),
            fetchFoodSectionItems()
        ]);

        isLoading = false;
    });
</script>