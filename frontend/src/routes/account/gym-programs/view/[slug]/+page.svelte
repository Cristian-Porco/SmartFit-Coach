<head>
    <link rel="stylesheet" type="text/css" href="/css/account/gym-programs/style_view_gym_programs.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<div class="container">
    <div><p><b>Visualizza</b></p><h1 class="titlePage">Scheda di allenamento</h1></div>
    <div>
        <p><b>Data inizio:</b> <span id="start_date">--/--/----</span></p>
        <p><b>Data fine:</b> <span id="end_date">--/--/----</span></p>
    </div>
</div>

<div class="form-container">
    <div class="tabs" id="tabs">
        <!-- Le tab dei giorni verranno generate dinamicamente -->
    </div>

    <div class="content-day" id="content">
        <h4 style="text-align: center">Seleziona un giorno della settimana dai pulsanti presenti sopra</h4>
    </div>

    <div class="content-note" id="notes">
        <h2 class="day-title">Note sulla scheda di allenamento</h2>
        <p id="note">Contenuto della giornata selezionata apparirà qui.</p>
    </div>
</div>

{#if showExercisePopup}
    <div class="modal">
        <div class="modal-content">
            <h2>{selectedExercise.name}</h2>

            <!-- Slideshow -->
            {#if selectedExercise.image_files?.length}
                <div class="carousel">
                    <img class="carousel-image" src={selectedExercise.image_files[currentSlide]} alt="Foto esercizio" />

                    <div class="carousel-indicators">
                        {#each selectedExercise.image_files as _, index}
                            <button
                                    class:selected={index === currentSlide}
                                    on:click={() => currentSlide = index}
                            >
                                {index + 1}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Dettagli -->
            {#if selectedExercise.level_display != null}<p><strong>Livello:</strong> {selectedExercise.level_display}</p>{/if}
            {#if selectedExercise.mechanic_display != null}<p><strong>Meccanica:</strong> {selectedExercise.mechanic_display}</p>{/if}
            {#if selectedExercise.category_display != null}<p><strong>Categoria:</strong> {selectedExercise.category_display}</p>{/if}
            {#if selectedExercise.equipment_display != null}<p><strong>Attrezzatura:</strong> {selectedExercise.equipment_display}</p>{/if}

            <!-- Istruzioni -->
            {#if selectedExercise.instructions?.length}
                <h3>Istruzioni</h3>
                <div class="instructions-list">
                    {#each selectedExercise.instructions as step}
                        <p>{step}</p>
                    {/each}
                </div>
            {/if}

            <button on:click={closeExercisePopup} style="margin: 0; margin-top: 15px">Chiudi visualizzazione esercizio</button>
        </div>
    </div>
{/if}

<script>
    import {onMount} from "svelte";
    import {getCookie} from "svelte-cookie";
    import {
        IntensityTechniquesDefault,
        IntensityTechniquesDeathSet,
        IntensityTechniquesAMRAP,
        IntensityTechniquesEMOM,
        IntensityTechniquesIsometric,
        IntensityTechniquesMyoreps,
        IntensityTechniquesRestPause,
        IntensityTechniquesTempoBase,
        IntensityTechniquesUnilateral
    } from "$lib/view_gym_programs.js";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    export let data;
    let idGymPlan;

    let selectedExercise = null;
    let showExercisePopup = false;
    let currentSlide = 0;

    let isNotLoaded = true;

    async function openExercisePopup(exercise) {
        const imageIds = exercise.image_urls || [];
        const imageFiles = await fetchExerciseImages(imageIds);

        exercise.image_files = imageFiles;
        selectedExercise = exercise;
        currentSlide = 0; // reset allo slide iniziale
        showExercisePopup = true;
    }

    function closeExercisePopup() {
        showExercisePopup = false;
        selectedExercise = null;
    }

    async function fetchExerciseImages(imageIds) {
        const imageUrls = [];

        for (const id of imageIds) {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-media-upload/${id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + getCookie('csrftoken') // usa la funzione Svelte che già usi
                    }
                });

                const data = await res.json();
                if (data.file) {
                    imageUrls.push(data.file);
                }
            } catch (err) {
                console.error("Errore caricando immagine ID:", id, err);
            }
        }

        return imageUrls;
    }

    function getTodayWeekdayIfInRange(startStr, endStr) {
        const giorniSettimana = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const today = new Date();

        const start = new Date(formatDateForInput(startStr));
        const end = new Date(formatDateForInput(endStr));

        if (today >= start && today <= end) {
            return giorniSettimana[today.getDay()];
        } else {
            return null;
        }
    }

    function giorniPrecedenti(giorno) {
        const giorniSettimana = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

        if (giorno === null) return giorniSettimana;

        const index = giorniSettimana.indexOf(giorno);
        if (index === -1) return []; // giorno non valido

        return giorniSettimana.slice(0, index);
    }

    onMount(async () => {
        if(getCookie('csrftoken') === "") window.location.href = "/";

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

        idGymPlan = data.id;
        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan/${idGymPlan}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        const gym_plan_json = await response.json();

        document.getElementById("start_date").innerText = gym_plan_json["start_date"];
        document.getElementById("end_date").innerText = gym_plan_json["end_date"];
        if(gym_plan_json["note"] !== "") document.getElementById("note").innerText = gym_plan_json["note"];
        else document.getElementById("notes").style.display ="none";

        let isNameDayOrNull = getTodayWeekdayIfInRange(gym_plan_json["start_date"], gym_plan_json["end_date"]);
        let dayBeforeToday = giorniPrecedenti(isNameDayOrNull);

        let gym_plan_items = gym_plan_json["gym_plan_items"];

        const days = [
            { full: "Lunedì", short: "lun" },
            { full: "Martedì", short: "mar" },
            { full: "Mercoledì", short: "mer" },
            { full: "Giovedì", short: "gio" },
            { full: "Venerdì", short: "ven" },
            { full: "Sabato", short: "sab" },
            { full: "Domenica", short: "dom" },
        ];

        const tabsContainer = document.getElementById("tabs");
        const content = document.getElementById("content");

        days.forEach(({ full, short }) => {
            const tab = document.createElement("div");
            tab.id = full + "Tab";
            tab.classList.add("tab");

            tab.innerHTML = `<span class="day-full">${full}</span>`;

            tab.addEventListener("click", () => {
                isNotLoaded = true;

                let disabledDayBefore = false;
                if(dayBeforeToday.includes(full)) {
                    disabledDayBefore = true;
                }
                document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                content.style.border = "1px solid #cfcfcf";

                let type_day, notes_day;
                gym_plan_items.forEach((item) => {
                    if (item.section.day === short) {
                        type_day = item.section.type;
                        notes_day = item.section.note;
                    }
                });
                if(type_day === undefined ) { type_day = ""; }
                if(notes_day === undefined ) { notes_day = ""; }

                content.innerHTML = `
                    <h2 class="day-title">
                        ${full} <span class="day-subtitle"> ${type_day}</span>
                    </h2>
                    <p>${notes_day}</p>
                    <div id="${short}"></div>
                `;

                const divDay = document.getElementById(short);

                gym_plan_items.forEach((item) => {
                    if (item.section.day === short) {
                        let techniques = "";
                        if (Array.isArray(item.intensity_techniques_display)) {
                            techniques = item.intensity_techniques_display.join(', ');
                        } else if (typeof item.intensity_techniques_display === "string") {
                            techniques = item.intensity_techniques_display.split(/[,;|]/).map(t => t.trim()).join(', ');
                        }

                        if (!item.intensity_techniques.includes("null")) {
                            const gym_plan_item = document.createElement("div");
                            gym_plan_item.classList.add("exercise-row");

                            if(item.intensity_techniques.includes("rest_pause") || item.intensity_techniques.includes("myoreps")) {
                                gym_plan_item.innerHTML = `
                                    <div class="exercise-number">${item.order}</div>
                                    <div class="exercise-title">${item.notes || ''}</div>
                                    <div class="exercise-technique">${techniques}</div>
                                `;
                            } else {
                                gym_plan_item.innerHTML = `
                                    <div class="exercise-number">${item.order}</div>
                                    <div class="exercise-title">${item.notes || ''}</div>
                                    <div class="exercise-technique">${techniques}</div>
                                    <div class="exercise-technique">
                                        <button class="button-ai generate-warm-up" style="margin: 0 10px">
                                            Genera riscaldamento
                                        </button>
                                    </div>
                                `;

                                gym_plan_item.querySelector(".generate-warm-up").addEventListener("click", async function (event) {
                                    event.currentTarget.disabled = true;

                                    const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-item/generate-warmup/${item.id}/`, {
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            "Authorization": "Token " + getCookie('csrftoken'),
                                        }
                                    });

                                    const result = await response.json();
                                    console.log(result);
                                    if(response.ok) {
                                        localStorage.setItem("sectionDay", item.section.day_display)
                                        localStorage.setItem("isAddingElement", "true");
                                        location.reload();
                                    }
                                });
                            }

                            gym_plan_item.id = "orderExercise" + item.order;

                            let plan_item = item.id;

                            divDay.appendChild(gym_plan_item);

                            const groupedSets = {};
                            item.sets.forEach(set => {
                                if (!groupedSets[set.set_number]) {
                                    groupedSets[set.set_number] = [];
                                }
                                groupedSets[set.set_number].push(set);
                            });

                            const setNumbers = Object.keys(groupedSets).sort((a, b) => a - b);

                            if(item.intensity_techniques.includes("tempo-based")) {
                                IntensityTechniquesTempoBase(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore);
                            } else if (item.intensity_techniques.includes("unilateral")) {
                                IntensityTechniquesUnilateral(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore);
                            } else if (item.intensity_techniques.includes("rest_pause")) {
                                const button = document.createElement("button");
                                button.classList.add("buttonCedimento");
                                button.textContent = "Aggiungi serie a cedimento";
                                button.style.margin = 0;

                                IntensityTechniquesRestPause(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore, dayBeforeToday, full, button, plan_item, gym_plan_item);
                            } else if (item.intensity_techniques.includes("myoreps")) {
                                const button = document.createElement("button");
                                button.classList.add("buttonCedimento");
                                button.textContent = "Aggiungi serie a cedimento";
                                button.style.margin = 0;
                                button.style.display = 'none';

                                let maxReps, minReps;

                                IntensityTechniquesMyoreps(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore, dayBeforeToday, full, button, plan_item, gym_plan_item, maxReps, minReps);
                            } else if (item.intensity_techniques.includes("isometric") || item.intensity_techniques.includes("isometric_overload")) {
                                IntensityTechniquesIsometric(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore);
                            } else if (item.intensity_techniques.includes("emom")) {
                                IntensityTechniquesEMOM(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore);
                            } else if (item.intensity_techniques.includes("amrap")) {
                                IntensityTechniquesAMRAP(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore)
                            } else if (item.intensity_techniques.includes("death_set")){
                                IntensityTechniquesDeathSet(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore);
                            } else {
                                IntensityTechniquesDefault(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore);
                            }
                        }

                        document.querySelectorAll('.generate-warm-up').forEach(button => {
                            button.disabled = disabledDayBefore;
                        });
                    }
                });

                if (divDay.children.length === 0 && divDay.textContent.trim() === "") {
                    divDay.innerHTML = "<p>Nessun esercizio presente, puoi rilassarti!</p>"
                }
            });

            tabsContainer.appendChild(tab);
        });

        if(isNameDayOrNull !== null)
            document.getElementById(isNameDayOrNull + "Tab").click();
        else
            isNotLoaded = false;

        if(localStorage.getItem("isAddingElement") === "true") {
            document.getElementById(localStorage.getItem("sectionDay") + "Tab").click();

            const el = document.getElementById(localStorage.getItem("sectionDay") + "Tab");
            if (el) el.scrollIntoView({ behavior: "smooth" });
            localStorage.setItem("isAddingElement", "false");
            localStorage.removeItem("sectionDay");
        }

        const id = localStorage.getItem("scrollToId");
        if (id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
            localStorage.removeItem("scrollToId");
        }

        isLoading = false;
    });
</script>