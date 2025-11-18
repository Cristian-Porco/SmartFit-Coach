import {getCookie} from "svelte-cookie";

let naturalLanguageFoods = null;

export async function external_showAIDivNaturalLanguage1(
    selectedSection, naturalLanguageInput
) {
    if(selectedSection !== "") {
        if(naturalLanguageInput !== "") {
            document.getElementById("addNaturalLanguage1")
                .style.display = "none";

            const aiBox =
                document.getElementById("ai-box-nl");
            const aiContent =
                document.getElementById("ai-content-nl");

            aiBox.classList.remove("hidden");
            setTimeout(() => aiBox.classList.add("visible"), 10); // per attivare la transizione

            const responseAnalysis =
                await fetch("http://127.0.0.1:8000/api/v1/data/food-plan/food-text-parsing/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    sentence: naturalLanguageInput
                })
            });

            if(responseAnalysis.ok) {
                aiContent.classList.remove("ai-loader");
                aiContent.classList.add("ai-response");

                const data = await responseAnalysis.json();
                naturalLanguageFoods = data.meals;

                const conditionMealsEmpty = (
                    data.meals.length === 1 &&
                    data.meals[0].matched_food_item?.id === null
                );
                if(!conditionMealsEmpty) {
                    document.getElementById("addNaturalLanguage2").style.display = "block";

                    data.meals.forEach(meal => {
                        const card = document.createElement("div");
                        card.style.border = "1px solid #ccc";
                        card.style.borderRadius = "10px";
                        card.style.padding = "15px";
                        card.style.marginBottom = "10px";
                        card.style.backgroundColor = "#f9f9f9";
                        card.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.1)";

                        const mealTitle = document.createElement("h3");
                        mealTitle.textContent = meal.matched_food_item.name;

                        const quantity = document.createElement("p");
                        quantity.innerHTML = `<strong>Quantità:</strong> ${meal.quantity}g`;

                        card.appendChild(mealTitle);
                        card.appendChild(quantity);

                        aiContent.appendChild(card);
                    });
                } else {
                    aiBox.classList.add("hidden");
                    aiContent.classList.add("ai-loader");
                    aiContent.classList.remove("ai-response");
                    document.getElementById("addNaturalLanguage1").style.display = "block";
                    showMessage("Non hai inserito una descrizione valida, inserisci una descrizione in cui spieghi cosa hai mangiato!", "errorNaturalLanguage");
                }
            } else {
                showMessage("Problemi di comunicazione con la IA!", "errorNaturalLanguage");
            }
        } else {
            showMessage("Descrizione non inserita!", "errorNaturalLanguage");
        }
    } else {
        showMessage("Sezione non inserita!", "errorNaturalLanguage");
    }
}

export async function external_showAIDivNaturalLanguage2(
    selectedSection, naturalLanguageInput, food_plan_id
) {
    for (const food of naturalLanguageFoods) {
        await fetch('http://127.0.0.1:8000/api/v1/data/food-plan-item/create/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({
                eaten: true,
                quantity_in_grams: food.quantity,
                food_plan: food_plan_id,
                food_item: food.matched_food_item.id,
                food_section: selectedSection
            })
        });
    }

    location.reload();
}

let imageFoods = null;

