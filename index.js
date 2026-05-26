const express = require('express');
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());



const uri = process.env.MONGODB_URI;

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

    await client.connect();
    const db = client.db("drivenow")
    const addcarCollection = db.collection("addcar")
    const bookingCollection = db.collection("bookings");



    app.get('/addcar', async (req, res) => {
      const result = await addcarCollection.find().toArray()
      res.json(result)

    })


    app.post('/addcar', async (req, res) => {
      const addcarData = req.body;
      console.log(addcarData);
      const result = await addcarCollection.insertOne(addcarData);
      res.json(result);
    })



    app.get('/addcar/:id', async (req, res) => {
      const { id } = req.params
      const result = await addcarCollection.findOne({ _id: new ObjectId(id) })
      res.json(result)
    })

    app.get('/booking/:id', async (req, res) => {
      const result = await bookingCollection.find().toArray()
      res.json(result)

    })


    app.post("/booking", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);

      res.json(result);
    });
    app.delete("/booking/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const result = await bookingCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            message: "Booking not found",
          });
        }

        res.json({
          success: true,
          message: "Booking cancelled successfully",
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
    });

    app.patch('/addcar/:id', async (req, res) => {
      const { id } = req.params
      const updateData = req.body;
      console.log(updateData);
      const result = await addcarCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )
      res.json(result)
    })

    app.delete('/addcar/:id', async (req, res) => {
      const { id } = req.params
      const result = await addcarCollection.deleteOne({ _id: new ObjectId(id) })

      res.json(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("Server is Running Fine")
})

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);

})