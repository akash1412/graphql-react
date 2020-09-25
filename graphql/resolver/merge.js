const Event = require('../../models/events')
const User = require('../../models/users')


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

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;