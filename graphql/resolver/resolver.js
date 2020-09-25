const eventResolver = require('./events');
const bookingResolver = require('./bookings');
const authResolver = require('./auth');


module.exports = {
    ...eventResolver,
    ...bookingResolver,
    ...authResolver
}