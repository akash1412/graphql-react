const express = require('express');
const {
  graphqlHTTP
} = require('express-graphql');
const {
  buildSchema
} = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/events');

const User = require('./models/users')

const app = express();

app.use(express.json())

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

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator:User!
    }

    type User {
      _id: ID!
      email:String!
      password:String
      createdEvents:[Event!]
    }

     type rootQuery {
       events:[Event!]!
       user(userId:String!) : User!
     }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserEvent {
        email:String!
        password:String!
      }

     type rootMutation {
       createEvent(eventInput:EventInput) : Event!
       deleteEvent : String!
       createUser(userInput:UserEvent) : User
     }
     
      schema {
          query:rootQuery
          mutation:rootMutation
      }
    `),
  rootValue: {
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

        console.log(newUser)
        newUser.password = null

        return newUser
      } catch (error) {
        console.error(error)
      }

    }

  },
  graphiql: true
}))

const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD)


mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('connected to DB')).catch((error) => console.log(error))




app.listen(4000, () => {
  console.log('graphql server running ')
})