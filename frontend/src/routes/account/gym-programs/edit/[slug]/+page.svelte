<head>
    <link rel="stylesheet" type="text/css" href="/css/account/gym-programs/style_edit_gym_programs.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<div id="loading-overlay" style="display: none;">
    <div class="spinnerIA">Sto elaborando...</div>
</div>

<div class="fab-container">
    <!-- Pulsanti secondari -->
    {#if expanded}
        {#if isEmpty}<div class="fab-sub" on:click={()=>{showGenerateEntirePlan = true;}}>Genera la scheda di allenamento completa</div>{/if}
        {#if !isDayEmpty}<div class="fab-sub" on:click={()=>{showGenerateAlternativeItem = true}}>Genera alternativa in base all'esercizio</div>{/if}
        {#if isDayEmpty && showDayGeneration != ""}<div class="fab-sub" on:click={()=>{generateGymPlan(data.id, [showDayShortGeneration])}}>Genera la scheda di allenamento di {showDayGeneration}</div>{/if}
    {/if}

    <!-- Pulsante principale -->
    {#if isNotLoaded}
    <button class="button-ai fab-main" on:click={toggleMenu}>
        Elabora i dati con IA
    </button>
    {/if}
</div>

<!-- Contenitore intestazione della pagina della scheda alimentare -->
<div class="container">
    <div><p><b>Modifica</b></p><h1 class="titlePage">Scheda di allenamento</h1></div>
    <div id="section_date">
        <p><b>Data inizio:</b> <input type="date" id="start_date" required></p>
        <p><b>Data fine:</b> <input type="date" id="end_date" required></p>
    </div>
</div>

<!-- Contenitore per messaggi di errore -->
<div class="error" id="error1">
    <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
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
        <div class="input-wrapper">
            <textarea placeholder="Inserisci le note sulla scheda di allenamento qui..." id="notes_plan" style="margin-bottom: 0;"></textarea>
            <button type="button" class="inside-button button-ai" id="ai_notes_plan">Genera</button>
        </div>
    </div>
    <button on:click={saveGymPlan}>Modifica scheda di allenamento</button>
</div>

{#if showGenerateEntirePlan}
    <div class="modal">
        <div class="modal-content" style="width: 400px">
            <h3>Genera la scheda di allenamento completa</h3>

            <p>Seleziona i giorni della settimana in cui dovresti allenarti in modo tale che la IA possa generare la scheda di allenamento.</p>

            <!-- Checkbox per i giorni -->
            {#each daysOfWeek as day}
                <div class="day-checkbox">
                    <input type="checkbox" id={day.value} checked={selectedDays.has(day.value)} on:change={() => toggleDay(day.value)} />
                    <label for={day.value}>{day.label}</label>
                </div>
            {/each}

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="button-ai" on:click={confirmSelectionGenerationPlan}>Genera</button>
            <button class="close-button" on:click={() => showGenerateEntirePlan = false}>Annulla</button>
        </div>
    </div>
{/if}

{#if showGenerateAlternativeItem}
    <div class="modal">
        <div class="modal-content" style="width: 400px">
            <h3>Genera alternativa in base all'esercizio</h3>

            <p>Scegli un esercizio che non ti convince e la IA genererà per te un esercizio alternativo per la zona muscolare dell'esercizio scelto.</p>

            <select bind:value={selectedSelection}>
                <option disabled selected value="">Scegli un esercizio...</option>
                {#each currentSelection as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="button-ai" on:click={confirmSelectionGenerationAlternative}>Genera</button>
            <button class="close-button" on:click={() => showGenerateAlternativeItem = false}>Annulla</button>
        </div>
    </div>
{/if}

{#if showExercisePopup}
    <div class="modal">
        <div class="modal-content" style="height: 90vh;">
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

{#if showChooseIntensityModal}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio</h3>

            <!-- Selettore tecnica d'intensità -->
            <div class="intensity-select">
                <label for="intensity-technique">Tecnica d’intensità:</label>
                <select id="intensity-technique" bind:value={selectedTechnique}>
                    <option value="bilateral">Bilaterale (entrambe gli arti)</option>
                    <option value="unilateral">Unilaterale (arto singolo)</option>
                    <option value="tempo-based">Tempo-Based (durata fissa)</option>
                    <option value="drop_set">Drop Set / Stripping</option>
                    <option value="super_set">Super Set / Giant Set</option>
                    <option value="forced_reps">Serie Forzate</option>
                    <option value="half_reps">Half Reps</option>
                    <option value="rest_pause">Rest-Pause</option>
                    <option value="myoreps">MyoReps</option>
                    <option value="pre_fatigue">Pre-Affaticamento</option>
                    <option value="negative">Negativa Forzata</option>
                    <option value="peak_contraction">Contrazione di Picco</option>
                    <option value="tempoTUT">Tempo Training / TUT</option>
                    <option value="isometric">Contrazioni Isometriche</option>
                    <option value="seven_seven">21 Serie / 7-7-7</option>
                    <option value="cluster">Cluster Set</option>
                    <option value="pyramid">Piramidale</option>
                    <option value="wave_loading">Wave Loading</option>
                    <option value="isometric_overload">Isometric Overload</option>
                    <option value="accomodating">Accommodating Resistance</option>
                    <option value="pause_reps">Pause Reps</option>
                    <option value="emom">EMOM</option>
                    <option value="amrap">AMRAP</option>
                    <option value="death_set">Death Set</option>
                </select>
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button on:click={() => openSelectedTechnique()}>Aggiungi</button>
            <button class="close-button" on:click={() => showChooseIntensityModal = false}>Annulla</button>
        </div>
    </div>
{/if}

{#if showBilateralExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio bilaterale</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showBilateralExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showUnilateralExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio unilaterale</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showUnilateralExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showTempoBasedExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con durata fissa</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="reps">Minuti prescritti:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={() => { numSeries = 1; addDefaultExercise(); }}>Aggiungi</button>
            <button class="close-button" on:click={() => {showTempoBasedExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showDropSetExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio Drop Set</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte (separate dalla virgola):</label>
                <input id="reps" type="text" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg, separate dalla virgola):</label>
                <input id="weight" type="text" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDropSetExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showDropSetExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showSuperSetExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio Super Set / Giant Set</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />

                <div class="info" style="display: block; margin-bottom: 10px">
                    <p>Puoi modificare i dettagli di ogni esercizio direttamente nella schermata principale di modifica</p>
                </div>
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addSuperSetExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => { showSuperSetExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showForcedRepsExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio Serie Forzate</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte (separate dalla virgola):</label>
                <input id="reps" type="text" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addForcedRepsExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showForcedRepsExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showHalfRepsExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio Half Reps</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte (separate dalla virgola):</label>
                <input id="reps" type="text" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addForcedRepsExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showHalfRepsExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showRestPauseExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio Rest Pause</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="reps">Ripetizioni prescritte per la serie d'introduzione:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addRestPauseExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showRestPauseExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showMyorepsExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio MyoReps</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="reps">Ripetizioni prescritte per la serie d'introduzione:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="reps">Ripetizioni prescritte per le serie a cedimento (valore massimo e minimo separato da una virgola):</label>
                <input id="reps" type="text" bind:value={numSeries} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addMyorepsExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showMyorepsExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showPreFatigueExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio di Pre-Affaticamento</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showPreFatigueExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showNegativeExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con negativa forzata</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="1" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showNegativeExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showPeakContractionExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con concentrazione di picco</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showPeakContractionExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showTempoTUTExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica Tempo Training / TUT</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showTempoTUTExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showIsometricExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con contrazioni isometriche</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Secondi prescritti:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showIsometricExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showSevenSevenExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio 21 Serie (7-7-7)</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addSevenSevenExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showSevenSevenExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showClusterExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio Cluster Set</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Numero di ripetizioni in una serie:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />

                <div class="info" style="display: block; margin-bottom: 10px">
                    <p>Puoi modificare i dettagli di ogni esercizio direttamente nella schermata principale di modifica</p>
                </div>
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addClusterExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showClusterExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showPyramidExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica Piramidale</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="reps">Ripetizioni prescritte (separate dalla virgola):</label>
                <input id="reps" type="text" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg, separate dalla virgola):</label>
                <input id="weight" type="text" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addPyramidExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showPyramidExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showWaveLoadingExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica Wave Loading</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="reps">Ripetizioni prescritte (separate dalla virgola):</label>
                <input id="reps" type="text" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg, separate dalla virgola):</label>
                <input id="weight" type="text" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addPyramidExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showWaveLoadingExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showIsometricOverloadExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica Isometric Overload</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Secondi prescritti:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showIsometricOverloadExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showAccommodatingResistanceExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica Accommodating Resistance</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="notes">Note sull'esercizio:</label>
                <input id="notes" type="text" bind:value={notesGymPlanItems} placeholder="Inserisci in parole povere la resistenza durante l'arco del movimento..."/>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultWithNoteExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showAccommodatingResistanceExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showPauseRepsExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica Pause Reps</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Numero di serie:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Recupero (in secondi):</label>
                <input id="concentric" type="number" bind:value={rest_seconds} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDefaultExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showPauseRepsExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showEMOMExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica EMOM (Every Minute On the Minute)</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Minuti prescritti:</label>
                <input id="sets" type="number" bind:value={numSeries} min="0" />

                <label for="reps">Ripetizioni prescritte in ogni minuto:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addEMOMExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showEMOMExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showAMRAPExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica AMRAP (As Many Reps As Possible)</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <label for="sets">Durata (in secondi):</label>
                <input id="sets" type="number" bind:value={rest_seconds} min="0" />

                <label for="reps">Ripetizioni prescritte in ogni minuto:</label>
                <input id="reps" type="number" bind:value={numReps} min="0" />

                <label for="rir">RIR:</label>
                <input id="rir" type="number" bind:value={rir} min="0" />

                <label for="weight">Peso (in kg):</label>
                <input id="weight" type="number" bind:value={weight} min="0" step="0.25" placeholder="{suggestedWeight}"/>

                <label for="eccentric">Eccentrica (in secondi):</label>
                <input id="eccentric" type="number" bind:value={eccentric} min="0" step="1" />

                <label for="pause">Fermo (in secondi):</label>
                <input id="pause" type="number" bind:value={pause} min="0" step="1" />

                <label for="concentric">Concentrica (in secondi):</label>
                <input id="concentric" type="number" bind:value={concentric} min="0" step="1" />
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addAMRAPExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showAMRAPExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showDeathSetExercise}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi esercizio con tecnica Death Set</h3>

            <!-- Sezione input -->
            <div class="input-group">
                <!-- Pulsante per scegliere l'esercizio -->
                <p style="text-align: center; margin-bottom: 10px; font-style: italic">{nameExercises}</p>
                <button class="choose-exercise-button" on:click={() => showChooseExerciseModal = true}>Scegli esercizio</button>

                <div class="info" style="display: block; margin-bottom: 10px">
                    <p>Puoi modificare i dettagli di ogni esercizio direttamente nella schermata principale di modifica</p>
                </div>
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button class="save-exercise-button" style="display: none" on:click={addDeathSetExercise}>Aggiungi</button>
            <button class="close-button" on:click={() => {showDeathSetExercise = false; resetExerciseModal(); }}>Annulla</button>
        </div>
    </div>
{/if}

{#if showChooseExerciseModal}
    <div class="modal">
        <div class="modal-content">
            <h3>Aggiungi Serie</h3>

            <!-- Sezione contenente la ricerca alimenti e i dettagli -->
            <div class="modal-container">

                <!-- Sezione ricerca alimento -->
                <div class="food-search">
                    <label for="search">Cerca esercizio:</label>
                    <div class="search-bar">
                        <input
                                type="text"
                                id="search"
                                bind:value={searchQuery}
                                on:input={filterGymItems}
                                placeholder="Cerca esercizio..."
                        />
                    </div>

                    <!-- Lista filtrata di alimenti disponibili -->
                    <ul class="food-list">
                        {#each filteredGymItems as gymItem}
                            <li on:click={() => selectGymItem(gymItem)}>{gymItem.name}</li>
                        {/each}
                    </ul>
                </div>

                <div class="food-details">
                    {#if selectedGymItem}
                        <h3>
                            {selectedGymItem.name}
                        </h3>

                        <!-- Slideshow -->
                        {#if selectedGymItem.image_files?.length}
                            <div class="carousel">
                                <img class="carousel-image" src={selectedGymItem.image_files[currentSlide]} alt="Foto esercizio" />

                                <div class="carousel-indicators">
                                    {#each selectedGymItem.image_files as _, index}
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
                        {#if selectedGymItem.level_display != null}<p><strong>Livello:</strong> {selectedGymItem.level_display}</p>{/if}
                        {#if selectedGymItem.mechanic_display != null}<p><strong>Meccanica:</strong> {selectedGymItem.mechanic_display}</p>{/if}
                        {#if selectedGymItem.category_display != null}<p><strong>Categoria:</strong> {selectedGymItem.category_display}</p>{/if}
                        {#if selectedGymItem.equipment_display != null}<p><strong>Attrezzatura:</strong> {selectedGymItem.equipment_display}</p>{/if}
                    {/if}
                </div>
            </div>

            <div class="separator-row"></div>

            <!-- Pulsanti azione -->
            <button id="addExerciseToVector" on:click={addExerciseToVector}>Aggiungi</button>
            <button class="close-button" on:click={() => showChooseExerciseModal = false}>Annulla</button>
        </div>
    </div>
{/if}

<script>
    import {onMount} from "svelte";
    import {getCookie} from "svelte-cookie";
    import {
        AddDefaultExercise,
        AddDefaultWithNoteExercise,
        AddDropSetExercise,
        AddSuperSetExercise,
        AddForcedRepsExercise,
        AddRestPauseExercise,
        AddMyorepsExercise,
        AddSevenSevenExercise,
        AddClusterExercise,
        AddPyramidExercise,
        AddEMOMExercise,
        AddAMRAPExercise,
        AddDeathSetExercise,
        IntensityTechniquesDefault,
        IntensityTechniquesDeathSet,
        IntensityTechniquesAMRAP,
        IntensityTechniquesEMOM,
        IntensityTechniquesIsometric,
        IntensityTechniquesMyoreps,
        IntensityTechniquesRestPause,
        IntensityTechniquesTempoBase,
        IntensityTechniquesUnilateral
    } from "$lib/edit_gym_programs.js";
    import { fade } from 'svelte/transition';

    let isLoading = true;

    export let data;
    let idGymPlan;
    let idGymSection;

    let selectedExercise = null;
    let showExercisePopup = false;
    let currentSlide = 0;

    let showChooseExerciseModal = false;
    let searchQuery = "";
    let gymItems = [];
    let filteredGymItems = [];
    let selectedGymItem = null;
    let suggestedWeight = "";

    let showChooseIntensityModal = false;
    let selectedTechnique = 'bilateral';

    let idExercises = [];
    let nameExercises = "Nessun esercizio selezionato...";
    let limitAdd = false;

    let notesGymPlanItems = "";
    let numSeries = 0;
    let numReps = 0;
    let rir = 0;
    let weight = 0;
    let eccentric = 0;
    let pause = 0;
    let concentric = 0;
    let rest_seconds = 0;

    let showBilateralExercise = false;
    let showUnilateralExercise = false;
    let showTempoBasedExercise = false;
    let showDropSetExercise = false;
    let showSuperSetExercise = false;
    let showForcedRepsExercise = false;
    let showHalfRepsExercise = false;
    let showRestPauseExercise = false;
    let showMyorepsExercise = false;
    let showPreFatigueExercise = false;
    let showNegativeExercise = false;
    let showPeakContractionExercise = false;
    let showTempoTUTExercise = false;
    let showIsometricExercise = false;
    let showSevenSevenExercise = false;
    let showClusterExercise = false;
    let showPyramidExercise = false;
    let showWaveLoadingExercise = false;
    let showIsometricOverloadExercise = false;
    let showAccommodatingResistanceExercise = false;
    let showPauseRepsExercise = false;
    let showEMOMExercise = false;
    let showAMRAPExercise = false;
    let showDeathSetExercise = false;

    let expanded = false;
    let isEmpty = true;
    let isDayEmpty = true;
    let showDayGeneration = "";
    let showDayShortGeneration = "";
    let isNotLoaded = true;

    let showGenerateEntirePlan = false;
    let selectedDays = new Set(); // oppure puoi usare un array se preferisci

    let showGenerateAlternativeItem = false;
    let currentSelection = [];
    let selectedSelection = "";

    const daysOfWeek = [
        { label: 'Lunedì', value: 'lun' },
        { label: 'Martedì', value: 'mar' },
        { label: 'Mercoledì', value: 'mer' },
        { label: 'Giovedì', value: 'gio' },
        { label: 'Venerdì', value: 'ven' },
        { label: 'Sabato', value: 'sab' },
        { label: 'Domenica', value: 'dom' }
    ];

    function toggleDay(day) {
        if (selectedDays.has(day)) {
            selectedDays.delete(day);
        } else {
            selectedDays.add(day);
        }
        selectedDays = new Set(selectedDays); // per far scattare il reattivo in Svelte
    }

    async function confirmSelectionGenerationPlan() {
        document.getElementById("loading-overlay").style.display = "flex";
        showGenerateEntirePlan = false;

        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan/generate-entire/${idGymPlan}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken')
            },
            body: JSON.stringify({
                days: Array.from(selectedDays) // es. ["lun", "mer", "ven"]
            })
        });

        const data = await response.json();

        if (response.ok) {
            location.reload();
        }
    }

    async function confirmSelectionGenerationAlternative() {
        document.getElementById("loading-overlay").style.display = "flex";
        showGenerateAlternativeItem = false;

        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-item/generate-alternative/${selectedSelection}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken')
            }
        });

        const data = await response.json();

        if (response.ok) {
            location.reload();
        }
    }

    function isDefaultWeeklyPlan(gym_plan_items) {
        const expectedDays = new Set(['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom']);

        if (gym_plan_items.length !== 7) {
            return false;
        }

        const seenDays = new Set();

        for (const item of gym_plan_items) {
            const day = item.section?.day;
            const techniques = item.intensity_techniques;

            if (!expectedDays.has(day) || seenDays.has(day)) {
                return false;
            }

            if (!Array.isArray(techniques) || techniques.length !== 1 || techniques[0] !== 'null') {
                return false;
            }

            seenDays.add(day);
        }

        return seenDays.size === 7;
    }

    function isDefaultDayItem(gym_plan_items, day) {
        const itemsForDay = gym_plan_items.filter(item => item.section?.day === day);

        if (itemsForDay.length !== 1) {
            return false;
        }

        const techniques = itemsForDay[0].intensity_techniques;

        return Array.isArray(techniques) && techniques.length === 1 && techniques[0] === 'null';
    }

    function toggleMenu() {
        expanded = !expanded;
    }

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

    async function selectGymItem(gymItem) {
        const imageIds = gymItem.image_urls || [];
        const imageFiles = await fetchExerciseImages(imageIds);

        gymItem.image_files = imageFiles;
        selectedGymItem = gymItem;
    }

    function filterGymItems() {
        const query = searchQuery.toLowerCase();

        filteredGymItems = gymItems.filter(item =>
            item.name.toLowerCase().includes(query)
        );
    }

    async function fetchGymItems() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/data/gym-item/", {
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
            gymItems = await response.json();
            filteredGymItems = gymItems; // Aggiorna la lista filtrata
        } catch (error) {
            // In caso di errore di rete o eccezione imprevista
            showMessage("Errore durante il caricamento degli alimenti!");
        }
    }

    function openSelectedTechnique() {
        notesGymPlanItems = "";
        numSeries = 0;
        numReps = 0;
        rir = 0;
        weight = 0;
        eccentric = 0;
        pause = 0;
        concentric = 0;
        rest_seconds = 0;
        suggestedWeight = "";

        switch (selectedTechnique) {
            case "bilateral":
                showBilateralExercise = true;
                break;
            case "unilateral":
                showUnilateralExercise = true;
                break;
            case "tempo-based":
                showTempoBasedExercise = true;
                break;
            case "drop_set":
                numReps = "";
                weight = "";
                showDropSetExercise = true;
                break;
            case "super_set":
                showSuperSetExercise = true;
                break;
            case "forced_reps":
                numSeries = "";
                showForcedRepsExercise = true;
                break;
            case "half_reps":
                showHalfRepsExercise = true;
                break;
            case "rest_pause":
                showRestPauseExercise = true;
                break;
            case "myoreps":
                numSeries = "";
                showMyorepsExercise = true;
                break;
            case "pre_fatigue":
                showPreFatigueExercise = true;
                break;
            case "negative":
                eccentric = 1;
                showNegativeExercise = true;
                break;
            case "peak_contraction":
                pause = 1;
                eccentric = 1;
                showPeakContractionExercise = true;
                break;
            case "tempoTUT":
                showTempoTUTExercise = true;
                break;
            case "isometric":
                showIsometricExercise = true;
                break;
            case "seven_seven":
                showSevenSevenExercise = true;
                break;
            case "cluster":
                showClusterExercise = true;
                break;
            case "pyramid":
                numReps = "";
                weight = "";
                showPyramidExercise = true;
                break;
            case "wave_loading":
                numReps = "";
                weight = "";
                showWaveLoadingExercise = true;
                break;
            case "isometric_overload":
                showIsometricOverloadExercise = true;
                break;
            case "accomodating":
                showAccommodatingResistanceExercise = true;
                break;
            case "pause_reps":
                showPauseRepsExercise = true;
                break;
            case "emom":
                rest_seconds = 60;
                showEMOMExercise = true;
                break;
            case "amrap":
                showAMRAPExercise = true;
                break;
            case "death_set":
                numSeries = 5;
                showDeathSetExercise = true;
                break;
        }
    }

    async function addExerciseToVector() {
        document.getElementById("addExerciseToVector").disabled = true;
        idExercises.push(selectedGymItem.id);

        weight = "";

        const suggested_weight_response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/suggested-weight/${selectedGymItem.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Token " + getCookie('csrftoken'),
            }
        });

        const suggested_weight_response_data = await suggested_weight_response.json();
        let suggested_weight_single = suggested_weight_response_data.suggested_weight;

        if(idExercises.length === 1) {
            nameExercises = selectedGymItem.name;
            suggestedWeight = "Suggerito: " + suggested_weight_single;
        } else {
            nameExercises += ", ";
            nameExercises += selectedGymItem.name;
            suggestedWeight += ", ";
            suggestedWeight += suggested_weight_single;
        }

        if(idExercises.length >= 1) {
            limitAdd = true;
        }

        document.querySelectorAll('.choose-exercise-button').forEach(button => {
            let checkValidation = showAMRAPExercise || showSuperSetExercise;
            if(!checkValidation) {
                if (!limitAdd) button.style.display = "block";
                else button.style.display = "none";
            }
        });

        document.querySelectorAll('.save-exercise-button').forEach(button => {
            if(limitAdd) button.style.display = "block";
            else button.style.display = "none";
        });

        showChooseExerciseModal = false;
        document.getElementById("addExerciseToVector").disabled = false;
    }

    function resetExerciseModal() {
        idExercises = [];
        nameExercises = "Nessun esercizio selezionato...";

        notesGymPlanItems = "";
        numSeries = 0;
        numReps = 0;
        rir = 0;
        weight = 0;
        eccentric = 0;
        pause = 0;
        concentric = 0;
        rest_seconds = 0;
    }

    async function addDefaultExercise() {
        AddDefaultExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addDefaultWithNoteExercise() {
        AddDefaultWithNoteExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric, notesGymPlanItems);
    }

    async function addDropSetExercise() {
        AddDropSetExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addSuperSetExercise() {
        AddSuperSetExercise(idGymSection, selectedTechnique, numSeries, idExercises, rest_seconds);
    }

    async function addForcedRepsExercise() {
        AddForcedRepsExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addRestPauseExercise() {
        AddRestPauseExercise(idGymSection, selectedTechnique, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addMyorepsExercise() {
        AddMyorepsExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addSevenSevenExercise() {
        AddSevenSevenExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addClusterExercise() {
        AddClusterExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addPyramidExercise() {
        AddPyramidExercise(idGymSection, selectedTechnique, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addEMOMExercise() {
        AddEMOMExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addAMRAPExercise() {
        AddAMRAPExercise(idGymSection, selectedTechnique, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    async function addDeathSetExercise() {
        AddDeathSetExercise(idGymSection, selectedTechnique, numSeries, idExercises, numReps, rir, rest_seconds, weight, eccentric, pause, concentric);
    }

    function parseDateIT(str) {
        const [gg, mm, aaaa] = str.split('/');
        return new Date(`${aaaa}-${mm}-${gg}`); // ISO: YYYY-MM-DD
    }

    function getTodayWeekdayIfInRange(startStr, endStr) {
        const giorniSettimana = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const today = new Date();

        const start = parseDateIT(startStr);
        const end = parseDateIT(endStr);

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

    function validateWeekRange(startDateInputId, endDateInputId) {
        const startInput = document.getElementById(startDateInputId);
        const endInput = document.getElementById(endDateInputId);

        const startDate = new Date(startInput.value);
        const endDate = new Date(endInput.value);

        // Controlla che le date siano valide
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return { valid: false, message: "Inserisci date valide." };
        }

        const startDay = startDate.getDay(); // 1 = lunedì, 0 = domenica
        const endDay = endDate.getDay();

        const diffInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (startDay !== 1) {
            return { valid: false, message: "La data di inizio deve essere un lunedì." };
        }

        if (endDay !== 0) {
            return { valid: false, message: "La data di fine deve essere una domenica." };
        }

        if (diffInDays !== 6) {
            return { valid: false, message: "La differenza tra le due date deve essere esattamente di 7 giorni (dalla mattina del lunedì alla sera della domenica)." };
        }

        return { valid: true };
    }

    async function saveGymPlan() {
        const result = validateWeekRange("start_date", "end_date");

        if(result.valid) {
            // Effettua una richiesta PATCH al backend per aggiornare un piano alimentare esistente
            const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan/update/${data.id}/`, {
                method: "PATCH", // Metodo HTTP per aggiornare solo i campi specificati
                headers: {
                    "Content-Type": "application/json", // Indica che il corpo della richiesta è in formato JSON
                    "Authorization": "Token " + getCookie('csrftoken'), // Aggiunge il token CSRF per autenticazione
                },
                // Corpo della richiesta con i dati aggiornati da inviare al server
                body: JSON.stringify({
                    start_date: document.getElementById("start_date").value, // Data di inizio del piano
                    end_date: document.getElementById("end_date").value,     // Data di fine del piano
                    note: document.getElementById("notes_plan").value        // Note del piano
                })
            });

            // Se la risposta è positiva (2xx), reindirizza alla pagina dei programmi alimentari
            if (response.ok) {
                location.href = "/account/gym-programs/";
            } else {
                // Altrimenti mostra un messaggio di errore all'utente
                showMessage("Errore durante il salvataggio della scheda di allenamento!");
            }
        } else {
            showMessage(result.message);
        }
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

        const formattedStartDate = gym_plan_json["start_date"].split('/').reverse().join('-');
        document.getElementById("start_date").value = formattedStartDate;
        const formattedEndDate = gym_plan_json["end_date"].split('/').reverse().join('-');
        document.getElementById("end_date").value = formattedEndDate;

        document.getElementById("notes_plan").innerText = gym_plan_json["note"];
        document.getElementById('ai_notes_plan').addEventListener("click", async function () {
            document.getElementById("ai_notes_plan").disabled = true;
            document.getElementById("notes_plan").disabled = true;
            document.getElementById("notes_plan").cursor = "not-allowed";

            const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan/generate-note/${idGymPlan}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Token " + getCookie('csrftoken'),
                }
            });

            const result = await response.json();
            if(response.ok) location.reload();
        });

        let isNameDayOrNull = getTodayWeekdayIfInRange(gym_plan_json["start_date"], gym_plan_json["end_date"]);
        let dayBeforeToday = giorniPrecedenti(isNameDayOrNull);

        let gym_plan_items = gym_plan_json["gym_plan_items"];
        isEmpty = isDefaultWeeklyPlan(gym_plan_items);

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
                isDayEmpty = isDefaultDayItem(gym_plan_items, short);
                showDayGeneration = full;
                showDayShortGeneration = short;
                isNotLoaded = true;

                currentSelection = [];

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
                        ${full}
                    </h2>

                    <label for="type_day">Tipologia della giornata:</label>
                    <div class="input-wrapper">
                        <input type="text" id="type_day" name="type_day" value="${type_day}"
                            placeholder="Inserisci la tipologia della giornata qui..." />
                        <button type="button" class="inside-button button-ai" id="ai_type_day">Genera</button>
                    </div>

                    <label for="notes_day">Note della giornata:</label>
                    <div class="input-wrapper">
                        <textarea id="notes_day" name="notes_day"
                            placeholder="Inserisci le note della giornata qui...">${notes_day}</textarea>
                        <button type="button" class="inside-button button-ai" id="ai_notes_day">Genera</button>
                    </div>

                    <div id="${short}"></div>
                `;

                let oneTime = true;
                gym_plan_items.forEach((item) => {
                    if (item.section.day === short && oneTime) {
                        document.getElementById('type_day').addEventListener("input", async function () {
                            const newType = this.value;
                            const sectionId = item.section.id;

                            const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-section/update/${sectionId}/`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": "Token " + getCookie('csrftoken'),
                                },
                                body: JSON.stringify({
                                    type: newType
                                }),
                            });

                            item.section.type = this.value;
                        });

                        document.getElementById('ai_type_day').addEventListener("click", async function () {
                            const sectionId = item.section.id;
                            document.getElementById("ai_type_day").disabled = true;
                            document.getElementById("type_day").disabled = true;
                            document.getElementById("type_day").cursor = "not-allowed";

                            const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-section/classify/${sectionId}/`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": "Token " + getCookie('csrftoken'),
                                }
                            });

                            const result = await response.json();
                            if(response.ok) {
                                localStorage.setItem("sectionDay", item.section.day_display)
                                localStorage.setItem("isAddingElement", "true");
                                location.reload();
                            }
                        });

                        document.getElementById('notes_day').addEventListener("input", async function () {
                            const newNote = this.value;
                            const sectionId = item.section.id;

                            const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-section/update/${sectionId}/`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": "Token " + getCookie('csrftoken'),
                                },
                                body: JSON.stringify({
                                    note: newNote
                                }),
                            });

                            item.section.note = this.value;
                        });

                        document.getElementById('ai_notes_day').addEventListener("click", async function () {
                            const sectionId = item.section.id;
                            document.getElementById("ai_notes_day").disabled = true;
                            document.getElementById("notes_day").disabled = true;
                            document.getElementById("notes_day").cursor = "not-allowed";

                            const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-section/generate-note/${sectionId}/`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": "Token " + getCookie('csrftoken'),
                                }
                            });

                            const result = await response.json();
                            if(response.ok) {
                                localStorage.setItem("sectionDay", item.section.day_display)
                                localStorage.setItem("isAddingElement", "true");
                                location.reload();
                            }
                        });

                        oneTime = false;
                    }
                });

                const divDay = document.getElementById(short);

                const buttonAddTechnique = document.createElement("button");
                buttonAddTechnique.textContent = "Aggiungi esercizio";
                buttonAddTechnique.style = "margin: 30px 0";
                buttonAddTechnique.addEventListener("click", (e) => {
                    showChooseIntensityModal = true;
                });
                divDay.appendChild(buttonAddTechnique);

                gym_plan_items.forEach((item) => {
                    if (item.section.day === short) {
                        idGymSection = item.section.id;
                        localStorage.setItem("sectionDay", item.section.day_display);
                        let techniques = "";
                        if (Array.isArray(item.intensity_techniques_display)) {
                            techniques = item.intensity_techniques_display.join(', ');
                        } else if (typeof item.intensity_techniques_display === "string") {
                            techniques = item.intensity_techniques_display.split(/[,;|]/).map(t => t.trim()).join(', ');
                        }

                        if (!item.intensity_techniques.includes("null")) {
                            const gym_plan_item = document.createElement("div");
                            gym_plan_item.classList.add("exercise-row");
                            gym_plan_item.innerHTML = `
                                <div class="exercise-number">${item.order}</div>
                                <div class="exercise-title input-wrapper">
                                    <input type="text" class="exercise-notes-input" id="exercise_notes_input" value="${item.notes || ''}" />
                                    <button type="button" class="inside-button button-ai generate-exercise-notes-button" id="ai_exercise_notes_input" style="top: 5px; right: 6px;">Genera</button>
                                </div>
                                <div class="exercise-technique">${techniques}</div>
                                <div class="exercise-actions">
                                    <span class="material-icons delete-exercise-button">delete</span>
                                </div>
                            `;

                            gym_plan_item.id = "orderExercise" + item.order;

                            gym_plan_item.querySelector(".generate-exercise-notes-button").addEventListener("click", async function () {
                                document.getElementById("ai_exercise_notes_input").disabled = true;
                                document.getElementById("exercise_notes_input").disabled = true;
                                document.getElementById("exercise_notes_input").cursor = "not-allowed";

                                const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-item/generate-note/${item.id}/`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        "Authorization": "Token " + getCookie('csrftoken'),
                                    }
                                });

                                const result = await response.json();
                                if(response.ok) {
                                    localStorage.setItem("sectionDay", item.section.day_display)
                                    localStorage.setItem("isAddingElement", "true");
                                    location.reload();
                                }
                            });

                            gym_plan_item.querySelector(".delete-exercise-button").addEventListener("click", async function () {
                                const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-item/delete/${item.id}/`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Token ' + getCookie('csrftoken'),
                                    }
                                });

                                if (response.ok) {
                                    location.reload();
                                }
                            });

                            gym_plan_item.querySelector(".exercise-notes-input").addEventListener("input", async function (e) {
                                const updatedNotes = e.target.value;

                                const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-item/update/${item.id}/`, {
                                    method: 'PATCH', // o 'PUT', dipende dal tuo backend
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Token ' + getCookie('csrftoken'),
                                    },
                                    body: JSON.stringify({
                                        notes: updatedNotes
                                    })
                                });

                                if (!response.ok) {
                                    alert("Errore nell'aggiornamento delle note.");
                                }
                            });

                            let plan_item = item.id;

                            divDay.appendChild(gym_plan_item);

                            currentSelection.push({value: item.id, label: item.order + ": " + item.notes + " (" + techniques + ")"})

                            const groupedSets = {};
                            item.sets.forEach(set => {
                                if (!groupedSets[set.set_number]) {
                                    groupedSets[set.set_number] = [];
                                }
                                groupedSets[set.set_number].push(set);
                            });

                            const setNumbers = Object.keys(groupedSets).sort((a, b) => a - b);

                            if(item.intensity_techniques.includes("tempo-based")) {
                                IntensityTechniquesTempoBase(setNumbers, groupedSets, divDay, openExercisePopup);
                            } else if (item.intensity_techniques.includes("unilateral")) {
                                IntensityTechniquesUnilateral(setNumbers, groupedSets, divDay, disabledDayBefore, openExercisePopup);
                            } else if (item.intensity_techniques.includes("rest_pause")) {
                                const button = document.createElement("button");
                                button.classList.add("buttonCedimento");
                                button.textContent = "Aggiungi serie a cedimento";
                                button.style.margin = 0;

                                IntensityTechniquesRestPause(setNumbers, groupedSets, divDay, dayBeforeToday, full, button, openExercisePopup, plan_item, gym_plan_item);
                            } else if (item.intensity_techniques.includes("myoreps")) {
                                const button = document.createElement("button");
                                button.classList.add("buttonCedimento");
                                button.textContent = "Aggiungi serie a cedimento";
                                button.style.margin = 0;
                                button.style.display = 'none';

                                IntensityTechniquesMyoreps(setNumbers, groupedSets, divDay, dayBeforeToday, full, button, openExercisePopup, plan_item, gym_plan_item);
                            } else if (item.intensity_techniques.includes("isometric") || item.intensity_techniques.includes("isometric_overload")) {
                                IntensityTechniquesIsometric(setNumbers, groupedSets, divDay, openExercisePopup);
                            } else if (item.intensity_techniques.includes("emom")) {
                                IntensityTechniquesEMOM(setNumbers, groupedSets, divDay, openExercisePopup);
                            } else if (item.intensity_techniques.includes("amrap")) {
                                IntensityTechniquesAMRAP(setNumbers, groupedSets, divDay, openExercisePopup);
                            } else if (item.intensity_techniques.includes("death_set")) {
                                IntensityTechniquesDeathSet(setNumbers, groupedSets, divDay, openExercisePopup);
                            } else {
                                IntensityTechniquesDefault(setNumbers, groupedSets, divDay, openExercisePopup);
                            }
                        }
                    }
                });
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

        fetchGymItems();

        isLoading = false;
    });
</script>