<script>
    import {Calendar} from "@fullcalendar/core";
    import timeGridPlugin from "@fullcalendar/timegrid";
    import interactionPlugin from "@fullcalendar/interaction";
    import momentTimezonePlugin from '@fullcalendar/moment-timezone';
    import {onMount} from "svelte";

    export let userId;
    let calendar;
    let selectedTime;
    let usersAppointments = [];

    onMount(() => {
        calendar = new Calendar(document.getElementById('calendar'), {
            plugins: [timeGridPlugin, interactionPlugin, momentTimezonePlugin],
            timeZone: 'Europe/Belgrade',
            initialView: 'timeGridWeek',
            selectable: true,
            selectMirror: true,
            selectOverlap: false,
            allDaySlot: false,
            headerToolbar: {
                left: 'prev,next',
                center: 'title'
            },
            dateClick: function (slotInfo) {
                selectedTime = slotInfo.date;
            },
            eventClick: function (info) {
                selectedTime = undefined;

                if (info.event.backgroundColor === '#999')
                    return

                let event = info.event;

                let decision = confirm(`Ukloni termin za izdavanje "${event.title}"\nna datum "${event.start.toLocaleString()}"?`)

                if (decision) {
                    fetch(
                        `http://localhost:8777/appointment/?appointment_id=${event.id}`,
                        {
                            method: 'DELETE'
                        }
                    ).then(_ => {
                        calendar.getEventSources()[0].refetch();
                        getAllUserAppointments();
                    }).catch(error => {
                        console.log('delete appointment error: ', error);
                    })
                }

            },
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: '07:00',
                endTime: '14:00',
            },
            eventOverlap: false,
            weekends: false,
            slotMinTime: '06:45',
            slotMaxTime: '14:15',
            slotDuration: '00:15',
            events: function (fetchInfo, successCallback, failureCallback) {
                fetch(
                    `http://localhost:8777/appointment/dates/?from_date=${fetchInfo.start.toISOString()}&to_date=${fetchInfo.end.toISOString()}`,
                    {
                        method: 'GET',
                        header: {
                            'Accept': 'application/json'
                        },
                    }).then(response =>
                        response.json()
                    ).then(response => {
                        successCallback(
                            response.map(appointment_json => {
                                    return {
                                        id: appointment_json['id'],
                                        start: appointment_json['date'],
                                        end: new Date((new Date(appointment_json['date'])).getTime() + 15 * 60000),
                                        color: userId == appointment_json.user_id ? '#ff6961' : '#999',
                                        title: appointment_json.type
                                    }
                                }
                            )
                        )
                    });
            },
        });

        calendar.render();

        getAllUserAppointments();
    });
    async function getAllUserAppointments() {
        usersAppointments = [];
        fetch(`http://localhost:8777/appointment/user/?user_id=${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response =>
            response.json()
        ).then(response => {
            usersAppointments = response;
            console.log(usersAppointments);
        }).catch(error => {
            console.log('create appointment error: ', error);
        });
    }
    async function createAppointment() {
        if (selectedTime) {
            fetch(
                'http://localhost:8777/appointment',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        date: new Date((new Date(selectedTime)).getTime() + 120 * 60000).toISOString(),
                        length: 15,
                        user_id: 1,
                        type: 'ID'
                    })
                }
            ).then(_ => {
                calendar.getEventSources()[0].refetch();
                getAllUserAppointments();
                selectedTime = undefined;
            }).catch(error => {
                console.log('create appointment error: ', error);
            });
        } else {
            alert('Niste izabrali datum.');
        }
    }

    async function deleteAppoitment(event) {
        let appointment = usersAppointments.find(appointment => appointment.id === parseInt(event.currentTarget.dataset.id));

        let decision = confirm(`Ukloni termin za izdavanje "${appointment.type}"\nna datum "${appointment.date.split('T')[0]}"?`)

        if (decision) {
            fetch(
                `http://localhost:8777/appointment/?appointment_id=${appointment.id}`,
                {
                    method: 'DELETE'
                }
            ).then(_ => {
                calendar.getEventSources()[0].refetch();
                getAllUserAppointments();
            }).catch(error => {
                console.log('delete appointment error: ', error);
            })
        }
    }
</script>
<div class='input_form'>
    <div>
        <label for='selected_date'>Izabran datum:</label>
        <input id='selected_date' value={selectedTime ? selectedTime.toISOString().split('T')[0] : ''}>
    </div>
    <div style="display: flex; flex-flow: row nowrap; gap: 15px;">
        <div>
            <label for='time_from'>Vreme od:</label>
            <input id='time_from' value={selectedTime ? new Date((new Date(selectedTime)).getTime() + 120*60000).toISOString().split('T')[1].slice(0,5) : ''}>
        </div>
        <div>
            <label for='time_to'>do:</label>
            <input id='time_to'
                   value={selectedTime ? new Date((new Date(selectedTime)).getTime() + 135*60000).toISOString().split('T')[1].slice(0,5) : ''}>
        </div>
    </div>
    <div>
        <button style="font-size: xx-large; padding: 10px;" disabled={!selectedTime} on:click={createAppointment}>
            Zakaži
        </button>
    </div>
</div>
<div style="display: flex; flex-flow: row nowrap;">
    <div id='calendar' style="overflow: hidden; margin-top: 15px; flex-grow: 12;}"></div>
    {#if usersAppointments}
        <ul style="list-style: none; flex-grow: 1;">
            {#each usersAppointments as appointment}
                <li style='border: 1px solid gray; background-color: lightgray; padding: 3px; margin-bottom: 5px;' data-id={appointment.id} on:click={deleteAppoitment}>
                    <div style='font-weight: bolder;'>{appointment.type}</div>
                    <div>{appointment.date.split('T')[0]}</div>
                    <div>{new Date((new Date(appointment.date)).getTime() + 120*60000).toISOString().split('T')[1].slice(0,5)} - {new Date((new Date(appointment.date)).getTime() + 135*60000).toISOString().split('T')[1].slice(0,5)}</div>
                </li>
            {/each}
        </ul>
    {/if}
</div>
<style>
    .input_form {
        margin-top: 20px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        gap: 15px;
    }

    .input_form * {
        font-size: larger;
    }

    .input_form input {
        pointer-events: none;
    }
</style>