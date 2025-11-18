<head>
    <link rel="stylesheet" type="text/css" href="/css/signup/style_signup.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<div id="container">
    <div class="step active" data-step="0">
        <div class="title-presentation">
            <h1>Ciao!</h1>
            <h3>Benvenuto su SmartFit Coach</h3>
        </div>
        <p>Sarò il tuo assistente nella configurazione dell'account. Inserisci username, email e password, poi segui le ulteriori istruzioni per personalizzare la tua esperienza su SmartFit Coach.</p>
        <button on:click={nextStep}>Cominciamo subito</button>
    </div>

    <div class="step" data-step="1">
        <label>Username:</label>
        <div class="error" id="error1">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="text" id="username" placeholder="Inserisci l'username...">
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="2">
        <label>Email:</label>
        <div class="error" id="error2">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="email" id="email" placeholder="Inserisci l'email...">
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="3">
        <label>Password:</label>
        <div class="error" id="error3">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="password" id="password1" placeholder="Inserisci la password...">
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="4">
        <label>Conferma Password:</label>
        <div class="error" id="error4">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="password" id="password2" placeholder="Conferma la password...">
        <button on:click={register1}>Registrati</button>
    </div>

    <div class="step" data-step="5">
        <div class="title-presentation">
            <h3>Registrazione completata con successo!</h3>
            <p>Ora procediamo nell'inserimento di altri dettagli su di te.</p>
        </div>
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="6">
        <label>Qual'è il tuo nome?</label>
        <div class="error" id="error6">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="text" id="name" placeholder="Inserisci il nome...">
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="7">
        <label>Qual'è il tuo cognome?</label>
        <div class="error" id="error7">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="text" id="surname" placeholder="Inserisci il cognome...">
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="8">
        <label>Qual'è la tua data di nascita?</label>
        <div class="error" id="error8">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="date" id="date_of_birth">
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="9">
        <label>Qual'è il tuo sesso biologico?</label>
        <div class="error" id="error9">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <select id="biological_gender" name="gender">
            <option value="M">Maschio</option>
            <option value="F">Femmina</option>
        </select>
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="10">
        <label>Qual'è la tua altezza (in cm)?</label>
        <div class="error" id="error10">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <input type="number" id="height" placeholder="Inserisci l'altezza...">
        <button on:click={register2}>Avanti</button>
    </div>

    <div class="step" data-step="11">
        <div class="title-presentation">
            <h3>Dettagli aggiunti!</h3>
            <p>Ora procediamo nell'inserimento dell'obiettivo di questo percorso.</p>
        </div>
        <button on:click={nextStep}>Avanti</button>
    </div>

    <div class="step" data-step="12">
        <label>Qual'è il tuo obiettivo?</label>
        <div class="error" id="error12">
            <p></p> <!-- Il testo dell'errore viene inserito dinamicamente -->
        </div>
        <textarea id="goals" placeholder="Inserisci il tuo obiettivo in poche parole..." />
        <button on:click={register3}>Avanti</button>
    </div>

    <div class="step" data-step="13">
        <div class="title-presentation">
            <h3>Dettagli aggiunti!</h3>
            <p>Ora procediamo nell'inserimento dell'obiettivo di questo percorso.</p>
        </div>
        <button on:click={register4}>Avanti</button>
    </div>
</div>

