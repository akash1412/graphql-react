const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const mongoose = require("mongoose");

const isAuth = require("./middlewares/is-auth");

const graphqlSchema = require("./graphql/schema/schema");
const rootResolvers = require("./graphql/resolver/resolver");

const app = express();
app.use(cors());
app.use(express.json());

process.on("uncaughtException", err => {
	console.log(err);
	process.exit();
});

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(isAuth);

app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphqlSchema,

		rootValue: rootResolvers,
		graphiql: true,
	})
);

const DB = process.env.DB_URL.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("connected to DB");
	})
	.catch(error => console.error(error.message));

app.listen(4000, () => {
	console.log("graphql server running ");
});
