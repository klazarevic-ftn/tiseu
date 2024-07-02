<script>
    import {onMount} from "svelte";

    let forms = [];

    onMount(async _ => {
        await fetch('http://localhost:8777/form/all/unfulfilled', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response =>
            response.json()
        ).then(content => {
            console.log('forms: ', content);
        })
    })
</script>