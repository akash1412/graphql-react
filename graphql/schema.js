const {
  buildSchema
} = require('graphql');

module.exports = buildSchema(`
type Booking {
  _id:ID!
  event:Event!
  user:User!
  createdAt:String
  updatedAt:String

}    

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
  bookings:[Booking!]!
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
   bookEvent(eventId:ID!): Booking!
   cancelBooking(bookingId:ID!): Event!
 }
 
  schema {
      query:rootQuery
      mutation:rootMutation
  }
`)