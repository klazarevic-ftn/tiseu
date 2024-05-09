<script>
    import Keycloak from 'keycloak-js';
    import {onMount} from "svelte";

    let keycloak;

    onMount(_ => {
        try {
            keycloak = new Keycloak({
                url: 'http://localhost:9000/',
                realm: 'tiseu',
                clientId: 'mup'
            });
            keycloak.init({ checkLoginIframe: false, redirectUri: 'http://0.0.0.0:5173/' });
        } catch (error) {
            console.log('error: ', error);
        }

        console.log('keycloak: ', JSON.stringify(keycloak));
    });
</script>

<div class='redirect_nav'>
    <a>Tuzilastvo</a>
    <a>Sudstvo</a>
    <a>Pogranicna policija</a>
</div>
<div class="mupFlagPattern"></div>

<div class="header">
    <img src="../build/src/grb-srbije.png" alt="grb" style="margin-right: 15px;">
    <div class="header-link">
        <a href='#' style="font-weight: 300;
    padding-top: 40px;
    margin-top: 2px;
    margin-bottom: 2px;">Република Србија</a>
        <a href='#' style="font-weight: bold;
    margin-top: 2px;">Министарство унутрашњих послова</a>
    </div>
</div>

<div style="display: flex; justify-content: center; border: 2px solid lightgray; padding: 0 20px;">
    <div class="dropdown" style="margin-left: auto;">
        <button class="dropbtn">Dokumenti</button>
        <div class="dropdown-content">
            <a href="#">Izrada licnih dokumenata</a>
            <a href="#">Uvid u nekaznjavanje</a>
        </div>
    </div>

    <div class="dropdown">
        <button class="dropbtn">Podnosenje prijave</button>
    </div>

    <div class="dropdown" style="margin-left: auto;">
        <button class="dropbtn" on:click={keycloak.login}>Prijava</button>
    </div>
</div>

<div style="width: 100%;">
    <div style="width: 60%; margin: 0 auto;">
        <h2 style="color: #c7363d;">Надлежност</h2>
        <p>У Републици Србији послове државне управе утврђене законом и прописима донетим на основу закона обављају министарства. Она примењују законе и друге прописе и опште акте Народне скупштине и Владе Србије, као и опште акте председника Републике; решавају у управним стварима; врше управни надзор над обављањем поверених послова и др.</p>

        <p>Унутрашњи послови су законом утврђени послови чијим обављањем надлежни републички органи остварују безбедност Републике и њених грађана и обезбеђују остваривање њихових Уставом и законом утврђених права.</p>

        <p>Унутрашње послове државне управе обавља Министарство унутрашњих послова.</p>

        <p>Унутрашњи послови обављају се на начин којим се сваком човеку и грађанину обезбеђује једнака заштита и остваривање његових Уставом утврђених слобода и права.</p>

        <p>У обављању унутрашњих послова могу се примењивати само мере принуде које су предвиђене законом и којима се са најмање штетних последица по грађане, као и њихове организације, предузећа, установе и друге организације, постиже извршење послова.</p>
    </div>
</div>

<style>
    .header {
        display: flex; flex-direction: row; height: 140px; padding: 15px;
    }

    .header a {
        font-size: 1.6em;
    }

    .header:hover a {
        color: #00466D;
    }

    .header-link {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .header-link a:hover {
        cursor: pointer;
        text-decoration: none;
    }

	.mupFlagPattern {
		background: url("../build/src/flag-pattern.png") #fff;
		height: 38px;
	}
    /* Dropdown Button */
    .dropbtn {
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
    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 160px;
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        z-index: 1;
    }

    /* Links inside the dropdown */
    .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    /* Change color of dropdown links on hover */
    .dropdown-content a:hover {
        color: white;
        background-color: dimgray;
        cursor: pointer;
    }

    /* Show the dropdown menu on hover */
    .dropdown:hover .dropdown-content {display: block;}

    /* Change the background color of the dropdown button when the dropdown content is shown */
    .dropdown:hover .dropbtn {
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