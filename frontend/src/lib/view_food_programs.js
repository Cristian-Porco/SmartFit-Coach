import { getCookie } from "svelte-cookie";

let food_plan = {};
let food_items = [];
let content = [];

// Funzione principale per caricare il piano alimentare
export async function external_onMount(food_plan_id) {
    // Fetch principale del piano alimentare
    const planRes = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan/${food_plan_id}/`, {
        headers: authHeaders()
    });
    const plan = await planRes.json();
    food_plan = plan;
    food_items = plan.food_items;

    // Popola intestazioni
    setText("start_date", plan.start_date);
    setText("end_date", plan.end_date);
    setText("max_kcal", plan.max_kcal);
    setText("max_protein", plan.max_protein + "g");
    setText("max_carbs", plan.max_carbs + "g");
    setText("max_fats", plan.max_fats + "g");

    const table = document.getElementById("containerFoodPlan");
    insertPlanDetailsRow(table, plan);

    // Raggruppamento alimenti per sezione
    const grouped = groupBySection(food_items);
    const sectionIDs = Object.keys(grouped);

    // Fetch sezioni in parallelo
    const sections = await Promise.all(sectionIDs.map(fetchSection));
    sections.sort((a, b) => a.start_time - b.start_time);

    // Crea struttura contenuto con sezioni e alimenti
    for (const section of sections) {
        content.push({ type: "section", item: section });
        for (const item of grouped[section.id]) {
            content.push({ type: "food-item", food_plan_item: item, food_item: {} });
        }
    }

    // Fetch alimenti in parallelo
    await Promise.all(content.filter(i => i.type === "food-item").map(fetchFoodItem));

    // Rendering tabella
    renderFoodPlanTable(table, content);
}

// Headers con token
function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Token " + getCookie("csrftoken"),
    };
}

// Imposta testo in un elemento
function setText(id, value) {
    document.getElementById(id).innerText = value;
}

// Inserisce la riga dei dettagli mobile
function insertPlanDetailsRow(table, plan) {
    const row = table.insertRow();
    row.id = "detailsFoodPlanMobile";
    [
        { label: "Max Kcal:", value: plan.max_kcal },
        { label: "Max Proteine:", value: plan.max_protein + "g" },
        { label: "Max Carboidrati:", value: plan.max_carbs + "g" },
        { label: "Max Grassi:", value: plan.max_fats + "g" }
    ].forEach(item => {
        const cell = row.insertCell();
        cell.setAttribute("data-label", item.label);
        cell.textContent = item.value;
    });
}

// Raggruppa alimenti per id sezione
function groupBySection(items) {
    return items.reduce((acc, item) => {
        acc[item.food_section] = acc[item.food_section] || [];
        acc[item.food_section].push(item);
        return acc;
    }, {});
}

// Fetch di una sezione
async function fetchSection(id) {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan-section/${id}/`, {
        headers: authHeaders()
    });
    return res.json();
}

// Fetch di un alimento
async function fetchFoodItem(entry) {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/data/food-item/${entry.food_plan_item.food_item}/`, {
        headers: authHeaders()
    });
    entry.food_item = await res.json();
}

// Rendering dinamico della tabella
function renderFoodPlanTable(table, content) {
    const total = {
        kcal: 0, protein: 0, carboids: 0, sugar: 0,
        fats: 0, satured_fats: 0, fiber: 0
    };

    content.forEach(item => {
        if (item.type === "section") {
            // Riga separatore e intestazione sezione
            table.insertRow().classList.add("separator-row");
            const row = table.insertRow();
            row.classList.add("meal-name");
            const cell = row.insertCell(0);
            cell.colSpan = 10;
            cell.textContent = `${item.item.name} (orario previsto ${item.item.start_time})`;
        } else {
            const food = item.food_item;
            const planItem = item.food_plan_item;
            const row = table.insertRow();
            row.id = planItem.id;

            // Checkbox eaten
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = planItem.eaten;
            checkbox.id = "check" + planItem.id;
            checkbox.addEventListener("change", () => toggleEaten(planItem, row));
            row.insertCell().appendChild(checkbox);

            if (planItem.eaten) row.style.background = "#89c3ff";

            // Nome alimento
            const name = food.brand ? `${food.name} (${food.brand})` : food.name;
            row.insertCell().classList.add("name-column");
            row.cells[1].textContent = name;

            // Quantità e valori nutrizionali
            const qty = planItem.quantity_in_grams;
            const ratio = qty / 100;
            row.insertCell().classList.add("grams-column");
            row.cells[2].textContent = qty + "g";
            addCell(row, "Kcal:", food.kcal_per_100g * ratio); total.kcal += food.kcal_per_100g * ratio;
            addCell(row, "Proteine:", food.protein_per_100g * ratio, "g"); total.protein += food.protein_per_100g * ratio;
            addCell(row, "Carboidrati:", food.carbs_per_100g * ratio, "g"); total.carboids += food.carbs_per_100g * ratio;
            addCell(row, "Zuccheri:", food.sugars_per_100g * ratio, "g"); total.sugar += food.sugars_per_100g * ratio;
            addCell(row, "Grassi:", food.fats_per_100g * ratio, "g"); total.fats += food.fats_per_100g * ratio;
            addCell(row, "Grassi Saturi:", food.saturated_fats_per_100g * ratio, "g"); total.satured_fats += food.saturated_fats_per_100g * ratio;
            addCell(row, "Fibre:", food.fiber_per_100g * ratio, "g"); total.fiber += food.fiber_per_100g * ratio;
        }
    });

    // Totali finali
    table.insertRow().classList.add("separator-row");
    const totalRow = table.insertRow();
    totalRow.classList.add("total-name");
    totalRow.id = "totalValueRow";
    const title = totalRow.insertCell(0);
    title.colSpan = 3;
    title.innerHTML = "<b>Somma dei valori degli alimenti</b>";
    ["kcal", "protein", "carboids", "sugar", "fats", "satured_fats", "fiber"].forEach(key => {
        const cell = totalRow.insertCell();
        cell.setAttribute("data-label", key.charAt(0).toUpperCase() + key.slice(1) + ":");
        cell.textContent = key === "kcal" ? total[key] : total[key].toFixed(1) + "g";
    });
}

// Aggiunge cella con etichetta e valore
function addCell(row, label, value, unit = "") {
    const cell = row.insertCell();
    cell.setAttribute("data-label", label);
    cell.textContent = (typeof value === "number" ? value.toFixed(1) : value) + unit;
}

// Aggiorna stato "eaten"
async function toggleEaten(item, row) {
    item.eaten = !item.eaten;
    row.style.background = item.eaten ? "#89c3ff" : "";

    await fetch(`http://127.0.0.1:8000/api/v1/data/food-plan-item/update/${item.id}/`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ eaten: item.eaten })
    });
}
