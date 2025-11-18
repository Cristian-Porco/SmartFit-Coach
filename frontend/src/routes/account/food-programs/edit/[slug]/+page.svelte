<head>
    <link rel="stylesheet" type="text/css" href="/css/account/food-programs/style_edit_food_programs.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

{#if showNaturalLanguageModal}
    <div class="modal">
        <div class="modal-content">
            <h3>Inserisci alimenti tramite linguaggio naturale</h3>

            <div class="error" id="errorNaturalLanguage">
                <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
            </div>

            <!-- Dropdown sezioni -->
            <label for="sectionSelect">In che sezione della giornata vuoi inserire gli alimenti?</label>
            <select id="sectionSelect" bind:value={selectedSection}>
                <option disabled value="">-- Seleziona una sezione --</option>
                {#each foodSections as section}
                    <option value={section.id}>{section.name}</option>
                {/each}
            </select>

            <!-- Input descrizione pasto -->
            <label for="naturalLanguageInput" style="margin-top: 10px;">
                Scrivi liberamente cosa hai mangiato: il sistema identificherà automaticamente gli alimenti, le parole chiave e le quantità stimate.
            </label>
            <textarea
                    id="naturalLanguageInput"
                    rows="4"
                    bind:value={naturalLanguageInput}
                    placeholder="Ad esempio: 'Ho mangiato una pasta al sugo con delle patate fritte'"
            ></textarea>

            <div class="separator-row"></div>

            <!-- Pulsanti -->
            <button class="button-ai" id="addNaturalLanguage1" on:click={showAIDivNaturalLanguage1}>Inserisci</button>

            <div id="ai-box-nl" class="ai-box hidden">
                <h3>Risposta intelligente sui dati</h3>
                <div id="ai-content-nl" class="ai-loader"></div>
            </div>

            <button class="button-ai" id="addNaturalLanguage2" on:click={showAIDivNaturalLanguage2} style="display: none">Vuoi confermare la risposta?</button>

            <button class="close-button" on:click={() => showNaturalLanguageModal = false}>Annulla</button>
        </div>
    </div>
{/if}

{#if showImageModal}
    <div class="modal">
        <div class="modal-content">
            <h3>Inserisci alimenti tramite immagine</h3>

            <div class="error" id="errorImage">
                <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
            </div>

            <!-- Dropdown sezioni -->
            <label for="sectionSelect">In che sezione della giornata vuoi inserire gli alimenti?</label>
            <select id="sectionSelect" bind:value={selectedSection}>
                <option disabled value="">-- Seleziona una sezione --</option>
                {#each foodSections as section}
                    <option value={section.id}>{section.name}</option>
                {/each}
            </select>

            <!-- Input descrizione pasto -->
            <label for="naturalLanguageInput" style="margin-top: 10px;">
                Carica l'immagine del tuo pasto:
            </label>
            <input type="file" accept="image/*" on:change={(e) => imageInput = e.target.files[0]} />

            <div class="separator-row"></div>

            <!-- Pulsanti -->
            <button class="button-ai" id="addImage1" on:click={showAIDivImage1}>Inserisci</button>

            <div id="ai-box-i" class="ai-box hidden">
                <h3>Risposta intelligente sui dati</h3>
                <div id="ai-content-i" class="ai-loader"></div>
            </div>

            <button class="button-ai" id="addImage2" on:click={showAIDivImage2} style="display: none">Vuoi confermare la risposta?</button>

            <button class="close-button" on:click={() => showImageModal = false}>Annulla</button>
        </div>
    </div>
{/if}

{#if showGenerateFoodPlanModal}
    <div class="modal">
        <div class="modal-content">
            <h3>Genera la scheda alimentare in base ai macronutrienti</h3>

            <p style="margin-bottom: 10px"><b>ATTENZIONE!</b> Cliccando questo pulsante, <b>la scheda alimentare attuale verrà sovrascritta con i nuovi elementi</b>. Questa operazione non può essere annullata.</p>

            <button class="button-ai" id="addImage2" on:click={showAIGenerateFoodPlan}>Procedi</button>

            <button class="close-button" on:click={() => showGenerateFoodPlanModal = false}>Annulla</button>
        </div>
    </div>
{/if}

{#if showGenerateAlternativeModal}
    <div class="modal">
        <div class="modal-content">
            <h3>Genere pasti alternativi di una sezione</h3>

            <div class="error" id="errorAlternative">
                <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
            </div>

            <!-- Dropdown sezioni -->
            <label for="sectionSelect">In che sezione della giornata vuoi generare i pasti alternativi?</label>
            <select id="sectionSelect" bind:value={selectedSection}>
                <option disabled value="">-- Seleziona una sezione --</option>
                {#each foodSections as section}
                    <option value={section.id}>{section.name}</option>
                {/each}
            </select>

            <div class="separator-row"></div>

            <!-- Pulsanti -->
            <button class="button-ai" id="addGenerateAlternative" on:click={showAIGenerateAlternative}>Inserisci</button>

            <button class="close-button" on:click={() => showGenerateAlternativeModal = false}>Annulla</button>
        </div>
    </div>
{/if}

<div id="loading-overlay" style="display: none;">
    <div class="spinnerIA">Sto elaborando...</div>
</div>

<div class="fab-container">
    <!-- Pulsanti secondari -->
    {#if expanded}
        <div class="fab-sub" on:click={()=>{showNaturalLanguageModal=true;}}>Inserisci alimenti tramite linguaggio naturale</div>
        <div class="fab-sub" on:click={()=>{showImageModal=true;}}>Inserisci alimenti tramite immagine</div>
        {#if !isEmpty}<div class="fab-sub" on:click={optimizeQuantity}>Ottimizza la quantità degli alimenti inseriti</div>{/if}
        {#if !isEmpty}<div class="fab-sub" on:click={()=>{showGenerateAlternativeModal=true;}}>Genera pasti alternativi di una sezione</div>{/if}
        {#if isEmpty}<div class="fab-sub" on:click={()=>{showGenerateFoodPlanModal=true;}}>Genera la scheda alimentare in base ai macronutrienti</div>{/if}
    {/if}

    <!-- Pulsante principale -->
    <button class="button-ai fab-main" on:click={toggleMenu}>
        Elabora i dati con IA
    </button>
</div>

<!-- Contenitore intestazione della pagina della scheda alimentare -->
<div class="container">
    <div><p><b>Modifica</b></p><h1 class="titlePage">Scheda alimentare</h1></div>
    <div id="section_date">
        <p><b>Data inizio:</b> <input type="date" id="start_date" required></p>
        <p><b>Data fine:</b> <input type="date" id="end_date" required></p>
    </div>
</div>

<!-- Contenitore per messaggi di errore -->
<div class="error" id="error1">
    <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
</div>

<!-- Contenitore principale del form -->
<div class="form-container">
    <!-- Tabella responsiva per la visualizzazione della scheda alimentare -->
    <table class="responsive-table">
        <thead>
        <tr>
            <!-- Intestazioni principali delle colonne -->
            <th rowspan="2" colspan="2" class="header-title name-column">Nome</th>
            <th rowspan="2" class="header-title">Grammi</th>
            <th class="header-title kcal_column">Kcal</th>
            <th class="header-title protein_column">Proteine</th>
            <th class="header-title carbs_column">Carboidrati</th>
            <th class="header-title sugars_column">Zuccheri</th>
            <th class="header-title fats_column">Grassi</th>
            <th class="header-title satured_fats_column">Grassi Saturi</th>
            <th class="header-title fiber_column">Fibre</th>
        </tr>
        <tr>
            <!-- Seconda riga di intestazioni con input per limiti nutrizionali -->
            <!-- I valori inseriti saranno usati per i calcoli e i filtri -->
            <th class="header-limits kcal_column" id="max_kcal">
                <input type="number" placeholder="Max Kcal..." class="max_kcal_value" on:blur={autoCalculationKCal}>
            </th>
            <th class="header-limits protein_column" id="max_protein">
                <input type="number" placeholder="Max Proteine..." class="max_protein_value" on:blur={autoCalculationKCal}>
            </th>
            <th class="header-limits carbs_column" id="max_carbs">
                <input type="number" placeholder="Max Carboidrati..." class="max_carbs_value" on:blur={autoCalculationKCal}>
            </th>
            <!-- Celle vuote: i valori verranno inseriti dinamicamente da JS -->
            <th class="header-limits sugars_column" id="max_sugars"></th>
            <th class="header-limits fats_column" id="max_fats">
                <input type="number" placeholder="Max Grassi..." class="max_fats_value" on:blur={autoCalculationKCal}>
            </th>
            <th class="header-limits satured_fats_column" id="max_saturated_sugars"></th>
            <th class="header-limits fiber_column" id="max_fiber"></th>
        </tr>
        </thead>

        <!-- Corpo della tabella: alimenti e sezioni vengono inseriti dinamicamente -->
        <tbody id="containerFoodPlan">
        <!-- Riga alternativa per inserimento limiti su dispositivi mobili -->
        <tr id="detailsFoodPlanMobile">
            <td data-label="Max Kcal:">
                <input type="number" placeholder="Max Kcal..." class="max_kcal_value" on:blur={autoCalculationKCal}>
            </td>
            <td data-label="Max Proteine:">
                <input type="number" placeholder="Max Proteine..." class="max_protein_value" on:blur={autoCalculationKCal}>
            </td>
            <td data-label="Max Carboidrati:">
                <input type="number" placeholder="Max Carboidrati..." class="max_carbs_value" on:blur={autoCalculationKCal}>
            </td>
            <td data-label="Max Grassi:">
                <input type="number" placeholder="Max Grassi..." class="max_fats_value" on:blur={autoCalculationKCal}>
            </td>
        </tr>
        </tbody>
    </table>
</div>

<!-- Bottone per aggiungere una nuova sezione/pasto alla scheda -->
<button on:click={() => showModal = true}>Aggiungi pasto</button>

<!-- Separatore visuale tra sezione e azioni -->
<div class="separator-row"></div>

<!-- Bottone per salvare le modifiche alla scheda alimentare -->
<button on:click={saveFoodPlan}>Modifica scheda alimentare</button>

<!-- Modal principale per l'aggiunta di un nuovo pasto -->
{#if showModal}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi Pasto</h3>

            <!-- Sezione contenente la ricerca alimenti e i dettagli -->
            <div class="modal-container">

                <!-- Sezione ricerca alimento -->
                <div class="food-search">
                    <label for="search">Cerca alimento:</label>
                    <div class="search-bar">
                        <input
                                type="text"
                                id="search"
                                bind:value={searchQuery}
                                on:input={filterFoodItems}
                                placeholder="Cerca alimento..."
                        />
                        <button on:click={startScanner}>
                            Scansiona barcode
                        </button>
                    </div>

                    <!-- Lista filtrata di alimenti disponibili -->
                    <ul class="food-list">
                        {#each filteredFoodItems as food}
                            {#if food.brand == null}
                                <li on:click={() => selectFood(food)}>{food.name}</li>
                            {:else}
                                <li on:click={() => selectFood(food)}>{food.name} ({food.brand})</li>
                            {/if}
                        {/each}
                    </ul>

                    <!-- Pulsante per creare un nuovo alimento manualmente -->
                    <button style="margin-top: 10px; width: 100%;" on:click={createFoodItem}>
                        Crea nuovo alimento
                    </button>
                </div>

                <!-- Dettagli dell'alimento selezionato -->
                <div class="food-details">
                    {#if selectedFood}
                        <h3>
                            {selectedFood.name}
                            {#if selectedFood.brand}
                                ({selectedFood.brand})
                            {/if}
                        </h3>

                        <p style="text-align: center">Valori nutrizionali per 100g</p>

                        <!-- Valori nutrizionali visualizzati -->
                        <div><p><b>Kcal:</b></p><p>{selectedFood.kcal_per_100g.toFixed(1)}</p></div>
                        <div><p><b>Proteine:</b></p><p>{selectedFood.protein_per_100g.toFixed(1)}g</p></div>
                        <div><p><b>Carboidrati:</b></p><p>{selectedFood.carbs_per_100g.toFixed(1)}g</p></div>
                        <div><p><b>Zuccheri:</b></p><p>{selectedFood.sugars_per_100g.toFixed(1)}g</p></div>
                        <div><p><b>Grassi:</b></p><p>{selectedFood.fats_per_100g.toFixed(1)}g</p></div>
                        <div><p><b>Grassi Saturi:</b></p><p>{selectedFood.saturated_fats_per_100g.toFixed(1)}g</p></div>
                        <div><p><b>Fibre:</b></p><p>{selectedFood.fiber_per_100g.toFixed(1)}g</p></div>
                    {/if}
                </div>
            </div>

            <div class="separator-row"></div>

            <!-- Input per la quantità in grammi -->
            <label for="quantity">Quantità alimento (in grammi):</label>
            <input
                    type="number"
                    id="quantity"
                    bind:value={selectedQuantity}
                    placeholder="Quantità alimento..."
            />

            <!-- Selezione della sezione (pasto) -->
            <label for="section">Sezione alimento:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <select id="section" bind:value={selectedSection}>
                    <option value="">Seleziona sezione</option>
                    {#each foodSections as section}
                        <option value={section.id}>{section.name}</option>
                    {/each}
                </select>

                <!-- Pulsante per creare una nuova sezione -->
                <button on:click={createFoodItemSection}>Crea nuova sezione</button>
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button on:click={addMeal}>Aggiungi</button>
            <button class="close-button" on:click={() => showModal = false}>Annulla</button>
        </div>
    </div>
{/if}

<!-- Modal per la creazione di una nuova sezione (pasto) -->
{#if showSectionModal}
    <div class="modal">
        <div class="modal-content modal-section" style="width: 500px">
            <h3>Nuova Sezione</h3>

            <!-- Input nome sezione -->
            <label for="newSectionName">Nome sezione:</label>
            <input
                    type="text"
                    id="newSectionName"
                    bind:value={newSectionName}
                    placeholder="Nome sezione... (ad esempio, Colazione, Pranzo, ...)"
            />

            <!-- Input orario previsto -->
            <label for="newSectionTime" style="margin-top: 10px;">Orario previsto (solo ora):</label>
            <input
                    type="number"
                    id="newSectionTime"
                    min="0"
                    max="24"
                    bind:value={newSectionTime}
                    placeholder="Orario previsto del pasto..."
            />

            <div class="separator-row"></div>

            <!-- Pulsanti -->
            <button on:click={saveFoodItemSection}>Salva</button>
            <button class="close-button" on:click={() => showSectionModal = false}>Annulla</button>
        </div>
    </div>
{/if}

<!-- Modal per la creazione di un nuovo alimento -->
{#if showFoodModal}
    <div class="modal">
        <div class="modal-content food-item-add" style="width: 800px">
            <h3>Nuovo Alimento</h3>

            <!-- Nome e marca -->
            <div class="form-group">
                <div class="input-container">
                    <label for="name">Nome:</label>
                    <input bind:value={new_food_item.name} type="text" id="name" placeholder="Nome alimento..." />
                </div>
                <div class="input-container">
                    <label for="brand">Marca:</label>
                    <input bind:value={new_food_item.brand} type="text" id="brand" placeholder="Marca (opzionale)..." />
                </div>
            </div>

            <!-- Barcode -->
            <label>Barcode:</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input bind:value={new_food_item.barcode} type="text" placeholder="Inserisci barcode manualmente..." />
                <button type="button" on:click={startScanner}>Inserisci barcode tramite fotocamera</button>
            </div>

            <!-- Valori nutrizionali per 100g -->
            <div class="form-group">
                <div class="input-container">
                    <label for="kcal">Chilocalorie (Kcal) per 100g:</label>
                    <input bind:value={new_food_item.kcal} type="number" id="kcal"/>
                </div>
            </div>

            <div class="form-group">
                <div class="input-container">
                    <label for="protein">Proteine per 100g:</label>
                    <input bind:value={new_food_item.protein} type="number" id="protein"/>
                </div>
                <div class="input-container">
                    <label for="carboids">Carboidrati per 100g:</label>
                    <input bind:value={new_food_item.carboids} type="number" id="carboids"/>
                </div>
            </div>

            <div class="form-group">
                <div class="input-container">
                    <label for="sugar">Zuccheri per 100g:</label>
                    <input bind:value={new_food_item.sugar} type="number" id="sugar"/>
                </div>
                <div class="input-container">
                    <label for="fats">Grassi per 100g:</label>
                    <input bind:value={new_food_item.fats} type="number" id="fats"/>
                </div>
            </div>

            <div class="form-group">
                <div class="input-container">
                    <label for="saturated_fats">Grassi Saturi per 100g:</label>
                    <input bind:value={new_food_item.saturated_fats} type="number" id="saturated_fats"/>
                </div>
                <div class="input-container">
                    <label for="fiber">Fibre per 100g:</label>
                    <input bind:value={new_food_item.fiber} type="number" id="fiber"/>
                </div>
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button on:click={saveFoodItem}>Aggiungi</button>
            <button class="close-button" on:click={() => showFoodModal = false}>Annulla</button>
        </div>
    </div>
{/if}

<!-- Modal per la scansione barcode tramite fotocamera -->
{#if showScannerModal}
    <div class="modal">
        <div class="modal-content modal-scan" style="width: 90%; max-width: 500px;">
            <h3>Scansione Barcode</h3>
            <div id="barcode-reader" style="width: 100%; height: auto;"></div>
            <div class="separator-row"></div>
            <button class="close-button" on:click={() => { stopScanner(); showScannerModal = false; }}>Chiudi</button>
        </div>
    </div>
{/if}

<script>
    import { onMount, tick } from "svelte";
    import { getCookie } from "svelte-cookie";
    import { Html5Qrcode } from 'html5-qrcode';
    import {
        external_showAIDivNaturalLanguage1,
        external_showAIDivNaturalLanguage2,
        external_showAIDivImage1,
        external_showAIDivImage2,
        external_optimizeQuantity,
        external_showAIGenerateFoodPlan,
        external_showAIGenerateAlternative, external_renderFoodPlanTable, external_renderTotalRow, export_saveFoodPlan,
    } from "$lib/edit_food_programs.js";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    export let data;
    let content = [];
    let isEmpty = true;

    let showModal = false;
    let searchQuery = "";
    let foodItems = [];
    let filteredFoodItems = [];
    let selectedFood = null;
    let foodSections = [];
    let selectedSection = "";
    let selectedQuantity = null;

    let showSectionModal = false;
    let newSectionName = "";
    let newSectionTime = "";

    let showFoodModal = false;
    let scanner;
    let scanning = false;
    let showScannerModal = false;

    let expanded = false;

    let showNaturalLanguageModal = false;
    let naturalLanguageInput = "";

    let showImageModal = false;
    let imageInput = null;

    let showGenerateFoodPlanModal = false;

    let showGenerateAlternativeModal = false;

    function toggleMenu() {
        expanded = !expanded;
    }

    let total_grams = {
        "kcal": 0, "protein": 0, "carboids": 0, "sugar": 0,
        "fats": 0, "satured_fats": 0, "fiber": 0
    }

    let limit_grams = {
        "max_kcal": 0, "max_protein": 0, "max_carboids": 0, "min_sugar": 0,
        "max_sugar": 0, "max_fats": 0, "max_satured_fats": 0, "min_fiber": 0
    }

    let new_food_item = {
        "name": "", "brand": "", "barcode": "", "kcal": 0,
        "protein": 0, "carboids": 0, "sugar": 0, "fats": 0,
        "saturated_fats": 0, "fiber": 0
    }

    /**
     * Funzione che gestisce l'interazione con l'IA per analizzare una descrizione testuale di un pasto.
     *
     * Flusso logico:
     * 1. Verifica che l'utente abbia selezionato una sezione e inserito un testo.
     * 2. Nasconde il bottone iniziale e mostra il box dell'IA con effetto di transizione.
     * 3. Invia la frase all'API di parsing testuale (`/food-text-parsing/`) per ottenere un array di pasti riconosciuti.
     * 4. Se la risposta è valida e contiene almeno un alimento riconosciuto:
     *    - Mostra un bottone per procedere all'aggiunta dei cibi.
     *    - Genera una card per ogni alimento riconosciuto (nome + quantità).
     * 5. Se la risposta è vuota o non valida:
     *    - Nasconde la UI dell'IA.
     *    - Mostra un messaggio di errore informando l'utente di inserire una descrizione valida.
     * 6. Gestisce eventuali errori di comunicazione o input mancanti, mostrando un messaggio adeguato.
     */
    async function showAIDivNaturalLanguage1() {
        external_showAIDivNaturalLanguage1(selectedSection, naturalLanguageInput);
    }

    /**
     * Invia i pasti identificati dalla descrizione testuale all'API per salvarli come alimenti effettivamente consumati.
     *
     * Per ogni alimento riconosciuto:
     * - Esegue una chiamata POST all'endpoint `/food-plan-item/create/` con i dati (quantità, alimento, sezione, piano).
     * Al termine, ricarica la pagina per aggiornare la vista utente.
     */
    async function showAIDivNaturalLanguage2() {
        external_showAIDivNaturalLanguage2(selectedSection, naturalLanguageInput, data.id);
    }

    /**
     * Gestisce l'invio di un'immagine del pasto all'IA per il riconoscimento automatico degli alimenti.
     *
     * Flusso:
     * 1. Verifica che siano presenti una sezione e un'immagine valida.
     * 2. Nasconde il bottone iniziale e mostra il box IA con effetto transizione.
     * 3. Invia l'immagine al backend tramite `FormData` e riceve una lista di alimenti riconosciuti.
     * 4. Se la risposta è valida e contiene alimenti:
     *    - Mostra un bottone per procedere con l'aggiunta.
     *    - Visualizza card per ciascun alimento con nome e quantità.
     * 5. Altrimenti, mostra un errore e ripristina l'interfaccia.
     */
    async function showAIDivImage1() {
        external_showAIDivImage1(selectedSection, imageInput);
    }

    /**
     * Salva gli alimenti riconosciuti dall'immagine come pasti consumati nel piano alimentare.
     *
     * Per ogni alimento ottenuto dal parsing dell'immagine:
     * - Esegue una chiamata POST all'API `/food-plan-item/create/` con i relativi dati.
     * Ricarica infine la pagina per riflettere le modifiche.
     */
    async function showAIDivImage2() {
        external_showAIDivImage2(selectedSection, imageInput, data.id);
    }

    /**
     * Avvia l'ottimizzazione automatica delle quantità degli alimenti nel piano alimentare corrente.
     *
     * - Mostra un overlay di caricamento.
     * - Esegue una chiamata GET all'API `/optimize-grams/<id>/`.
     * - Al completamento, ricarica la pagina per mostrare le nuove quantità ottimizzate.
     */
    async function optimizeQuantity() {
        external_optimizeQuantity(data.id);
    }

    /**
     * Richiede la generazione automatica di un intero piano alimentare tramite IA.
     *
     * - Chiude il modal di conferma.
     * - Mostra un overlay di caricamento.
     * - Invia una richiesta GET all'endpoint `/generate/<id>/`.
     * - Ricarica la pagina una volta generato il piano.
     */
    async function showAIGenerateFoodPlan() {
        showGenerateFoodPlanModal = false;
        external_showAIGenerateFoodPlan(data.id);
    }

    /**
     * Richiede all'IA un'alternativa alimentare per una specifica sezione del piano.
     *
     * - Chiude il modal di conferma.
     * - Mostra un overlay di caricamento.
     * - Invia una richiesta GET all'endpoint `/generate-alternative-section/` con ID del piano e della sezione.
     * - Ricarica la pagina per visualizzare l'alternativa generata.
     */
    async function showAIGenerateAlternative() {
        if(selectedSection !== "") {
            showGenerateAlternativeModal = false;
            document.getElementById("loading-overlay").style.display = "flex";

            external_showAIGenerateAlternative(data.id, selectedSection);
        } else showMessage("Sezione non inserita!", "errorAlternative");
    }

    /**
     * Recupera in modo asincrono l'elenco completo degli alimenti dal backend.
     *
     * Effettua una richiesta HTTP `GET` all'endpoint `/food-item/`, utilizzando
     * il token CSRF per l'autenticazione tramite header `Authorization`.
     *
     * Se la risposta è valida (`response.ok`), i dati JSON ricevuti vengono assegnati
     * alla variabile globale `foodItems` e copiati in `filteredFoodItems` per uso filtrato.
     *
     * In caso di errore (es. rete assente o risposta non valida), viene mostrato
     * un messaggio di errore all'utente tramite la funzione `showMessage`.
     *
     * La funzione presuppone l'esistenza delle funzioni `getCookie()` e `showMessage()`,
     * nonché delle variabili `foodItems` e `filteredFoodItems` accessibili nel contesto.
     */
    async function fetchFoodItems() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-item/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'), // Usa il token CSRF come autenticazione
                }
            });

            if (!response.ok) {
                // In caso di risposta non valida (es. 500, 404)
                showMessage("Errore durante il caricamento degli alimenti!");
                return;
            }

            // Parsing della risposta in JSON
            foodItems = await response.json();
            filteredFoodItems = foodItems; // Aggiorna la lista filtrata
        } catch (error) {
            // In caso di errore di rete o eccezione imprevista
            showMessage("Errore durante il caricamento degli alimenti!");
        }
    }

    /**
     * Recupera in modo asincrono le sezioni del piano alimentare associate all'utente.
     *
     * Esegue una richiesta `GET` all'endpoint `/food-plan-section/me/` del backend,
     * utilizzando il token CSRF per l'autenticazione.
     *
     * Se la richiesta ha successo, assegna la risposta JSON alla variabile `foodSections`.
     * In caso di errore (es. rete non disponibile o risposta non valida), mostra
     * un messaggio di errore all'utente tramite la funzione `showMessage`.
     *
     * La funzione presuppone che `getCookie()` e `showMessage()` siano già definiti
     * e che `foodSections` sia una variabile accessibile nel contesto globale o locale.
     */
    async function fetchFoodSections() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan-section/me/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'), // Usa il token CSRF come autenticazione
                }
            });

            if (!response.ok) {
                // In caso di risposta non valida (es. 500, 404)
                showMessage("Errore durante il caricamento delle sezioni degli alimenti!");
                return;
            }

            // Parsing della risposta in JSON
            foodSections = await response.json();
        } catch (error) {
            // In caso di errore di rete o eccezione imprevista
            showMessage("Errore durante il caricamento delle sezioni degli alimenti!");
        }
    }

    /**
     * Applica lo stile di background agli elementi in base ai valori nutrizionali
     * @param {string} className - Classe degli elementi (es. "kcal_column")
     * @param {string} idPrefix - Prefisso dell'ID massimo/minimo (es. "kcal" -> "max_kcal")
     * @param {number} value - Valore corrente totale (es. total_grams.kcal)
     * @param {number} min - Valore minimo accettabile (opzionale)
     * @param {number} max - Valore massimo accettabile
     * @param {string} warnColor - Colore per "warning" (es. giallo per zuccheri)
     */
    function applyColumnStyle(className, idPrefix, value, min, max, warnColor = null) {
        const elements = document.querySelectorAll(`.${className}`);

        let backgroundStyle;

        if (max !== undefined && value > max) {
            backgroundStyle = "#ff5959"; // rosso: oltre il limite massimo
        } else if(idPrefix == "fiber" && value < min) {
            backgroundStyle = "#ff5959"; // rosso: oltre il limite massimo
        } else if (warnColor && min !== undefined && value > min && value < max) {
            backgroundStyle = warnColor; // giallo: in range ma da attenzionare
        }

        elements.forEach(el => {
            if (backgroundStyle) {
                el.style.background = backgroundStyle;
            } else {
                // Stili default per TH e righe totali
                if (el.tagName === "TH") {
                    if(el.id === 'max_fiber') el.style.background = "#e8e8e8";
                    else el.style.background = (el.id === `max_${idPrefix}`) ? "#ffffff" : "#e8e8e8";
                } else if (el.id === "totalValueRow") {
                    el.style.background = "#e8e8e8";
                } else {
                    el.style.background = "none";
                }
            }
        });
    }

    /**
     * Aggiorna dinamicamente lo stile grafico delle colonne nutrizionali in base ai limiti impostati.
     *
     * Utilizza la funzione helper `applyColumnStyle` per applicare uno stile di evidenziazione
     * (ad esempio rosso o giallo) alle celle delle tabelle nutrizionali quando i valori totali
     * superano i limiti massimi, minimi o si trovano in un intervallo da attenzionare.
     *
     * La funzione confronta i valori totali di ciascun macronutriente (`total_grams`)
     * con i rispettivi limiti definiti in `limit_grams`, e aggiorna il colore di sfondo
     * delle celle HTML corrispondenti (es. `.kcal_column`, `.protein_column`, ecc.).
     *
     * Presuppone che `total_grams` e `limit_grams` siano oggetti globali contenenti i dati nutrizionali correnti e i relativi limiti.
     * Richiede che la funzione `applyColumnStyle()` sia definita e accessibile nello scope.
     */
    function updateGraphicsLimits() {
        applyColumnStyle("kcal_column", "kcal", total_grams.kcal, undefined, limit_grams.max_kcal);
        applyColumnStyle("protein_column", "protein", total_grams.protein, undefined, limit_grams.max_protein);
        applyColumnStyle("carbs_column", "carbs", total_grams.carboids, undefined, limit_grams.max_carboids);
        applyColumnStyle("sugars_column", "sugar", total_grams.sugar, limit_grams.min_sugar, limit_grams.max_sugar, "#ffe959");
        applyColumnStyle("fats_column", "fats", total_grams.fats, undefined, limit_grams.max_fats);
        applyColumnStyle("satured_fats_column", "satured_fats", total_grams.satured_fats, undefined, limit_grams.max_satured_fats);
        applyColumnStyle("fiber_column", "fiber", total_grams.fiber, limit_grams.min_fiber, undefined);
    }

    /**
     * Calcola automaticamente il fabbisogno calorico massimo (kcal) e i relativi limiti nutrizionali,
     * a partire dai valori di proteine, carboidrati e grassi forniti dall'utente.
     *
     * I valori vengono prelevati da input con classi CSS specifiche, utilizzati per calcolare:
     * - kcal totali (proteine x4, carboidrati x4, grassi x9)
     * - soglie min/max per zuccheri, grassi saturi e fibre in base a percentuali standard
     *
     * I risultati vengono salvati nell’oggetto `limit_grams`, mostrati nel DOM e
     * riflessi sugli input con classe `.max_kcal_value` e id `#max_kcal`, includendo un'animazione di evidenziazione.
     *
     * Infine, richiama `updateGraphicsLimits()` per aggiornare lo stile visivo delle colonne nutrizionali.
     *
     * Presuppone che `limit_grams` sia un oggetto globale e che esistano nel DOM:
     * - input `.max_protein_value`, `.max_carbs_value`, `.max_fats_value`
     * - span/div con id `max_sugars`, `max_saturated_sugars`, `max_fiber`
     * - input `.max_kcal_value`, `#max_kcal`
     */
    function autoCalculationKCal() {
        // Estrai i valori dai campi input (se assenti, fallback a 0)
        limit_grams.max_protein = parseFloat(document.querySelector(".max_protein_value")?.value || 0);
        limit_grams.max_carboids = parseFloat(document.querySelector(".max_carbs_value")?.value || 0);
        limit_grams.max_fats = parseFloat(document.querySelector(".max_fats_value")?.value || 0);

        // Calcola il totale delle kcal: 1g proteine/carboidrati = 4 kcal, 1g grassi = 9 kcal
        limit_grams.max_kcal = (
            limit_grams.max_protein * 4 +
            limit_grams.max_carboids * 4 +
            limit_grams.max_fats * 9
        );

        // Calcola limiti derivati in base al fabbisogno calorico
        limit_grams.min_sugar = parseFloat(((limit_grams.max_kcal * 0.05) / 4).toFixed(1));
        limit_grams.max_sugar = parseFloat(((limit_grams.max_kcal * 0.1) / 4).toFixed(1));
        limit_grams.max_satured_fats = parseFloat(((limit_grams.max_kcal * 0.1) / 9).toFixed(1));
        limit_grams.min_fiber = parseFloat(((limit_grams.max_kcal / 1000) * 14).toFixed(1));

        // Aggiorna i testi nel DOM per zuccheri, grassi saturi e fibre
        document.getElementById("max_sugars").innerText = `${limit_grams.min_sugar}-${limit_grams.max_sugar}g`;
        document.getElementById("max_saturated_sugars").innerText = `${limit_grams.max_satured_fats}g`;
        document.getElementById("max_fiber").innerText = `almeno ${limit_grams.min_fiber}g`;

        // Funzione helper per aggiornare input con animazione "highlight"
        const animateInputs = (selector) => {
            document.querySelectorAll(selector).forEach(el => {
                el.value = limit_grams.max_kcal;
                el.classList.add("highlight");
                setTimeout(() => el.classList.remove("highlight"), 1000);
            });
        };

        // Applica l’animazione a input legati alle kcal
        animateInputs(".max_kcal_value");
        animateInputs("#max_kcal");

        // Aggiorna lo stile grafico della tabella nutrizionale
        updateGraphicsLimits();
    }

    /**
     * Filtra la lista degli alimenti (`foodItems`) in base alla stringa di ricerca (`searchQuery`).
     *
     * Il filtro è case-insensitive e considera sia il nome dell'alimento che la marca.
     * I risultati vengono salvati nella variabile `filteredFoodItems`, usata per la visualizzazione.
     *
     * Presuppone l'esistenza delle variabili globali `searchQuery`, `foodItems` e `filteredFoodItems`.
     */
    function filterFoodItems() {
        const query = searchQuery.toLowerCase();

        filteredFoodItems = foodItems.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.brand?.toLowerCase().includes(query) ||
            item.barcode?.toLowerCase().includes(query)
        );
    }

    /**
     * Imposta un alimento selezionato per l'inserimento nel piano alimentare.
     *
     * Il valore selezionato viene assegnato alla variabile globale `selectedFood`,
     * che sarà poi utilizzata nella funzione `addMeal`.
     *
     * @param {Object} food - Oggetto rappresentante l'alimento selezionato.
     */
    function selectFood(food) {
        selectedFood = food;
    }

    /**
     * Aggiunge un alimento selezionato (`selectedFood`) alla sezione selezionata (`selectedSection`)
     * del piano alimentare (`data.id`), utilizzando la quantità specificata (`selectedQuantity`).
     *
     * Invia una richiesta `POST` all’endpoint `/food-plan-item/create/` con i dati necessari.
     * Se la richiesta ha successo, ricarica la pagina. Altrimenti, mostra un messaggio di errore.
     *
     * Presuppone l’esistenza delle seguenti variabili e funzioni globali:
     * - `selectedFood`, `selectedSection`, `selectedQuantity`
     * - `data.id` (ID della scheda alimentare corrente)
     * - `getCookie()` per ottenere il token CSRF
     * - `showMessage()` o gestione diretta dell’elemento `#error1`
     */
    async function addMeal() {
        if (!selectedFood || !selectedSection || selectedQuantity == null) return;

        const response = await fetch('http://127.0.0.1:8000/api/v1/data/food-plan-item/create/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({
                eaten: false,
                quantity_in_grams: selectedQuantity,
                food_plan: data.id,
                food_item: selectedFood.id,
                food_section: selectedSection
            })
        });

        if (response.ok) {
            location.reload();
        } else {
            // Mostra errore temporaneo
            showMessage("Errore durante l'aggiunta dell'alimento alla scheda alimentare!");
        }
    }

    /**
     * Mostra il modal per la creazione di una nuova sezione alimentare.
     *
     * Imposta la variabile reattiva `showSectionModal` a `true`, che dovrebbe essere
     * utilizzata nel template per controllare la visibilità del popup/modal.
     *
     * Presuppone che `showSectionModal` sia una variabile reattiva o globale.
     */
    function createFoodItemSection() {
        showSectionModal = true;
    }

    /**
     * Salva una nuova sezione alimentare tramite richiesta `POST` al backend.
     *
     * I dati della sezione includono:
     * - `name`: nome della sezione (es. "Colazione")
     * - `start_time`: orario d'inizio della sezione
     * - `author`: ID dell'utente, prelevato tramite `getCookie('pk')`
     *
     * Se la richiesta ha successo:
     * - chiude il modal (`showSectionModal = false`)
     * - svuota i campi di input (`newSectionName`, `newSectionTime`)
     * - aggiorna la lista delle sezioni chiamando `fetchFoodSections()`
     *
     * In caso di errore, viene mostrato un messaggio temporaneo all'interno
     * dell'elemento con id `error1`.
     *
     * Presuppone:
     * - variabili globali o reattive: `newSectionName`, `newSectionTime`, `showSectionModal`
     * - funzione `getCookie()`
     * - funzione `fetchFoodSections()`
     */
    async function saveFoodItemSection() {
        if (!newSectionName || !newSectionTime) return;

        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan-section/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({
                name: newSectionName,
                start_time: newSectionTime,
                author: getCookie('pk')
            })
        });

        if (response.ok) {
            // Reset e aggiornamento sezione
            showSectionModal = false;
            newSectionName = "";
            newSectionTime = "";
            await fetchFoodSections();
        } else {
            // Mostra errore temporaneo
            showMessage("Errore durante la creazione della sezione alimentare!");
        }
    }

    /**
     * Mostra il modal per la creazione di un nuovo alimento e inizializza i suoi valori.
     *
     * Imposta `showFoodModal` a `true` per mostrare il popup e resetta `new_food_item`
     * con valori vuoti/predefiniti.
     *
     * Presuppone che `showFoodModal` e `new_food_item` siano variabili globali o reattive.
     */
    function createFoodItem() {
        showFoodModal = true;

        new_food_item = {
            name: "", brand: "", barcode: "", kcal: 0,
            protein: 0, carboids: 0, sugar: 0, fats: 0,
            saturated_fats: 0, fiber: 0
        };
    }

    /**
     * Avvia lo scanner barcode utilizzando la libreria `Html5Qrcode` e mostra il modal.
     *
     * Dopo aver attivato lo scanner con `facingMode: environment`, ascolta la lettura del codice.
     * Una volta rilevato il barcode, lo assegna a `new_food_item.barcode`, chiude il modal
     * e arresta lo scanner.
     *
     * Presuppone l’esistenza delle variabili `scanner`, `scanning`, `showScannerModal`,
     * `new_food_item` e la funzione `tick()` di Svelte per attendere il rendering.
     */
    async function startScanner() {
        showScannerModal = true;
        await tick(); // attende il rendering del DOM

        scanner = new Html5Qrcode("barcode-reader");
        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                if(showFoodModal) new_food_item.barcode = decodedText;
                else {
                    document.getElementById("search").value = decodedText;
                    document.getElementById("search").focus();
                    document.getElementById("search").dispatchEvent(new Event('input', { bubbles: true }));
                }
                stopScanner();
                showScannerModal = false;
            }
        );

        scanning = true;
    }

    /**
     * Ferma lo scanner barcode se attivo e ripulisce l’istanza.
     *
     * Controlla che `scanner` e `scanning` siano validi prima di chiamare `.stop()` e `.clear()`.
     * Imposta `scanning` a `false` dopo l'arresto.
     *
     * Presuppone che `scanner` e `scanning` siano variabili globali.
     */
    function stopScanner() {
        if (scanner && scanning) {
            scanner.stop().then(() => {
                scanning = false;
                scanner.clear();
            });
        }
    }

    /**
     * Salva un nuovo alimento inviando i suoi dati al backend tramite `POST`.
     *
     * I valori vengono estratti da `new_food_item` e inviati all’endpoint `/food-item/create/`.
     * Dopo il salvataggio:
     * - chiude il modal (`showFoodModal = false`)
     * - aggiorna la lista alimenti richiamando `fetchFoodItems()`
     *
     * Presuppone che `new_food_item` contenga i dati dell’alimento da creare,
     * che `getCookie()` restituisca il token CSRF e l’ID utente,
     * e che esistano `showFoodModal` e `fetchFoodItems()`.
     */
    async function saveFoodItem() {
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-item/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({
                name: new_food_item.name,
                brand: new_food_item.brand,
                barcode: new_food_item.barcode,
                kcal_per_100g: new_food_item.kcal,
                protein_per_100g: new_food_item.protein,
                carbs_per_100g: new_food_item.carboids,
                sugars_per_100g: new_food_item.sugar,
                fats_per_100g: new_food_item.fats,
                saturated_fats_per_100g: new_food_item.saturated_fats,
                fiber_per_100g: new_food_item.fiber,
                author: getCookie('pk')
            })
        });

        if (response.ok) {
            showFoodModal = false;
            await fetchFoodItems(); // aggiorna elenco alimenti
        }
    }

    /**
     * Salva le modifiche apportate a una scheda alimentare esistente inviando
     * una richiesta PATCH all'endpoint del backend.
     *
     * I dati aggiornati includono le date di inizio/fine e i limiti nutrizionali:
     * - kcal, proteine, carboidrati, grassi
     *
     * Se la richiesta ha successo, l'utente viene reindirizzato alla pagina
     * delle schede alimentari. In caso contrario, viene mostrato un messaggio
     * di errore tramite `showMessage`.
     *
     * Presuppone:
     * - la presenza nel DOM degli elementi `#start_date`, `#end_date`,
     *   `.max_kcal_value`, `.max_protein_value`, `.max_carbs_value`, `.max_fats_value`
     * - la funzione `getCookie()` per ottenere il token CSRF
     * - la funzione `showMessage()` per mostrare feedback all’utente
     * - la variabile globale `data.id` con l’ID della scheda alimentare da modificare
     */
    async function saveFoodPlan() {
        export_saveFoodPlan(data.id);
    }

    /**
     * Genera dinamicamente una tabella HTML che rappresenta una scheda alimentare,
     * includendo sezioni (pasti) e alimenti, con supporto per eliminazione e aggiornamento dei dati.
     *
     * La funzione crea righe per ciascuna sezione del piano alimentare, seguite dalle righe degli alimenti
     * appartenenti a quella sezione. Ogni alimento include un campo input per aggiornare i grammi, un'icona
     * per eliminarlo, e una serie di celle con i valori nutrizionali calcolati.
     *
     * Inoltre aggiorna in tempo reale i totali nutrizionali e sincronizza le variabili globali `total_grams`.
     *
     * @function renderFoodPlanTable
     * @param {Array<Object>} content - Array di oggetti che rappresentano il contenuto da rendere.
     *        Ogni oggetto ha struttura `{ type: "section" | "food-item", item | food_plan_item, food_item }`.
     *        - "section": contiene i dati del pasto (nome, orario, ecc.)
     *        - "food-item": contiene i dati dell’alimento, inclusa quantità e riferimenti all’alimento stesso.
     * @param {HTMLTableElement} table - Elemento HTML `<table>` in cui verrà renderizzata la struttura completa.
     *
     * @global {Object} total_grams - Oggetto globale usato per tracciare i valori nutrizionali totali (kcal, proteine, ecc.).
     * @global {Function} updateGraphicsLimits - Funzione globale che aggiorna la UI/grafici secondo i nuovi limiti nutrizionali.
     * @global {Function} getCookie - Funzione per ottenere il token CSRF dai cookie.
     *
     * @fires fetch - Vengono effettuate chiamate PATCH e DELETE al backend per aggiornare o eliminare alimenti.
     * @listens input - Sull’input dei grammi per ogni alimento.
     * @listens click - Sull’icona di eliminazione di ogni alimento.
     */
    function renderFoodPlanTable(content, table) {
        if(content.length !== 0) isEmpty = false;

        external_renderFoodPlanTable(content, table, total_grams);
    }

    /**
     * Crea una riga finale nella tabella del piano alimentare con la somma
     * dei valori nutrizionali totali (Kcal, proteine, carboidrati, zuccheri, grassi, grassi saturi, fibre).
     *
     * @param {HTMLTableElement} table - La tabella HTML in cui inserire la riga dei totali.
     *
     * @example
     * renderTotalRow(document.getElementById("containerFoodPlan"));
     */
    function renderTotalRow(table) {
        external_renderTotalRow(table, total_grams);
    }

    /**
     * Inizializza il componente al montaggio caricando e popolando dinamicamente
     * la scheda alimentare completa da backend.
     *
     * Operazioni principali eseguite:
     *
     * 1. Recupera i dati della scheda alimentare tramite `GET /food-plan/:id/`
     * 2. Popola input di data (`start_date`, `end_date`) e limiti nutrizionali
     * 3. Sincronizza automaticamente tutti gli input con classi simili tra loro
     * 4. Assegna eventi di input per ricalcolare automaticamente le kcal totali
     * 5. Calcola i limiti nutrizionali derivati (zuccheri, fibre, grassi saturi)
     * 6. Costruisce dinamicamente una tabella HTML con sezioni e alimenti associati
     * 7. Per ogni alimento:
     *    - permette modifica dei grammi
     *    - aggiorna i valori nutrizionali in tempo reale
     *    - consente eliminazione con icona `delete`
     * 8. Aggiunge una riga finale con la somma totale dei valori nutrizionali
     * 9. Richiama `updateGraphicsLimits()` per evidenziare valori fuori limite
     * 10. Richiama `fetchFoodItems()` e `fetchFoodSections()` per aggiornare i dati
     *
     * Requisiti:
     * - `data.id`: ID della scheda alimentare da caricare
     * - `total_grams`, `limit_grams`: oggetti globali per il calcolo dei valori
     * - Funzioni: `getCookie()`, `updateGraphicsLimits()`, `autoCalculationKCal()`,
     *   `fetchFoodItems()`, `fetchFoodSections()`
     * - Elementi HTML: input per date e valori nutrizionali, tabella `#containerFoodPlan`,
     *   sezioni con id `start_date`, `end_date`, `error1`, ecc.
     *
     * Nota: l'intero flusso è eseguito all'interno di `onMount()` quindi avviene
     * solo una volta al caricamento del componente.
     */
    onMount(async() => {
        if(getCookie('csrftoken') === "") window.location.href = "/";

        toggleClassByPathContains({
            substring: '/account/food-programs/edit',
            targetId: 'food-program-icon-item',
            className: 'current-page',
            removeFromIds: [
                'weight-icon-item',
                'body-measurements-icon-item',
                'account-icon-item',
                'gym-program-icon-item'
            ]
        });

        // Recupera la scheda alimentare dal backend
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan/" + data.id + "/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        const food_plan = await response.json();

        // Formatto e assegno le date nel formato yyyy-mm-dd per input type="date"
        const formattedStartDate = food_plan.start_date.split('/').reverse().join('-');
        document.getElementById("start_date").value = formattedStartDate;
        const formattedEndDate = food_plan.end_date.split('/').reverse().join('-');
        document.getElementById("end_date").value = formattedEndDate;

        // Funzione per sincronizzare gli input duplicati (es. desktop e mobile)
        function syncInputs(className) {
            document.querySelectorAll(`.${className}`).forEach(input => {
                input.addEventListener("input", (event) => {
                    document.querySelectorAll(`.${className}`).forEach(el => {
                        if (el !== event.target) { // Evita di riassegnare il valore a chi ha attivato l'evento
                            el.value = event.target.value;
                        }
                    });
                });
            });
        }

        // Imposta i valori iniziali dei limiti nutrizionali
        document.querySelectorAll(".max_kcal_value").forEach(el => {
            el.value = food_plan.max_kcal;
        });
        document.querySelectorAll(".max_protein_value").forEach(el => {
            el.value = food_plan.max_protein;
        });
        document.querySelectorAll(".max_carbs_value").forEach(el => {
            el.value = food_plan.max_carbs;
        });
        document.querySelectorAll(".max_fats_value").forEach(el => {
            el.value = food_plan.max_fats;
        });

        // Sincronizza gli input tra loro
        syncInputs("max_kcal_value");
        syncInputs("max_protein_value");
        syncInputs("max_carbs_value");
        syncInputs("max_fats_value");

        // Aggiunge evento per ricalcolare le kcal quando si modificano proteine, carboidrati o grassi
        [".max_protein_value", ".max_carbs_value", ".max_fats_value"].forEach(className => {
            document.querySelectorAll(className).forEach(input => {
                input.addEventListener("input", autoCalculationKCal);
            });
        });

        // Calcola i limiti nutrizionali in grammi in base alle kcal totali
        limit_grams.max_kcal = parseFloat(food_plan.max_kcal);
        limit_grams.max_protein = parseFloat(food_plan.max_protein);
        limit_grams.max_carboids = parseFloat(food_plan.max_carbs);
        limit_grams.min_sugar = parseFloat(((food_plan.max_kcal*0.05)/4).toFixed(1));
        limit_grams.max_sugar = parseFloat(((food_plan.max_kcal*0.1)/4).toFixed(1));
        limit_grams.max_fats = parseFloat(food_plan.max_fats);
        limit_grams.max_satured_fats = parseFloat(((food_plan.max_kcal*0.1)/9).toFixed(1));
        limit_grams.min_fiber = parseFloat(((food_plan.max_kcal/1000)*14).toFixed(1));

        // Aggiorna il DOM con i limiti calcolati
        document.getElementById("max_sugars").innerText = limit_grams.min_sugar + "-" + limit_grams.max_sugar + "g";
        document.getElementById("max_saturated_sugars").innerText = limit_grams.max_satured_fats + "g";
        document.getElementById("max_fiber").innerText = "almeno " + limit_grams.min_fiber + "g";

        // Prepara il contenuto tabella partendo dagli alimenti raggruppati per sezione
        let food_items = food_plan.food_items;
        const table = document.getElementById("containerFoodPlan");

        // Raggruppiamo gli alimenti per sezione
        const groupedByFoodSection = food_items.reduce((acc, item) => {
            if (!acc[item.food_section]) {
                acc[item.food_section] = [];
            }
            acc[item.food_section].push(item);
            return acc;
        }, {});

        const food_items_sections_id = Object.keys(groupedByFoodSection);
        let sections = [];

        // Fetch parallelo per ogni sezione di pasto
        const sectionRequests = food_items_sections_id.map(async (id) => {
            const response_section = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan-section/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'),
                }
            });

            return response_section.json();
        });

        sections = await Promise.all(sectionRequests);
        sections.sort((a, b) => a.start_time - b.start_time); // Ordina le sezioni per orario

        // Riempie il contenuto globale alternando sezione e alimento
        sections.forEach(item => {
            content.push({ type: "section", item });

            const key = item.id.toString();
            const vector_food_items = groupedByFoodSection[key];

            vector_food_items.forEach(item2 => {
                content.push({
                    type: "food-item",
                    food_plan_item: item2,
                    food_item: {} // Per ora vuoto, lo popoleremo dopo
                });
            });
        });

        // Recupera i dettagli di ogni alimento (fetch parallelo)
        const foodRequests = content
            .filter(item => item.type === "food-item")
            .map(async (item) => {
                const response_food = await fetch(`http://127.0.0.1:8000/api/v1/data/food-item/${item.food_plan_item.food_item}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + getCookie('csrftoken'),
                    }
                });

                item.food_item = await response_food.json();
            });

        await Promise.all(foodRequests);

        // Genera dinamicamente la tabella HTML: intestazioni sezioni e righe alimenti
        renderFoodPlanTable(content, table)

        // Aggiunge riga separatrice e totale finale
        renderTotalRow(table);

        updateGraphicsLimits()
        fetchFoodItems();
        fetchFoodSections();

        isLoading = false;
    });
</script>