const Event = require('../models/events')
const User = require('../models/users')
const Booking = require('../models/booking')

const events = async eventIds => {


    const events = await Event.find({
        _id: {
            $in: eventIds
        }
    })

    return events.map((event) => {
        return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator)
        }
    })

}

const singleEvent = async (eventId) => {
    const event = await Event.findById(eventId);

    return {
        ...event._doc,
        creator: user.bind(this, event._doc.creator)
    }
}

const user = async (userId) => {

    try {
        const user = await User.findById(userId);


        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }

    } catch (error) {
        throw error
    }
}


module.exports = {
    events: async () => {
        try {

            const events = await Event.find()

            return events.map((event) => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            })


        } catch (error) {
            throw error

        }
    },
    createEvent: async (args) => {

        try {
            const newEvent = await Event.create({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5f6bc39588d817f74a10ee8b"
            })

            const event = {
                ...newEvent._doc,
                date: new Date(newEvent._doc.date).toISOString(),
                creator: user.bind(this, newEvent._doc.creator)
            }
            const dbUser = await User.findById("5f6bc39588d817f74a10ee8b")

            dbUser.createdEvents = [...dbUser.createdEvents, newEvent];

            dbUser.save()

            return event
        } catch (error) {
            console.log(error);
            throw error
        }

    },

    bookings: async () => {
        const bookings = await Booking.find();

        return bookings.map((booking) => {
            return {
                ...booking._doc,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString()
            }
        })
    },

    deleteEvent: async () => {
        try {
            await Event.deleteMany()
            return 'Events Deleted'
        } catch (error) {
            console.error(error)
        }

    },


    createUser: async (args) => {

        const {
            email,
            password
        } = args.userInput;

        try {

            const UserExists = await User.findOne({
                email
            })

            if (UserExists) {
                throw new Error('User alredy exist')
            }

            const newUser = await User.create({
                email,
                password
            })


            newUser.password = null

            return newUser
        } catch (error) {
            console.error(error)
        }

    },
    bookEvent: async (args) => {

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

        return {
            ...newBooking._doc,
            user: user.bind(this, newBooking._doc.user),
            event: singleEvent.bind(this, newBooking._doc.event),
            createdAt: new Date(newBooking._doc.createdAt).toISOString(),
            updatedAt: new Date(newBooking._doc.updatedAt).toISOString()
        }

    },
    cancelBooking: async (args) => {
        const booking = await Booking.findById(args.bookingId).populate('event');

        await Booking.findByIdAndDelete(args.bookingId);


        return {
            ...booking._doc.event._doc,
            creator: user.bind(this, booking._doc.event._doc.creator)
        }

    }

}