import {getCookie} from "svelte-cookie";

export function IntensityTechniquesTempoBase(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber > 0) box.innerHTML = `<h4>Serie ${setNumber}</h4>`;
        else box.innerHTML = `<h4>Riscaldamento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const headers = [
            { style: "text-align: left", content: "Esercizio" },
            { className: "data-value", content: "Minuti Prescritti", title: "Numero di minuti prescritti da eseguire" },
            { className: "data-value", content: "Minuti Effettuati", title: "Numero di minuti realmente eseguiti" },
            { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" },
        ];

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            const data = [
                { type: "text", value: set.exercise.name, disabled: true, mobilelabel: "Esercizio:" },
                { type: "input", value: set.prescribed_reps_1 + " min.", disabled: true, mobilelabel: "Minuti Prescritti:" },
                { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Minuti Effettuati:", event: true},
                { type: "input", value: rest+" sec.", disabled: true, mobilelabel: "Recupero:" },
            ];

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }
            });

            tbody.appendChild(row);
            table.appendChild(tbody);
        });

        divDay.appendChild(box);
    });
}

export function IntensityTechniquesUnilateral(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber > 0) box.innerHTML = `<h4>Serie ${setNumber}</h4>`;
        else box.innerHTML = `<h4>Riscaldamento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        const headers = [
            { className: "order-value", content: "" },
            { style: "text-align: left", content: "Esercizio" },
            { className: "data-value", content: "Ripetizioni Prescritte (arto 1)", title: "Numero di ripetizioni prescritte da eseguire" },
            { className: "data-value", content: "Ripetizioni Effettuate (arto 1)", title: "Numero di ripetizioni realmente eseguite" },
            { className: "data-value", content: "Ripetizioni Prescritte (arto 2)", title: "Numero di ripetizioni prescritte da eseguire" },
            { className: "data-value", content: "Ripetizioni Effettuate (arto 2)", title: "Numero di ripetizioni realmente eseguite" },
            ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
            { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
            ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }]:[]),
            ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }]:[]),
            ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }]:[]),
            { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" },
        ];

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            const data = [
                { type: "div", className: "set-number", value: test+1, mobilelabel: "Ordine:" },
                { type: "text", value: set.exercise.name, disabled: true, mobilelabel: "Esercizio:" },
                { type: "input", value: set.prescribed_reps_1, disabled: true, mobilelabel: "Ripetizioni Prescritte (arto 1):" },
                { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Ripetizioni Effettuate (arto 1):", event: true},
                { type: "input", value: set.prescribed_reps_2, disabled: true, mobilelabel: "Ripetizioni Prescritte (arto 2):" },
                { type: "input", value: set.actual_reps_2, disabled: disabledDayBefore, mobilelabel: "Ripetizioni Effettuate (arto 2):", event: true},
                ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),
                { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }]:[]),
                ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }]:[]),
                ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }]:[]),
                { type: "input", value: rest+" sec.", disabled: true, mobilelabel: "Recupero:" },
            ];

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(!sameExercisesOnSets) {
                        const div = document.createElement("div");
                        div.className = item.className;
                        div.textContent = item.value;

                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        td.appendChild(span);
                        td.appendChild(div);
                    }
                    row.appendChild(td);
                } else if (index === 1) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event && index == 3) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });
                    else if(item.event && index == 5) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_2: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }


            });

            tbody.appendChild(row);
            table.appendChild(tbody);
        });

        if(sameExercisesOnSets)
            for (const riga of table.rows)
                if (riga.cells[0])
                    riga.deleteCell(0);

        divDay.appendChild(box);
    });
}