export async function external_showAIDivImage1(
    selectedSection, imageInput
) {
    if(selectedSection !== "") {
        if(imageInput !== null) {
            document.getElementById("addImage1").style.display = "none";

            const aiBox = document.getElementById("ai-box-i");
            const aiContent = document.getElementById("ai-content-i");

            aiBox.classList.remove("hidden");
            setTimeout(() => aiBox.classList.add("visible"), 10); // per attivare la transizione

            const formData = new FormData();
            formData.append("image", imageInput);

            const responseAnalysis = await fetch("http://127.0.0.1:8000/api/v1/data/food-plan/food-image-parsing/", {
                method: "POST",
                headers: {
                    "Authorization": "Token " + getCookie('csrftoken')
                },
                body: formData
            });

            if(responseAnalysis.ok) {
                aiContent.classList.remove("ai-loader");
                aiContent.classList.add("ai-response");

                const data = await responseAnalysis.json();
                imageFoods = data.meals;

                const conditionMealsEmpty = (
                    data.meals.length === 1 &&
                    data.meals[0].matched_food_item?.id === null
                );
                if(!conditionMealsEmpty) {
                    document.getElementById("addImage2").style.display = "block";

                    data.meals.forEach(meal => {
                        const card = document.createElement("div");
                        card.style.border = "1px solid #ccc";
                        card.style.borderRadius = "10px";
                        card.style.padding = "15px";
                        card.style.marginBottom = "10px";
                        card.style.backgroundColor = "#f9f9f9";
                        card.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.1)";

                        const mealTitle = document.createElement("h3");
                        mealTitle.textContent = meal.matched_food_item.name;

                        const quantity = document.createElement("p");
                        quantity.innerHTML = `<strong>Quantità:</strong> ${meal.quantity}g`;

                        card.appendChild(mealTitle);
                        card.appendChild(quantity);

                        aiContent.appendChild(card);
                    });
                } else {
                    aiBox.classList.add("hidden");
                    aiContent.classList.add("ai-loader");
                    aiContent.classList.remove("ai-response");
                    document.getElementById("addNaturalLanguage1").style.display = "block";
                    showMessage("Non hai inserito una immagine valida, inserisci una descrizione in cui spieghi cosa hai mangiato!", "errorImage");
                }
            } else {
                showMessage("Problemi di comunicazione con la IA!", "errorImage");
            }
        } else {
            showMessage("Immagine non inserita!", "errorImage");
        }
    } else {
        showMessage("Sezione non inserita!", "errorImage");
    }
}

export async function external_showAIDivImage2(
    selectedSection, imageInput, food_plan_id
) {
    for (const food of imageFoods) {
        await fetch('http://127.0.0.1:8000/api/v1/data/food-plan-item/create/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({
                eaten: true,
                quantity_in_grams: food.quantity,
                food_plan: food_plan_id,
                food_item: food.matched_food_item.id,
                food_section: selectedSection
            })
        });
    }

    location.reload();
}

export async function external_optimizeQuantity(
    food_plan_id
) {
    document.getElementById("loading-overlay").style.display = "flex";

    const responseOptimize =
        await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan/optimize-grams/${food_plan_id}/`, {
        method: "GET",
        headers: {
            "Authorization": "Token " + getCookie('csrftoken')
        }
    });

    if(responseOptimize.ok) location.reload();
}

export async function external_showAIGenerateFoodPlan(
    food_plan_id
){
    document.getElementById("loading-overlay").style.display = "flex";

    const responseGenerate =
        await fetch(
            `http://127.0.0.1:8000/api/v1/data/food-plan/generate/${food_plan_id}/`, {
        method: "GET",
        headers: {
            "Authorization": "Token " + getCookie('csrftoken')
        }
    });

    if(responseGenerate.ok) location.reload();
}

export async function external_showAIGenerateAlternative(
    food_plan_id, selectedSection
){
    const responseGenerate =
        await fetch(
            "http://127.0.0.1:8000/api/v1/data/food-plan/generate-alternative-section/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken')
                },
                body: JSON.stringify({
                    food_plan_id: food_plan_id,
                    section_id: selectedSection
                })
            });

    if(responseGenerate.ok) location.reload();
}

