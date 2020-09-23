const express=require('express');
const {graphqlHTTP}=require('express-graphql');
const {buildSchema}=require('graphql')
const mongoose=require('mongoose')
const Event=require('./models/events');
const { findById } = require('./models/users');
const User=require('./models/users')

const app=express();

app.use(express.json())

 

app.use('/graphql',graphqlHTTP({
    schema:buildSchema(`
    
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email:String!
      password:String
    }

     type rootQuery {
       events:[Event!]!
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
    rootValue:{
        events:async()=>{
          const events= await Event.find();

          return events
        },
        createEvent:async (args)=>{
 
          try {
            const event =  await Event.create({
              title:args.eventInput.title,
                 description:args.eventInput.description,
                 price:+args.eventInput.price,
                 date:new Date( args.eventInput.date),
                 creator:"5f69fa6ea3ab77fcc578f589"
            })
             
            const user=await User.findById("5f69fa6ea3ab77fcc578f589")

            user.createdEvents=[...user.createdEvents,event];

            user.save()

            return event
          } catch (error) {
            console.log(error);
            throw error
          }
      
        },
        deleteEvent:async()=>{
          await Event.deleteMany()
          return 'Events Deleted'
        },
        createUser:async(args)=>{
       
          const {email,password}=args.userInput;
          
          const UserExists= await User.findOne({email})
           
          if(UserExists){
            throw new Error('User alredy exist')
          }

          const newUser= await User.create({
             email,password
           })
           
           newUser.password=null

           return newUser
        }

    },
    graphiql:true
}))

const DB=process.env.DB_URL.replace('<PASSWORD>',process.env.DB_PASSWORD)

 
  mongoose.connect(DB,{ 
    useNewUrlParser:true,
    useUnifiedTopology:true
    }).then(()=>console.log('connected to DB')).catch((error)=>console.log(error))

      
 

app.listen(4000,()=>{
    console.log('graphql server running ')
})