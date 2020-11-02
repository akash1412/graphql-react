const Event = require("../../models/events");
const User = require("../../models/users");

const { user, events } = require("./merge");

const { dateToString } = require("../../utils/date");

const transformedEvents = event => ({
	...event._doc,
	date: new Date(event._doc.date).toISOString(),
	creator: user.bind(this, event._doc.creator),
});

module.exports = {
	events: async () => {
		try {
			const events = await Event.find();

			return events.map(event => {
				return transformedEvents(event);
			});
		} catch (error) {
			throw error;
		}
	},
	createEvent: async (args, req) => {
		console.log(args);

		if (!req.isAuth) {
			throw Error("You are not Authenticated");
		}

		try {
			const newEvent = await Event.create({
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: new Date(args.eventInput.date),
				creator: req.userId,
			});

			const event = transformedEvents(newEvent);

			const dbUser = await User.findById(req.userId);

			dbUser.createdEvents.push(newEvent);

			dbUser.save();

			return event;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	deleteEvent: async ({ eventId }, req) => {
		try {
			const event = await Event.findById({
				id: eventId,
			});

			await Event.findByIdAndDelete({
				id: eventId,
			});
			return {
				...event._doc,
				date: dateToString(event._doc.date),
			};
		} catch (error) {
			console.error(error);
		}
	},
};
