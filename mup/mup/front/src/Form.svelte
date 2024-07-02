<script>
    export let userAttributes = undefined;

    $: jmbg = userAttributes ? userAttributes.attributes.jmbg[0] : '';
    let firstNameEl;
    let lastNameEl;
    let jmbgEl;
    let textAreaEl;

    $: formDisabled = userAttributes || firstNameEl?.value;
    $: text = '';

    async function queryUser(_) {
       fetch(`http://localhost:7000/api/osoba/${jmbg}?json=true`, {
           method: 'GET'
       }).then(response => {
           if(response.status === 200)
               return response.json();
           else
               throw new Error('Not found.');
       }).then(response => {
           firstNameEl.value = response.ime;
           lastNameEl.value = response.prezime;
       }).catch(error => {
           alert('Neispravan JMBG.');
           console.log('Query user error: ', error);
       })
    }

    async function submitReport() {
        let alertText = '';
        if(firstNameEl.value == '')
            alertText += 'JMBG je obavezan. '
        if(text.length < 300)
            alertText += 'Prijava mora imati barem 300 karaktera. '
        let body = {
            content: text,
            date_created: new Date(),
            form_type: 'REPORT'
        };

        if(userAttributes)
            body.user_id = userAttributes.attributes.mup_id[0];

        if(alertText)
            alert(alertText);
        else
            await fetch(
                'http://localhost:8777/form',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            ).then(_ => {
                firstNameEl.value = '';
                lastNameEl.value = '';
                jmbgEl.value = '';
                textAreaEl.value = '';
            }).catch(error => {
                console.log('Form submitReport error: ', error);
            })
    }
</script>

<div class='form'>
    <div class='inputs_container'>
        <div class='input'>
            <label for='first_name'>Ime</label>
            <input id='first_name' value={userAttributes ? userAttributes.firstName : ''} bind:this={firstNameEl} disabled>
        </div>
        <div class='input'>
            <label for='last_name'>Prezime</label>
            <input id='last_name' value={userAttributes ? userAttributes.lastName : ''} bind:this={lastNameEl} disabled>
        </div>
        <div class='input'>
            <label for='jmbg'>JMBG</label>
            <input id='jmbg' bind:value={jmbg} bind:this={jmbgEl} disabled={formDisabled}>
        </div>
        <button on:click={queryUser} disabled={formDisabled}>Proveri</button>
    </div>
    <div>
        <textarea style='' bind:value={text} bind:this={textAreaEl} minlength='300' maxlength='500'></textarea>
        <div style="float: right;">{text.length}/500</div>
    </div>

    <button style='font-size: xx-large' on:click={submitReport}>Pošalji prijavu</button>
</div>


<style>
    .form {
        display: flex;
        flex-flow: column nowrap;
        width: 400px;
        align-items: center;
        margin: 50px auto 0 auto;
        gap: 20px;
    }

    .inputs_container {
        width: 400px;
        display: flex;
        flex-flow: column nowrap;
        gap: 15px;
    }

    .input {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }

    .inputs_container * {
        font-size: larger;
    }

    textarea {
        width: 800px;
        height: 300px;
        resize: none;
    }
</style>