export function IntensityTechniquesRestPause(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore, dayBeforeToday, full, button, plan_item, gym_plan_item) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber == 0)
            box.innerHTML = `<h4>Serie d'introduzione</h4>`;
        else if(setNumber >= 1)
            box.innerHTML = `<h4>Serie a cedimento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        let headers;
        if(setNumber == 0) {
            headers = [
                { className: "order-value", content: "" },
                { style: "text-align: left", content: "Esercizio" },
                { className: "data-value", content: "Ripetizioni Prescritte", title: "Numero di ripetizioni prescritte da eseguire" },
                { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" },
                ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
                { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
                ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
                ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
                ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
                { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" }
            ];
        } else if(setNumber >= 1) {
            headers = [
                { className: "order-value", content: "" },
                { style: "text-align: left", content: "Esercizio" },
                { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" },
                ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
                { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
                ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
                ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
                ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
                { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" }
            ];
        }

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test, array) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            let data;
            if(setNumber == 0) {
                data = [
                    {
                        type: "div",
                        className: "set-number",
                        value: test + 1,
                        mobilelabel: "Ordine:"
                    },
                    {
                        type: "text",
                        value: set.exercise.name,
                        disabled: true,
                        mobilelabel: "Esercizio:"
                    },
                    {
                        type: "input",
                        value: set.prescribed_reps_1,
                        disabled: true,
                        mobilelabel: "Ripetizioni Prescritte:"
                    },
                    {
                        type: "input",
                        value: set.actual_reps_1,
                        disabled: disabledDayBefore,
                        mobilelabel: "Ripetizioni Effettuate:",
                        event: true
                    },
                    ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),,
                    { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                    ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                    ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                    ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
                    {
                        type: "input",
                        value: rest + " sec.",
                        disabled: true,
                        mobilelabel: "Recupero:"
                    }
                ];
            } else if(setNumber >= 1) {
                data = [
                    {
                        type: "div",
                        className: "set-number",
                        value: test + 1,
                        mobilelabel: "Ordine:"
                    },
                    {
                        type: "text",
                        value: set.exercise.name,
                        disabled: true,
                        mobilelabel: "Esercizio:"
                    },
                    {
                        type: "input",
                        value: set.actual_reps_1,
                        disabled: disabledDayBefore,
                        mobilelabel: "Ripetizioni Effettuate:",
                        event: true
                    },
                    ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),,
                    { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                    ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                    ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                    ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
                    {
                        type: "input",
                        value: rest + " sec.",
                        disabled: true,
                        mobilelabel: "Recupero:"
                    }
                ];
            }

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(!sameExercisesOnSets) {
                        const div = document.createElement("div");
                        div.className = item.className;
                        div.textContent = item.value;

                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        td.appendChild(span);
                        td.appendChild(div);
                    }
                    row.appendChild(td);
                } else if (index === 1) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }


            });

            tbody.appendChild(row);
            table.appendChild(tbody);

            if(setNumber == 1 && test === array.length - 1) {
                button.addEventListener("click", async() => {
                    const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/create/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token " + getCookie('csrftoken'),
                        },
                        body: JSON.stringify({
                            order: set.order+1,
                            set_number: set.set_number,
                            prescribed_reps_1: 0,
                            prescribed_reps_2: 0,
                            actual_reps_1: 0,
                            actual_reps_2: 0,
                            rir: set.rir,
                            rest_seconds: set.rest_seconds,
                            weight: set.weight,
                            tempo_fcr: set.tempo_fcr,
                            plan_item: plan_item,
                            exercise_id: set.exercise.id
                        })
                    });

                    localStorage.setItem("scrollToId", gym_plan_item.id);
                    location.reload();
                });
            }
        });

        if(sameExercisesOnSets)
            for (const riga of table.rows)
                if (riga.cells[0])
                    riga.deleteCell(0);

        if(!dayBeforeToday.includes(full)) {
            box.appendChild(button);
        }
        divDay.appendChild(box);
    });
}

export function IntensityTechniquesMyoreps(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore, dayBeforeToday, full, button, plan_item, gym_plan_item, maxReps, minReps) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber == 0)
            box.innerHTML = `<h4>Serie d'introduzione</h4>`;
        else if(setNumber >= 1)
            box.innerHTML = `<h4>Serie a cedimento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        let headers;
        if(setNumber == 0) {
            headers = [
                { className: "order-value", content: "" },
                { style: "text-align: left", content: "Esercizio" },
                { className: "data-value", content: "Ripetizioni Prescritte", title: "Numero di ripetizioni prescritte da eseguire" },
                { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" },
                ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
                { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
                ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
                ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
                ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
                { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" }
            ];
        } else if(setNumber >= 1) {
            headers = [
                { className: "order-value", content: "" },
                { style: "text-align: left", content: "Esercizio" },
                { className: "data-value", content: "Ripetizioni Prescritte massime", title: "Numero di ripetizioni massime prescritte da eseguire" },
                { className: "data-value", content: "Ripetizioni Prescritte minime", title: "Numero di ripetizioni minime prescritte da eseguire" },
                { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" },
                ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
                { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
                ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
                ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
                ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
                { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" }
            ];
        }

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test, array) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            let data;
            if(setNumber == 0) {
                maxReps = set.prescribed_reps_2;
                minReps = set.actual_reps_2;
                data = [
                    {
                        type: "div",
                        className: "set-number",
                        value: test + 1,
                        mobilelabel: "Ordine:"
                    },
                    {
                        type: "text",
                        value: set.exercise.name,
                        disabled: true,
                        mobilelabel: "Esercizio:"
                    },
                    {
                        type: "input",
                        value: set.prescribed_reps_1,
                        disabled: true,
                        mobilelabel: "Serie Prescritte:"
                    },
                    {
                        type: "input",
                        value: set.actual_reps_1,
                        disabled: disabledDayBefore,
                        mobilelabel: "Serie Effettuate:",
                        event: true
                    },
                    ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),,
                    { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                    ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                    ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                    ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
                    {
                        type: "input",
                        value: rest + " sec.",
                        disabled: true,
                        mobilelabel: "Recupero:"
                    }
                ];
            } else if(setNumber >= 1) {
                data = [
                    {
                        type: "div",
                        className: "set-number",
                        value: test + 1,
                        mobilelabel: "Ordine:"
                    },
                    {
                        type: "text",
                        value: set.exercise.name,
                        disabled: true,
                        mobilelabel: "Esercizio:"
                    },
                    {
                        type: "input",
                        value: maxReps,
                        disabled: true,
                        mobilelabel: "Serie Prescritte massime:"
                    },
                    {
                        type: "input",
                        value: minReps,
                        disabled: true,
                        mobilelabel: "Serie Prescritte minime:"
                    },
                    {
                        type: "input",
                        value: set.actual_reps_1,
                        disabled: disabledDayBefore,
                        mobilelabel: "Serie Effettuate:",
                        event: true
                    },
                    ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),,
                    { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                    ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                    ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                    ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
                    {
                        type: "input",
                        value: rest + " sec.",
                        disabled: true,
                        mobilelabel: "Recupero:"
                    }
                ];
            }

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(!sameExercisesOnSets) {
                        const div = document.createElement("div");
                        div.className = item.className;
                        div.textContent = item.value;

                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        td.appendChild(span);
                        td.appendChild(div);
                    }
                    row.appendChild(td);
                } else if (index === 1) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }

                if(index === 4 && test === array.length - 1 && setNumber == 1) {
                    let cellInput = row.cells[3].querySelector("input");

                    if(cellInput.value < minReps) button.style.display = 'none';
                    else button.style.display = 'block';

                    cellInput.addEventListener("input", function () {
                        if(cellInput.value < minReps) button.style.display = 'none';
                        else button.style.display = 'block';
                    });
                }
            });

            tbody.appendChild(row);
            table.appendChild(tbody);

            if(setNumber == 1 && test === array.length - 1) {
                button.addEventListener("click", async() => {
                    const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/create/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token " + getCookie('csrftoken'),
                        },
                        body: JSON.stringify({
                            order: set.order+1,
                            set_number: set.set_number,
                            prescribed_reps_1: 0,
                            prescribed_reps_2: 0,
                            actual_reps_1: 0,
                            actual_reps_2: 0,
                            rir: set.rir,
                            rest_seconds: set.rest_seconds,
                            weight: set.weight,
                            tempo_fcr: set.tempo_fcr,
                            plan_item: plan_item,
                            exercise_id: set.exercise.id
                        })
                    });

                    console.log(plan_item);

                    localStorage.setItem("scrollToId", gym_plan_item.id);
                    location.reload();
                });
            }
        });

        if(sameExercisesOnSets)
            for (const riga of table.rows)
                if (riga.cells[0])
                    riga.deleteCell(0);

        if(!dayBeforeToday.includes(full)) {
            box.appendChild(button);
        }
        divDay.appendChild(box);
    });
}

export function IntensityTechniquesIsometric(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber > 0) box.innerHTML = `<h4>Serie ${setNumber}</h4>`;
        else box.innerHTML = `<h4>Riscaldamento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        const headers = [
            { className: "order-value", content: "" },
            { style: "text-align: left", content: "Esercizio" },
            { className: "data-value", content: "Secondi Prescritti", title: "Numero di secondi prescritti da eseguire" },
            { className: "data-value", content: "Secondi Effettuati", title: "Numero di secondi realmente eseguiti" },
            ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
            { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
            ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
            ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
            ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
            { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" },
        ];

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            const data = [
                { type: "div", className: "set-number", value: test+1, mobilelabel: "Ordine:" },
                { type: "text", value: set.exercise.name, disabled: true, mobilelabel: "Esercizio:" },
                { type: "input", value: set.prescribed_reps_1, disabled: true, mobilelabel: "Serie Prescritte:" },
                { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Serie Effettuate:", event: true},
                ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),
                { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
                { type: "input", value: rest+" sec.", disabled: true, mobilelabel: "Recupero:" },
            ];

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(!sameExercisesOnSets) {
                        const div = document.createElement("div");
                        div.className = item.className;
                        div.textContent = item.value;

                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        td.appendChild(span);
                        td.appendChild(div);
                    }
                    row.appendChild(td);
                } else if (index === 1) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }


            });

            tbody.appendChild(row);
            table.appendChild(tbody);
        });

        if(sameExercisesOnSets)
            for (const riga of table.rows)
                if (riga.cells[0])
                    riga.deleteCell(0);

        divDay.appendChild(box);
    });
}

