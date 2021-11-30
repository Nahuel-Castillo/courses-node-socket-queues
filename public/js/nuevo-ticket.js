
const lblNewTicket = document.querySelector("#lblNuevoTicket");
const btnCreate = document.querySelector('button');

const socket = io();

socket.on('last-ticket', ( ticket ) => {
    lblNewTicket.innerText = ticket;
});

socket.on('connect', () => {
    btnCreate.disabled = false;
});

socket.on('disconnect', () => {
    btnCreate.disabled = true;
});

btnCreate.addEventListener( 'click', () => {

    socket.emit( 'next-ticket', null, ( ticket ) => {
       lblNewTicket.innerText = ticket;
    });

});