export async function export_saveFoodPlan(
    food_plan_id
){
    // Effettua una richiesta PATCH al backend per aggiornare un piano alimentare esistente
    const response = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan/update/${food_plan_id}/`, {
        method: "PATCH", // Metodo HTTP per aggiornare solo i campi specificati
        headers: {
            "Content-Type": "application/json", // Indica che il corpo della richiesta è in formato JSON
            "Authorization": "Token " + getCookie('csrftoken'), // Aggiunge il token CSRF per autenticazione
        },
        // Corpo della richiesta con i dati aggiornati da inviare al server
        body: JSON.stringify({
            start_date: document.getElementById("start_date").value, // Data di inizio del piano
            end_date: document.getElementById("end_date").value,     // Data di fine del piano
            max_kcal: document.querySelector(".max_kcal_value")?.value,     // Valore massimo di kcal
            max_protein: document.querySelector(".max_protein_value")?.value, // Valore massimo di proteine
            max_carbs: document.querySelector(".max_carbs_value")?.value,     // Valore massimo di carboidrati
            max_fats: document.querySelector(".max_fats_value")?.value        // Valore massimo di grassi
        })
    });

    // Se la risposta è positiva (2xx), reindirizza alla pagina dei programmi alimentari
    if (response.ok) location.href = "/account/food-programs/";
    // Altrimenti mostra un messaggio di errore all'utente
    else showMessage("Errore durante il salvataggio della scheda alimentare!");
}

export function external_renderFoodPlanTable(
    content, table, total_grams
) {
    content.forEach(item => {
        if (item.type === "section") {
            // Inserisce una riga separatrice tra le sezioni
            const rowSeparator = table.insertRow();
            rowSeparator.classList.add("separator-row");

            // Inserisce una riga con il nome del pasto/sezione
            const newFoodPlanSection = table.insertRow();
            newFoodPlanSection.classList.add("meal-name");

            const cell = newFoodPlanSection.insertCell(0);
            cell.textContent = `${item.item.name} (orario previsto ${item.item.start_time})`;
            cell.colSpan = 10;
        } else if (item.type === "food-item") {
            // Crea una riga per ogni alimento
            const newFoodItem = table.insertRow();
            newFoodItem.id = item.food_plan_item.id;

            // Cella per l’icona elimina (trash)
            const cell1 = newFoodItem.insertCell(0);
            cell1.classList.add("delete-column");

            const trashIcon = document.createElement("span");
            trashIcon.classList.add("material-icons");
            trashIcon.textContent = "delete";
            trashIcon.style.cursor = "pointer";
            trashIcon.style.fontSize = "24px";
            trashIcon.style.color = "red";

            // Gestione click sull’icona di eliminazione alimento
            trashIcon.addEventListener("click", async function () {
                const response = await fetch('http://127.0.0.1:8000/api/v1/data/food-plan-item/delete/' + item.food_plan_item.id + '/', {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + getCookie('csrftoken'),
                    }
                });

                if (response.ok) {
                    newFoodItem.remove();

                    // Evidenzia la riga totale
                    const el2 = document.getElementById("totalValueRow");
                    el2.classList.add("highlight");
                    setTimeout(() => el2.classList.remove("highlight"), 1000);

                    // Ricalcola tutti i valori nutrizionali totali
                    const righeValide = document.querySelectorAll("tr:not(.meal-name):not(.separator-row):not(#detailsFoodPlanMobile):not(#totalValueRow)");
                    const totalRiga = document.getElementById("totalValueRow");
                    const totalCelle = totalRiga.getElementsByTagName("td");

                    for (let i = 1; i <= 7; i++) totalCelle[i].textContent = 0;

                    righeValide.forEach(riga => {
                        const celle = [...riga.querySelectorAll("td")];
                        celle.forEach((cella, index) => {
                            if (index >= 3 && index <= 9) {
                                const val = parseFloat(cella.textContent.replace("g", ""));
                                totalCelle[index - 2].textContent = parseFloat(totalCelle[index - 2].textContent) + val;
                            }
                        });
                    });

                    // Arrotonda e formatta i valori
                    for (let i = 1; i <= 7; i++) {
                        totalCelle[i].textContent = parseFloat(totalCelle[i].textContent).toFixed(1) + (i > 1 ? "g" : "");
                    }

                    // Aggiorna le variabili globali
                    total_grams.kcal = totalCelle[1].textContent;
                    total_grams.protein = totalCelle[2].textContent;
                    total_grams.carboids = totalCelle[3].textContent;
                    total_grams.sugar = totalCelle[4].textContent;
                    total_grams.fats = totalCelle[5].textContent;
                    total_grams.satured_fats = totalCelle[6].textContent;
                    total_grams.fiber = totalCelle[7].textContent;

                    updateGraphicsLimits();
                } else {
                    // Mostra errore se la DELETE fallisce
                    const errorBox = document.getElementById("error1");
                    errorBox.style.display = "block";
                    errorBox.firstChild.textContent = "Errore durante l'eliminazione dell'alimento dalla scheda alimentare!";
                    setTimeout(() => {
                        errorBox.style.display = "none";
                        errorBox.firstChild.textContent = "";
                    }, 5000);
                }
            });

            cell1.appendChild(trashIcon);

            // Cella con il nome e brand dell’alimento
            const cell2 = newFoodItem.insertCell(1);
            cell2.classList.add("name-column");
            cell2.textContent = item.food_item.brand
                ? `${item.food_item.name} (${item.food_item.brand})`
                : item.food_item.name;

            // Cella con input per i grammi
            const cell3 = newFoodItem.insertCell(2);
            cell3.classList.add("grams-column");
            cell3.setAttribute("data-label", item.food_item.name);

            const inputGrams = document.createElement("input");
            inputGrams.type = "number";
            inputGrams.value = item.food_plan_item.quantity_in_grams;
            inputGrams.style.cssText = `
                    text-align: center;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 4px;
                    font-size: 18px;
                `;

            // Aggiornamento dei valori al cambio quantità
            inputGrams.addEventListener("input", async function () {
                const newQuantity = parseInt(inputGrams.value, 10);

                // PATCH della quantità aggiornata
                let response = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan-item/update/${item.food_plan_item.id}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + getCookie('csrftoken'),
                    },
                    body: JSON.stringify({
                        id: item.food_plan_item.id,
                        quantity_in_grams: newQuantity,
                    })
                });

                let updatedItem = await response.json();

                // Rifetch dell’alimento aggiornato
                response = await fetch(`http://127.0.0.1:8000/api/v1/data/food-item/${updatedItem.food_item}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + getCookie('csrftoken'),
                    }
                });

                updatedItem = await response.json();

                const riga = document.getElementById(item.food_plan_item.id);
                const celle = riga.getElementsByTagName("td");
                const moltiplicatore = newQuantity / 100;

                // Aggiorna i valori nella riga
                celle[3].textContent = (updatedItem.kcal_per_100g * moltiplicatore).toFixed(1);
                celle[4].textContent = (updatedItem.protein_per_100g * moltiplicatore).toFixed(1) + "g";
                celle[5].textContent = (updatedItem.carbs_per_100g * moltiplicatore).toFixed(1) + "g";
                celle[6].textContent = (updatedItem.sugars_per_100g * moltiplicatore).toFixed(1) + "g";
                celle[7].textContent = (updatedItem.fats_per_100g * moltiplicatore).toFixed(1) + "g";
                celle[8].textContent = (updatedItem.saturated_fats_per_100g * moltiplicatore).toFixed(1) + "g";
                celle[9].textContent = (updatedItem.fiber_per_100g * moltiplicatore).toFixed(1) + "g";

                // Evidenzia aggiornamento
                riga.classList.add("highlight");
                setTimeout(() => riga.classList.remove("highlight"), 1000);

                const el2 = document.getElementById("totalValueRow");
                el2.classList.add("highlight");
                setTimeout(() => el2.classList.remove("highlight"), 1000);

                // Ricalcola i totali
                const righeValide = document.querySelectorAll("tr:not(.meal-name):not(.separator-row):not(#detailsFoodPlanMobile):not(#totalValueRow)");
                const totalRiga = document.getElementById("totalValueRow");
                const totalCelle = totalRiga.getElementsByTagName("td");

                for (let i = 1; i <= 7; i++) totalCelle[i].textContent = 0;

                righeValide.forEach(riga => {
                    const celle = [...riga.querySelectorAll("td")];
                    celle.forEach((cella, index) => {
                        if (index >= 3 && index <= 9) {
                            const val = parseFloat(cella.textContent.replace("g", ""));
                            totalCelle[index - 2].textContent = parseFloat(totalCelle[index - 2].textContent) + val;
                        }
                    });
                });

                for (let i = 1; i <= 7; i++) {
                    totalCelle[i].textContent = parseFloat(totalCelle[i].textContent).toFixed(1) + (i > 1 ? "g" : "");
                }

                // Aggiorna variabili globali
                total_grams.kcal = parseFloat(totalCelle[1].textContent);
                total_grams.protein = parseFloat(totalCelle[2].textContent);
                total_grams.carboids = parseFloat(totalCelle[3].textContent);
                total_grams.sugar = parseFloat(totalCelle[4].textContent);
                total_grams.fats = parseFloat(totalCelle[5].textContent);
                total_grams.satured_fats = parseFloat(totalCelle[6].textContent);
                total_grams.fiber = parseFloat(totalCelle[7].textContent);

                updateGraphicsLimits();
            });

            cell3.appendChild(inputGrams);

            // Crea celle con i valori nutrizionali (kcal, proteine, ecc.)
            const moltiplicatore = item.food_plan_item.quantity_in_grams / 100;

            const creaCella = (val, className, label, isGrammi = true) => {
                const cell = newFoodItem.insertCell();
                cell.classList.add(className);
                cell.setAttribute("data-label", label);
                cell.textContent = (val * moltiplicatore).toFixed(1) + (isGrammi ? "g" : "");
                return val * moltiplicatore;
            };

            total_grams.kcal += creaCella(item.food_item.kcal_per_100g, "kcal_column", "Kcal:", false);
            total_grams.protein += creaCella(item.food_item.protein_per_100g, "protein_column", "Proteine:");
            total_grams.carboids += creaCella(item.food_item.carbs_per_100g, "carbs_column", "Carboidrati:");
            total_grams.sugar += creaCella(item.food_item.sugars_per_100g, "sugars_column", "Zuccheri:");
            total_grams.fats += creaCella(item.food_item.fats_per_100g, "fats_column", "Grassi:");
            total_grams.satured_fats += creaCella(item.food_item.saturated_fats_per_100g, "satured_fats_column", "Grassi Saturi:");
            total_grams.fiber += creaCella(item.food_item.fiber_per_100g, "fiber_column", "Fibre:");
        }
    });
}