export function IntensityTechniquesEMOM(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber > 0) box.innerHTML = `<h4>Serie ${setNumber}</h4>`;
        else box.innerHTML = `<h4>Riscaldamento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        const headers = [
            { style: "text-align: left", content: "Esercizio" },
            { className: "order-value", content: "Minuto" },
            { className: "data-value", content: "Ripetizioni Prescritte", title: "Numero di ripetizioni prescritte da eseguire" },
            { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" },
            ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
            { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
            ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
            ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
            ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
        ];

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            const data = [
                { type: "text", value: set.exercise.name, disabled: true, mobilelabel: "Esercizio:" },
                { type: "div", className: "set-number", value: test+1, mobilelabel: "Minuto:" },
                { type: "input", value: set.prescribed_reps_1, disabled: true, mobilelabel: "Serie Prescritte:" },
                { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Serie Effettuate:", event: true},
                ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),,
                { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
            ];

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else if (index === 1) {
                    const div = document.createElement("div");
                    div.className = item.className;
                    div.textContent = item.value;

                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    td.appendChild(span);
                    td.appendChild(div);
                    row.appendChild(td);
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }


            });

            tbody.appendChild(row);
            table.appendChild(tbody);
        });

        divDay.appendChild(box);
    });
}

export function IntensityTechniquesAMRAP(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber > 0) box.innerHTML = `<h4>Circuito</h4>`;
        else box.innerHTML = `<h4>Riscaldamento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let firstSet = groupedSets[setNumber][0];
        let rest = firstSet.rest_seconds;
        let skipDurationAndReps = rest === 0 && firstSet.prescribed_reps_1 === 0;
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        const headers = [
            { className: "order-value", content: "" },
            { style: "text-align: left", content: "Esercizio" },
            { className: "data-value", content: "Durata", title: "Durata dell'esercizio in AMRAP" },
            { className: "data-value", content: "Ripetizioni Prescritte", title: "Numero di ripetizioni prescritte da eseguire" },
            { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" },
            ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
            { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
            ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
            ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
            ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
        ];

        headers.forEach((h, index) => {
            if (skipDurationAndReps && (index === 2 || index === 3)) return; // Salta Durata e Ripetizioni Prescritte

            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            const data = [
                { type: "div", className: "set-number", value: test+1, mobilelabel: "Ordine:" },
                { type: "text", value: set.exercise.name, disabled: true, mobilelabel: "Esercizio:" },
                { type: "input", value: rest+" sec.", disabled: true, mobilelabel: "Durata:" },
                { type: "input", value: set.prescribed_reps_1, disabled: true, mobilelabel: "Ripetizioni Prescritte:" },
                { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Ripetizioni Effettuate:", event: true},
                ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),
                { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
            ];

            data.forEach((item, index) => {
                if (skipDurationAndReps && (index === 2 || index === 3)) return;

                const td = document.createElement("td");

                if (index === 0) {
                    if(!sameExercisesOnSets) {
                        const div = document.createElement("div");
                        div.className = item.className;
                        div.textContent = item.value;

                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        td.appendChild(span);
                        td.appendChild(div);
                    }
                    row.appendChild(td);
                } else if (index === 1) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else if (index === 2) {
                    if (test === 0) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        const wrapper = document.createElement("div");
                        wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                        const input = document.createElement("input");
                        input.type = "text";
                        input.className = "set-input";
                        input.value = item.value;
                        if (item.disabled) input.disabled = true;

                        wrapper.appendChild(input);
                        td.appendChild(span);
                        td.appendChild(wrapper);

                        td.rowSpan = lengthSets; // <-- RIGA IMPORTANTE: fa sì che la cella duri per tutte le righe
                        row.appendChild(td);
                    }
                    // Se non è la prima riga, saltiamo la creazione della cella Durata
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }


            });

            tbody.appendChild(row);
            table.appendChild(tbody);
        });

        if(sameExercisesOnSets)
            for (const riga of table.rows)
                if (riga.cells[0])
                    riga.deleteCell(0);

        divDay.appendChild(box);
    });
}

