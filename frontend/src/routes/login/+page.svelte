<head>
    <link rel="stylesheet" type="text/css" href="/css/login/style_login.css">
</head>

{#if isLoading}
    <div class="loader-container" transition:fade={{ duration: 200 }}>
        <div class="spinner"></div>
    </div>
{/if}

<!-- Layout pagina login -->
<div class="login-page">
    <div class="login-container">
        <h2>Accedi</h2>

        <!-- Form login -->
        <form class="form-container" on:submit={login}>
            <!-- Messaggio di errore (inizialmente nascosto tramite CSS) -->
            <div class="form-group">
                <div class="error" id="error">
                    <p>Credenziali non valide!</p>
                </div>
            </div>

            <!-- Input username/email -->
            <div class="form-group">
                <input
                        type="text"
                        bind:value={email}
                        id="email"
                        name="email"
                        placeholder="Username..."
                        required
                />
            </div>

            <!-- Input password -->
            <div class="form-group">
                <input
                        type="password"
                        bind:value={password}
                        id="password"
                        name="password"
                        placeholder="Password..."
                        required
                />
            </div>

            <!-- Bottone submit -->
            <div class="form-group">
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
</div>

<script>
    import { onMount } from "svelte";
    import { getCookie, setCookie } from 'svelte-cookie';
    import { fade } from 'svelte/transition';

    let isLoading = true;

    let email = "";
    let password = "";

    // Se già autenticato, reindirizza l'utente
    onMount(() => {
        if (getCookie('csrftoken')) {
            window.location.href = "/account";
        }

        isLoading = false;
    });

    // Login utente: invio credenziali, gestione token e profilo
    async function login(event) {
        event.preventDefault(); // evita reload

        try {
            // Richiesta POST per login
            const response1 = await fetch("http://127.0.0.1:8000/api/v1/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password: password })
            });

            if (!response1.ok) throw new Error("Login failed");

            // Salva il token ricevuto
            const { key } = await response1.json();
            setCookie("csrftoken", key);

            // Recupera i dati dell'utente autenticato
            const response2 = await fetch("http://127.0.0.1:8000/api/v1/auth/user/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${key}`
                }
            });

            if (!response2.ok) throw new Error("User fetch failed");

            const { pk, username } = await response2.json();

            // Salva dati in cookie
            setCookie("pk", pk);
            setCookie("username", username);

            // Redirect su pagina account
            window.location.href = "/account";

        } catch (err) {
            // In caso di errore mostra errore
            document.getElementById("error").style.display = "block";
        }
    }
</script>