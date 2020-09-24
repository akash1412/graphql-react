const express = require('express');
const {
  graphqlHTTP
} = require('express-graphql');

const mongoose = require('mongoose')


const graphqlSchema = require('./graphql/schema')
const resolvers = require('./graphql/resolver')

const app = express();

app.use(express.json())



app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: resolvers,
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