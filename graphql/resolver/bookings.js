const Booking = require('../../models/booking');


const {
    user,
    singleEvent
} = require('./merge')

const {
    dateToString
} = require('../../utils/date')

const transformedEvents = (event) => ({
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event._doc.creator)
})

const transformedBooking = (booking) => ({
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
})


module.exports = {

    bookings: async (args, req) => {

        if (!req.isAuth) {
            throw Error('Not Authenticated');
        }

        const bookings = await Booking.find();

        return bookings.map((booking) => {
            return transformedBooking(booking)
        })
    },


    bookEvent: async (args, req) => {

        if (!req.isAuth) {
            throw Error('Not Authenticated')
        }

        const {
            eventId
        } = args;

        const event = await Event.findOne({
            _id: eventId
        })

        const newBooking = await Booking.create({
            user: "5f6bc39588d817f74a10ee8b",
            event
        })

        return transformedBooking(newBooking)

    },
    cancelBooking: async (args, req) => {

        if (!req.isAuth) {
            throw Error('you are not logged in!')
        }

        const booking = await Booking.findById(args.bookingId).populate('event');

        await Booking.findByIdAndDelete(args.bookingId);

        return transformedEvents(booking.event)


    }

}