export function IntensityTechniquesDeathSet(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore) {
    setNumbers.forEach(setNumber => {
        let showRecoveryColumn = false;
        if(setNumber == 3) showRecoveryColumn = true;

        let isSecondSet = !(setNumber == 5);

        const box = document.createElement("div");
        box.classList.add("set-box");
        const titles = {
            1: "Serie iniziale",
            2: "1° Drop Set",
            3: "2° Drop Set + Rest Pause",
            4: "Parziali",
            5: "Isometria",
        };

        const title = titles[setNumber] || `Serie ${setNumber}`;
        box.innerHTML = `<h4>${title}</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        const headers = [
            { className: "order-value", content: "" },
            { style: "text-align: left", content: "Esercizio" },
            ...(isSecondSet ? [
                { className: "data-value", content: "Ripetizioni Prescritte", title: "Numero di ripetizioni prescritte da eseguire" },
                { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" }
            ]: [
                { className: "data-value", content: "Secondi Prescritti", title: "Numero di secondi prescritti da eseguire" },
                { className: "data-value", content: "Secondi Effettuati", title: "Numero di secondi realmente eseguiti" },
            ]),
            ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
            { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
            ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
            ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
            ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
            ...(showRecoveryColumn ? [{ className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" }] : []),
        ];

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            const data = [
                { type: "div", className: "set-number", value: test+1, mobilelabel: "Ordine:" },
                { type: "text", value: set.exercise.name, disabled: true, mobilelabel: "Esercizio:" },
                ...(isSecondSet ? [
                    { type: "input", value: set.prescribed_reps_1, disabled: true, mobilelabel: "Ripetizioni Prescritte:" },
                    { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Ripetizioni Effettuate:", event: true},
                ] : [
                    { type: "input", value: set.prescribed_reps_1 + " sec.", disabled: true, mobilelabel: "Secondi Prescritti:" },
                    { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Secondi Effettuati:", event: true},
                ]),
                ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),
                { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
                ...(showRecoveryColumn ? [{ type: "input", value: rest+" sec.", disabled: true, mobilelabel: "Recupero:" }] : []),
            ];

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(!sameExercisesOnSets) {
                        const div = document.createElement("div");
                        div.className = item.className;
                        div.textContent = item.value;

                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        td.appendChild(span);
                        td.appendChild(div);
                    }
                    row.appendChild(td);
                } else if (index === 1) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }
            });

            tbody.appendChild(row);
            table.appendChild(tbody);
        });

        if(sameExercisesOnSets)
            for (const riga of table.rows)
                if (riga.cells[0])
                    riga.deleteCell(0);

        divDay.appendChild(box);
    });
}

export function IntensityTechniquesDefault(setNumbers, groupedSets, divDay, openExercisePopup, disabledDayBefore) {
    setNumbers.forEach(setNumber => {
        const box = document.createElement("div");
        box.classList.add("set-box");
        if(setNumber > 0) box.innerHTML = `<h4>Serie ${setNumber}</h4>`;
        else box.innerHTML = `<h4>Riscaldamento</h4>`;

        let sameExercisesOnSets = groupedSets[setNumber].every(
            set => set.exercise.name === groupedSets[setNumber][0].exercise.name
        );
        let lengthSets = groupedSets[setNumber].length;

        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        let eccs = [], fermos = [], concs = [], rirs = [];
        groupedSets[setNumber].forEach((set) => {
            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            eccs.push(ecc);
            fermos.push(fermo);
            concs.push(conc);
            rirs.push(set.rir);
        });
        const eccsZero = eccs.some(e => parseInt(e) !== 0);
        const fermosZero = fermos.some(f => parseInt(f) !== 0);
        const concsZero = concs.some(c => parseInt(c) !== 0);
        const rirsZero = rirs.some(c => parseInt(c) !== 0);

        const headers = [
            { className: "order-value", content: "" },
            { style: "text-align: left", content: "Esercizio" },
            { className: "data-value", content: "Ripetizioni Prescritte", title: "Numero di ripetizioni prescritte da eseguire" },
            { className: "data-value", content: "Ripetizioni Effettuate", title: "Numero di ripetizioni realmente eseguite" },
            ...(rirsZero ? [{ className: "data-value", content: "RIR", title: "Reps In Reserve: quante ripetizioni avresti ancora potuto fare" }]:[]),
            { className: "data-value", content: "Peso", title: "Peso utilizzato per la serie" },
            ...(eccsZero ? [{ className: "data-value", content: "Eccentrica", title: "Fase eccentrica: discesa lenta e controllata" }] : []),
            ...(fermosZero ? [{ className: "data-value", content: "Fermo", title: "Pausa in posizione intermedia o bassa" }] : []),
            ...(concsZero ? [{ className: "data-value", content: "Concentrica", title: "Fase concentrica: spinta o contrazione muscolare" }] : []),
            { className: "data-value", content: "Recupero", title: "Tempo di recupero tra le serie, in secondi" },
        ];

        headers.forEach(h => {
            const th = document.createElement("th");
            if (h.className) th.className = h.className;
            if (h.style) th.setAttribute("style", h.style);
            if (h.title) {
                const span = document.createElement("span");
                span.className = "info-icon";
                span.title = h.title;
                span.textContent = h.content;
                th.appendChild(span);
            } else {
                th.textContent = h.content;
            }
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        box.append(table);

        groupedSets[setNumber].forEach((set, test) => {
            const row = document.createElement("tr");

            const [ecc, fermo, conc] = set.tempo_fcr.split("-");
            const rest = set.rest_seconds;

            const data = [
                { type: "div", className: "set-number", value: test+1, mobilelabel: "Ordine:" },
                { type: "text", value: set.exercise.name, disabled: true, mobilelabel: "Esercizio:" },
                { type: "input", value: set.prescribed_reps_1, disabled: true, mobilelabel: "Serie Prescritte:" },
                { type: "input", value: set.actual_reps_1, disabled: disabledDayBefore, mobilelabel: "Serie Effettuate:", event: true},
                ...(rirsZero ? [{ type: "input", value: set.rir, disabled: true, mobilelabel: "RIR:" }]:[]),,
                { type: "input", value: set.weight+"kg", disabled: true, mobilelabel: "Peso:" },
                ...(eccsZero ? [{ type: "input", value: ecc+" sec.", disabled: true, mobilelabel: "Eccentrica:" }] : []),
                ...(fermosZero ? [{ type: "input", value: fermo+" sec.", disabled: true, mobilelabel: "Fermo:" }] : []),
                ...(concsZero ? [{ type: "input", value: conc+" sec.", disabled: true, mobilelabel: "Concentrica:" }] : []),
                { type: "input", value: rest+" sec.", disabled: true, mobilelabel: "Recupero:" },
            ];

            data.forEach((item, index) => {
                const td = document.createElement("td");

                if (index === 0) {
                    if(!sameExercisesOnSets) {
                        const div = document.createElement("div");
                        div.className = item.className;
                        div.textContent = item.value;

                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;

                        td.appendChild(span);
                        td.appendChild(div);
                    }
                    row.appendChild(td);
                } else if (index === 1) {
                    if(test === 0 && sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.rowSpan = lengthSets;
                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    } else if(!sameExercisesOnSets) {
                        const span = document.createElement("span");
                        span.className = "mobile-label";
                        span.textContent = item.mobilelabel;
                        row.appendChild(span);

                        const link_exercise = document.createElement("a");
                        link_exercise.href = "";
                        link_exercise.addEventListener("click", () => openExercisePopup(set.exercise));
                        link_exercise.textContent = item.value;

                        td.appendChild(link_exercise);
                        row.appendChild(td);
                    }
                } else {
                    const span = document.createElement("span");
                    span.className = "mobile-label";
                    span.textContent = item.mobilelabel;

                    const wrapper = document.createElement("div");
                    wrapper.className = item.disabled ? "input-with-info" : "input-with-info-enabled";

                    const input = document.createElement("input");
                    input.type = "text";
                    input.className = "set-input";
                    input.value = item.value;
                    if (item.disabled) input.disabled = true;
                    if (item.event) input.addEventListener("input", async function () {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/data/gym-plan-set/update/${set.id}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + getCookie('csrftoken'),
                            },
                            body: JSON.stringify({
                                actual_reps_1: this.value
                            })
                        });
                    });

                    wrapper.appendChild(input);
                    td.appendChild(span);
                    td.appendChild(wrapper);
                    row.appendChild(td);
                }
            });

            tbody.appendChild(row);
            table.appendChild(tbody);
        });

        if(sameExercisesOnSets)
            for (const riga of table.rows)
                if (riga.cells[0])
                    riga.deleteCell(0);

        divDay.appendChild(box);
    });
}