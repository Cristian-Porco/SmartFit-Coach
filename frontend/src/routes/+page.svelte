<head>
    <link rel="stylesheet" type="text/css" href="/css/style_home.css">
</head>

<!-- Sezione Home -->
<section class="section home" id="home">
    <h1>Tieni traccia dei tuoi progressi con il nostro gestionale!</h1>
</section>

<!-- Sezione Chi Siamo -->
<section class="section chi-siamo" id="chi-siamo">
    <h1>Chi siamo</h1>
    <p>Il nostro gestionale di palestra è una piattaforma pensata per aiutarti a monitorare il tuo percorso fitness. Con il nostro strumento, potrai gestire lo storico del tuo peso, monitorare le misure corporee, creare schede alimentari personalizzate e seguire il tuo programma di allenamento.</p>
</section>

<section class="section contatti" id="contatti">
    <h2>Contattaci</h2>
    <p>Telefono: +39 123 456 789</p>
    <p>Email: info@gm-palestra.com</p>
</section>

<script>
    import {onMount} from "svelte";
    import {getCookie} from "svelte-cookie";

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
    });
</script>