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
        await client.connect();
        const spotsCollection = client.db("SpotsDB").collection("spots");

        // get all data 
        app.get("/spots", async (req, res) => {
            const cursor = spotsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // get data by id 
        app.get("/spots/:id", async (req, res) => {
            const id = req.params.id;
            const spot = req.body;
            const query = { _id: new ObjectId(id) }
            const result = await spotsCollection.findOne(query);
            res.send(result)
        })

        // set data 
        app.post("/spots", async (req, res) => {
            const spot = req.body;
            console.log(spot);
            const result = await spotsCollection.insertOne(spot)
            res.send(result);
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