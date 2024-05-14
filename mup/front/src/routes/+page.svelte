<script>
    import flag_pattern_img from '$lib/assets/flag-pattern.png';
    import grb_srbije_img from '$lib/assets/grb-srbije.png';
    import keycloak_json from '$lib/keycloak.json';

    import Keycloak from 'keycloak-js';

    import { onMount } from "svelte";

    let keycloak;

    $: stage = 'pocetna'; //pocetna, izrada, uvid, podnosenje, obrada
    const port = '5173'
    onMount(_ => {
        try {
            keycloak = new Keycloak(keycloak_json);
            keycloak.init({ onLoad: "check-sso", checkLoginIframe: false, redirectUri: `http://localhost:${port}/`})
                .then(_ => {
                    keycloak.loadUserInfo();
                    keycloak = keycloak;
                    console.log(keycloak);
                })
                .catch(error => {
                    console.log('caught error: ', error);
                })
        } catch (error) {
            console.log('error: ', error);
        }

        let url = new URLSearchParams(window.location.search);
        let newStage = url.has('stage');
        console.log('newStage: ', newStage);
        if(newStage) {
            stage = url.get('stage');
        }
    });
    function changeStage(event) {
        console.log('auth: ', keycloak?.authenticated, ' stage: ', stage !== 'pocetna')
        if(!keycloak?.authenticated && event.currentTarget.dataset.stage !== 'pocetna')
            keycloak.login({ redirectUri: `http://localhost:${port}/?stage=${event.currentTarget.dataset.stage}`});
        else
            stage = event.currentTarget.dataset.stage;
    }
</script>

<div class='redirect_nav'>
    <a>Tuzilastvo</a>
    <a>Sudstvo</a>
    <a>Pogranicna policija</a>
</div>

<div style='background: url({flag_pattern_img}) #fff; height: 38px;'></div>

<div class="header">
    <img src="{grb_srbije_img}" alt="grb" style="margin-right: 15px;">
    <div class="header-link" style="flex-grow: 2;">
        <span style="font-weight: 300; padding-top: 40px; margin-top: 2px; margin-bottom: 2px;">Република Србија</span>
        <span style="font-weight: bold; margin-top: 2px;">Министарство унутрашњих послова</span>
    </div>
    {#if keycloak?.authenticated}
        <div style="height: 100%; flex-flow: column-reverse nowrap; align-content: flex-end;">
            <div style="color: gray; font-style: italic;">Dobrodosli,</div>
            <div style="color: black; font-size: large">{keycloak.tokenParsed.family_name} {keycloak.tokenParsed.given_name}</div>
        </div>
    {/if}
</div>

<div id="nav_bar" style="display: flex; justify-content: center; border: 2px solid lightgray; padding: 0 20px;">
    <div class="dropdown">
        <button class="drop_btn" data-stage="pocetna" on:click={changeStage} >Pocetna</button>
    </div>

    <div class="dropdown">
        <button class="drop_btn">Dokumenti</button>
        <div class="drop_content">
            <button data-stage="izrada" on:click={changeStage}>Izrada licnih dokumenata</button>
            <button data-stage="uvid" on:click={changeStage}>Uvid u nekaznjavanje</button>
        </div>
    </div>

    <div class="dropdown">
        <button data-stage="podnosenje" on:click={changeStage} class="drop_btn">Podnosenje prijave</button>
    </div>

    {#if keycloak?.authenticated && keycloak?.resourceAccess.mup.roles.includes('mup_zaposleni')}
        <div class="dropdown">
            <button data-stage="obrada" on:click={changeStage} class="drop_btn">Obrada</button>
        </div>
    {/if}

    <div class="dropdown" style="margin-left: auto;">
        {#if keycloak?.authenticated}
            <button class="drop_btn" on:click={keycloak.logout}>Odjava</button>
        {:else }
            <button class="drop_btn" on:click={keycloak.login}>Prijava</button>
        {/if}
    </div>
</div>

<div style="width: 100%;">
    <div style="width: 60%; margin: 0 auto;">
        <!-- Content -->
        {#if stage === 'pocetna' }
            <h2 style="color: #c7363d;">Надлежност</h2>
            <p>У Републици Србији послове државне управе утврђене законом и прописима донетим на основу закона обављају министарства. Она примењују законе и друге прописе и опште акте Народне скупштине и Владе Србије, као и опште акте председника Републике; решавају у управним стварима; врше управни надзор над обављањем поверених послова и др.</p>

            <p>Унутрашњи послови су законом утврђени послови чијим обављањем надлежни републички органи остварују безбедност Републике и њених грађана и обезбеђују остваривање њихових Уставом и законом утврђених права.</p>

            <p>Унутрашње послове државне управе обавља Министарство унутрашњих послова.</p>

            <p>Унутрашњи послови обављају се на начин којим се сваком човеку и грађанину обезбеђује једнака заштита и остваривање његових Уставом утврђених слобода и права.</p>

            <p>У обављању унутрашњих послова могу се примењивати само мере принуде које су предвиђене законом и којима се са најмање штетних последица по грађане, као и њихове организације, предузећа, установе и друге организације, постиже извршење послова.</p>
            {:else if stage === 'izrada' }
            <div>Test izrada</div>
        {/if}
    </div>
</div>

<style>
    .header {
        display: flex;
        flex-direction: row;
        height: 140px;
        padding: 15px;
    }

    .header span {
        font-size: 1.6em;
    }

    .header:hover span {
        color: #00466D;
    }

    .header-link {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .header-link span:hover {
        cursor: pointer;
        text-decoration: none;
    }

    #nav_bar div:first-child {
        margin-left: auto;
    }

    /* Dropdown Button */
    .drop_btn {
        background-color: #fff;
        color: black;
        padding: 16px;
        font-size: 16px;
        outline: 2px solid lightgray;
        margin: 0;
    }

    /* The container <div> - needed to position the dropdown content */
    .dropdown {
        position: relative;
        display: inline-block;
    }

    /* Dropdown Content (Hidden by Default) */
    .drop_content {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 160px;
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        z-index: 1;
    }

    /* Links inside the dropdown */
    .drop_content button {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        border: 1px solid lightgray;
    }

    /* Change color of dropdown links on hover */
    .drop_content button:hover {
        color: white;
        background-color: dimgray;
        cursor: pointer;
    }

    /* Show the dropdown menu on hover */
    .dropdown:hover .drop_content {display: block;}

    /* Change the background color of the dropdown button when the dropdown content is shown */
    .dropdown:hover .drop_btn {
        color: white;
        background-color: darkgray;
    }

    .redirect_nav {
        padding: 10px 20px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        gap: 12px;
    }

    .redirect_nav a {
        font-size: small;
        font-weight: bold;
    }

    .redirect_nav a:hover {
        cursor: pointer;
        color: black;
    }
</style>