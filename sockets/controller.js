const TicketControl = require("../models/ticket-control");

const ticketController = new TicketControl();

const socketController = (socket) => {

    socket.emit('last-ticket', 'Ticket: ' + ticketController.last );
    socket.emit('current-state', ticketController.last4 );
    socket.emit('pending-tickets', ticketController.tickets.length );

    socket.on('next-ticket', ( payload, callback ) => {
        
        const next = ticketController.next();
        callback( next );

        socket.broadcast.emit('pending-tickets', ticketController.tickets.length );

    });

    socket.on( 'serve-ticket', ( { desk }, callback ) => {
        
        if ( !desk ) {
            return callback({
                ok: false,
                msg: 'Desk is required'
            });
        }

        const ticket = ticketController.serveTicket( desk );

        socket.broadcast.emit('current-state', ticketController.last4 );
        socket.broadcast.emit('pending-tickets', ticketController.tickets.length );
        socket.emit('pending-tickets', ticketController.tickets.length );

        if ( !ticket ) {
            return callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            });
        }

        callback( { ok: true, ticket } );

    });

}

module.exports = {
    socketController
}