export function external_renderTotalRow(
    table, total_grams
) {
    // Inserisce una riga vuota come separatore visivo tra sezioni/alimenti e i totali
    const rowSeparator = table.insertRow();
    rowSeparator.classList.add("separator-row");

    // Crea la riga finale con i totali dei valori nutrizionali
    const totalValueRow = table.insertRow();
    totalValueRow.classList.add("total-name");
    totalValueRow.id = "totalValueRow";

    // Prima cella: titolo descrittivo della riga
    const cell1 = totalValueRow.insertCell(0);
    cell1.innerHTML = "<b>Somma dei valori degli alimenti</b>";
    cell1.colSpan = 3; // Occupa le colonne di: elimina, nome alimento, grammi

    // Colonna Kcal totale
    const cell2 = totalValueRow.insertCell(1);
    cell2.classList.add("kcal_column");
    cell2.setAttribute("data-label", "Kcal:");
    cell2.textContent = total_grams.kcal.toFixed(1); // Nessuna "g" perché sono kcal

    // Colonna Proteine totali
    const cell3 = totalValueRow.insertCell(2);
    cell3.classList.add("protein_column");
    cell3.setAttribute("data-label", "Proteine:");
    cell3.textContent = total_grams.protein.toFixed(1) + "g";

    // Colonna Carboidrati totali
    const cell4 = totalValueRow.insertCell(3);
    cell4.classList.add("carbs_column");
    cell4.setAttribute("data-label", "Carboidrati:");
    cell4.textContent = total_grams.carboids.toFixed(1) + "g";

    // Colonna Zuccheri totali
    const cell5 = totalValueRow.insertCell(4);
    cell5.classList.add("sugars_column");
    cell5.setAttribute("data-label", "Zuccheri:");
    cell5.textContent = total_grams.sugar.toFixed(1) + "g";

    // Colonna Grassi totali
    const cell6 = totalValueRow.insertCell(5);
    cell6.classList.add("fats_column");
    cell6.setAttribute("data-label", "Grassi:");
    cell6.textContent = total_grams.fats.toFixed(1) + "g";

    // Colonna Grassi Saturi totali
    const cell7 = totalValueRow.insertCell(6);
    cell7.classList.add("satured_fats_column");
    cell7.setAttribute("data-label", "Grassi Saturi:");
    cell7.textContent = total_grams.satured_fats.toFixed(1) + "g";

    // Colonna Fibre totali
    const cell8 = totalValueRow.insertCell(7);
    cell8.classList.add("fiber_column");
    cell8.setAttribute("data-label", "Fibre:");
    cell8.textContent = total_grams.fiber.toFixed(1) + "g";
}