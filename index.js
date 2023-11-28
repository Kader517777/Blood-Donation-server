const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 7000;

//Middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://shakhabdulkader2020:5Uwzk17Vl0X4U6pY@cluster0.yj5yqcj.mongodb.net/?retryWrites=true&w=majority";
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

        const usersCollection = client.db("Blood-Donation").collection("users");
        const createDonationRequestCollection = client.db("Blood-Donation").collection("createDonationRequest");
        // user get 
        app.get('/user/:email', async (req, res) => {
            const userEmail = req.params.email;
            console.log(userEmail);
            const query = { email: userEmail }
            const result = await usersCollection.findOne(query)
            console.log(result);
            res.send(result)
        })
        // my request donation get
        app.get('/requestDonation/:email', async (req, res) => {
            const userEmail = req.params.email;
            console.log(userEmail);
            const query = { email: userEmail }
            const result = await createDonationRequestCollection.find(query).toArray();
            console.log(result);
            res.send(result);
        })
        // user post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const isExiting = await usersCollection.findOne(filter)
            if (isExiting) {
                return res.send({ result: 'alredy exits user' })
            }
            console.log(isExiting);
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });
        // my donation request post
        app.post('/createDonationRequest', async (req, res) => {
            const user = req.body;
            const result = await createDonationRequestCollection.insertOne(user);
            res.send(result)
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, () => { console.log('port is:', port) });
