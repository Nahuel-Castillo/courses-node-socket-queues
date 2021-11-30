
const lblDesk = document.querySelector('h1');
const btnServe = document.querySelector('button');
const lblTicket = document.querySelector('small');
const lblAlert = document.querySelector(".alert");
const lblPending = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const desk = searchParams.get('escritorio');
lblDesk.innerText = desk;

lblAlert.style.display = 'none';
lblPending.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnServe.disabled = false;
});

socket.on('disconnect', () => {
    btnServe.disabled = true;
});

socket.on('pending-tickets', ( pending = 0 ) => {
    
    if ( pending === 0 ) {
        lblTicket.innerText = 'Nadie';
        lblAlert.style.display = '';
        lblAlert.innerText = 'No hay tickets pendientes';
        lblPending.style.display = 'none';
    } else {
        lblAlert.style.display = 'none';
        lblPending.style.display = '';
        lblPending.innerText = pending;
    }
});

btnServe.addEventListener( 'click', () => {
    serveTicket();
});

const serveTicket = () => {
    socket.emit('serve-ticket', { desk }, ( { ok, ticket, msg } ) => {
        
        if ( !ok ) {
            
            return lblAlert.innerText = msg;
        }

        lblTicket.innerText = ' Ticket: ' + ticket.number;
    });

}