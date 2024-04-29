const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q9eobgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const database = client.db("SpotsDB");
        const spotsCollection = database.collection("spots");
        const countriesCollection = database.collection("countries");

        // get all data 
        // for All spots
        app.get("/spots", async (req, res) => {
            const cursor = spotsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get("/favoriteSpots", async (req, res) => {
            const query = { email: "", name: "" }
            const result = await spotsCollection.find(query).toArray()
            res.send(result)
        })


        // // get data for one 
        app.get("/singleSpots/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.findOne(query);
            res.send(result)
        })

        // get data for my spots
        app.get("/spots/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const cursor = spotsCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // for Sort data
        app.get('/sortedSpots', async (rew, res) => {
            const cursor = spotsCollection.find().sort({ "average_cost": 1 });
            const result = await cursor.toArray()
            res.send(result)
        })

        // for country
        app.get("/countries", async (req, res) => {
            const cursor = countriesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // spots for Specific Country
        app.get("/countries/:id", async (req, res) => {
            const name = req.params.id;
            const query = { country_Name: name }
            const cursor = spotsCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // Add data 
        app.post("/spots", async (req, res) => {
            const spot = req.body;
            console.log(spot);
            const result = await spotsCollection.insertOne(spot)
            res.send(result);
        })

        // update data 
        app.put("/spots/:id", async (req, res) => {
            const id = req.params.id;
            const spot = req.body
            console.log(spot);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateSpot = {
                $set: {
                    tourists_spot_name: spot.tourists_spot_name,
                    location: spot.location,
                    country_Name: spot.country_Name,
                    seasonality: spot.seasonality,
                    travel_time: spot.travel_time,
                    visitorsPerYear: spot.visitorsPerYear,
                    average_cost: spot.average_cost,
                    image: spot.image,
                    description: spot.description
                },
            };
            const result = await spotsCollection.updateOne(filter, updateSpot, options);
            res.send(result)
        })
        // delete data 
        app.delete("/spots/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.deleteOne(query);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Tourism server listening on port ${port}`)
})