<script>
    import { getCookie, setCookie } from 'svelte-cookie';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    let isLoading = true; // Caricamento iniziale
    let currentStep = 0;  // Step iniziale

    onMount(() => {
        const setWidth100 = (id) => {
            const el = document.getElementById(id);
            if (el?.firstElementChild) {
                el.firstElementChild.style.width = "100%";
            }
        };

        ["account-icon", "login-icon", "signup-icon"].forEach(setWidth100);

        const isLoggedIn = getCookie("csrftoken") !== "";
        const displayMap = {
            "account-icon": isLoggedIn ? "flex" : "none",
            "login-icon": isLoggedIn ? "none" : "flex",
            "signup-icon": isLoggedIn ? "none" : "flex"
        };

        for (const [id, display] of Object.entries(displayMap)) {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = display;
            }
        }

        // Se già autenticato, reindirizza
        if (getCookie('csrftoken') !== "") window.location.href = "/";
        isLoading = false;
    });

    // Passaggio al prossimo step
    function nextStep() {
        const steps = document.querySelectorAll('.step');
        steps[currentStep].classList.remove('active');
        currentStep++;
        steps[currentStep].classList.add('active');
    }

    // Utility asincrona per delay
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Registrazione utente base (step 1-4)
    async function register1() {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password1 = document.getElementById("password1").value;
        const password2 = document.getElementById("password2").value;

        const payload = { username, email, password1, password2 };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/auth/registration/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.key) {
                setCookie("csrftoken", data.key);
                nextStep();
            } else {
                showStepError(data);
            }
        } catch (err) {
            // Tentativo forzato di login
            await wait(2000);
            const responseLogin = await fetch("http://127.0.0.1:8000/api/v1/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password: password1 })
            });

            if (responseLogin.ok) {
                const dataLogin = await responseLogin.json();
                setCookie("csrftoken", dataLogin.key);
                nextStep();
            }
        }

        // Recupera info utente (PK, username)
        const responseDetails = await fetch("http://127.0.0.1:8000/api/v1/auth/user/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken')
            }
        });

        if (responseDetails.ok) {
            const data = await responseDetails.json();
            setCookie("pk", data.pk);
            setCookie("username", data.username);
        }
    }

    // Salva dettagli personali (step 6-10)
    async function register2() {
        const first_name = document.getElementById("name").value;
        const last_name = document.getElementById("surname").value;
        const date_of_birth = document.getElementById("date_of_birth").value;
        const biological_gender = document.getElementById("biological_gender").value;
        const height_cm = document.getElementById("height").value;

        const updateUser = await fetch("http://127.0.0.1:8000/api/v1/auth/user/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken'),
            },
            body: JSON.stringify({ first_name, last_name })
        });

        const data1 = await updateUser.json();

        if (updateUser.ok) {
            const updateDetails = await fetch("http://127.0.0.1:8000/api/v1/data/detailsaccount/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    author: getCookie("pk"),
                    date_of_birth,
                    biological_gender,
                    height_cm
                })
            });

            const data2 = await updateDetails.json();

            if (updateDetails.ok) nextStep();
            else showStepError(data2);
        } else {
            showStepError(data1);
        }
    }

    // Salva obiettivo (step 12)
    async function register3() {
        const goal_description = document.getElementById("goals").value;

        await fetch("http://127.0.0.1:8000/api/v1/data/detailsaccount/me/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + getCookie('csrftoken')
            },
            body: JSON.stringify({ goal_description })
        });

        nextStep();
    }

    // Reindirizza alla dashboard (step finale)
    function register4() {
        window.location.href = "/account";
    }

    // Visualizza errore specifico e torna allo step corrispondente
    function showStepError(data) {
        document.querySelectorAll('.step')[currentStep].classList.remove('active');

        if (data.username?.length) {
            currentStep = 1;
            showMessage(data.username[0], "error1");
        } else if (data.email?.length) {
            currentStep = 2;
            showMessage(data.email[0], "error2");
        } else if (data.password1?.length) {
            currentStep = 3;
            showMessage(data.password1[0], "error3");
        } else if (data.password2?.length) {
            currentStep = 4;
            showMessage(data.password2[0], "error4");
        } else if (data.first_name?.length) {
            currentStep = 6;
            showMessage(data.first_name[0], "error6");
        } else if (data.last_name?.length) {
            currentStep = 7;
            showMessage(data.last_name[0], "error7");
        } else if (data.date_of_birth?.length) {
            currentStep = 8;
            showMessage(data.date_of_birth[0], "error8");
        } else if (data.biological_gender?.length) {
            currentStep = 9;
            showMessage(data.biological_gender[0], "error9");
        } else if (data.height_cm?.length) {
            currentStep = 10;
            showMessage(data.height_cm[0], "error10");
        }

        document.querySelectorAll('.step')[currentStep].classList.add('active');
    }
</script>
