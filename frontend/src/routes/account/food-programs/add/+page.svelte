<!-- Collegamento al file CSS specifico -->
<head>
    <link rel="stylesheet" type="text/css" href="/css/account/food-programs/style_add_food_programs.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Titolo e intestazione -->
<p><b>Aggiungi</b></p>
<h2 class="titlePage">Scheda alimentare</h2>

<!-- Form principale -->
<form class="form-container">
    <!-- Box per eventuali errori -->
    <div class="error" id="error1"><p></p></div>

    <!-- Input date di inizio e fine -->
    <div class="form-group">
        <div class="input-container">
            <label for="start_date">Data di inizio:</label>
            <input type="date" id="start_date">
        </div>
        <div class="input-container">
            <label for="end_date">Data di fine:</label>
            <input type="date" id="end_date">
        </div>
    </div>

    <!-- Pulsante per generare dati AI -->
    <div class="input-container">
        <button id="button-ai-generate" class="button-ai" on:click={showAIDiv}>
            Genera i macronutrienti sui dati a disposizione
        </button>
    </div>

    <!-- Box AI (inizialmente nascosto) -->
    <div id="ai-box" class="ai-box hidden" style="margin: 0">
        <h3>Risposta intelligente sui dati</h3>
        <div id="ai-content" class="ai-loader"></div>
    </div>

    <!-- Input valori nutrizionali -->
    <div class="input-container">
        <label for="kcal">Max Kcal:</label>
        <input type="number" id="max_kcal" placeholder="Aggiungi max kcal...">
    </div>
    <div class="input-container">
        <label for="protein">Max Proteine:</label>
        <input type="number" id="max_protein" on:blur={autoCalculationKCal} placeholder="Aggiungi max proteine...">
    </div>
    <div class="input-container">
        <label for="carbs">Max Carboidrati:</label>
        <input type="number" id="max_carbs" on:blur={autoCalculationKCal} placeholder="Aggiungi max carboidrati...">
    </div>
    <div class="input-container">
        <label for="fat">Max Grassi:</label>
        <input type="number" id="max_fats" on:blur={autoCalculationKCal} placeholder="Aggiungi max grassi...">
    </div>

    <!-- Pulsante di invio -->
    <button type="submit" on:click={addFoodPrograms}>Aggiungi</button>
</form>

<script>
    import { getCookie } from 'svelte-cookie';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    let today = new Date().toISOString().split('T')[0];
    let selectedDate = today;

    /**
     * Recupera i suggerimenti nutrizionali AI e popola i campi
     */
    async function showAIDiv() {
        const aiBox = document.getElementById("ai-box");
        const aiContent = document.getElementById("ai-content");
        const buttonAI = document.getElementById("button-ai-generate");

        // Reset UI e mostra loader
        aiBox.classList.add("hidden");
        aiContent.innerText = "";
        aiContent.classList.add("ai-loader");
        aiContent.classList.remove("ai-response");
        aiBox.classList.remove("hidden");
        buttonAI.disabled = true;

        // Attiva animazione transizione
        setTimeout(() => aiBox.classList.add("visible"), 10);

        // Chiamata API AI
        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan/generate-macro/", {
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
            aiContent.innerHTML = data.reason;

            // 🧠 Popola i macro consigliati e forza ricalcolo kcal
            setFieldAndTrigger("max_protein", data.max_protein);
            setFieldAndTrigger("max_carbs", data.max_carbs);
            setFieldAndTrigger("max_fats", data.max_fats);

            buttonAI.disabled = false;
        }
    }

    /**
     * Crea una nuova scheda alimentare e reindirizza
     */
    async function addFoodPrograms() {
        const payload = {
            start_date: document.getElementById("start_date").value,
            end_date: document.getElementById("end_date").value,
            max_kcal: document.getElementById("max_kcal").value,
            max_protein: document.getElementById("max_protein").value,
            max_carbs: document.getElementById("max_carbs").value,
            max_fats: document.getElementById("max_fats").value,
            food_items: [], // in fase di creazione non serve
            author: getCookie("pk")
        };

        const response = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = `/account/food-programs/edit/${data.id}`;
        } else {
            showValidationError(data);
        }
    }

    /**
     * Calcola le kcal stimate e aggiorna il campo kcal
     */
    function autoCalculationKCal() {
        const protein = parseFloat(document.getElementById("max_protein").value || 0);
        const carbs = parseFloat(document.getElementById("max_carbs").value || 0);
        const fats = parseFloat(document.getElementById("max_fats").value || 0);

        if (protein && carbs && fats) {
            const kcal = (protein * 4) + (carbs * 4) + (fats * 9);
            const kcalInput = document.getElementById("max_kcal");
            kcalInput.value = kcal;

            kcalInput.classList.add("highlight");
            setTimeout(() => kcalInput.classList.remove("highlight"), 1000);
        }
    }

    /**
     * Setta un campo input e ne forza l’aggiornamento/blur
     */
    function setFieldAndTrigger(id, value) {
        const input = document.getElementById(id);
        input.click();
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("blur", { bubbles: true }));
    }

    /**
     * Mostra il primo errore ricevuto dal backend
     */
    function showValidationError(data) {
        const fields = {
            start_date: "Data di inizio",
            end_date: "Data di fine",
            max_kcal: "Max Kcal",
            max_protein: "Max Proteine",
            max_carbs: "Max Carboidrati",
            max_fats: "Max Grassi"
        };

        for (const key in fields) {
            if (data[key]?.length) {
                showMessage(`${fields[key]}: ${data[key][0]}`, "error1");
                break;
            }
        }
    }

    // Inizializzazione al montaggio del componente
    onMount(() => {
        if (getCookie('csrftoken') === "") window.location.href = "/";

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

        isLoading = false;
    });
</script>