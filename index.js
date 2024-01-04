
const express = require('express')
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.port ||5000;
const cors = require('cors')

//middleware
app.use(cors());
app.use(express.json());

//oAPD5tGeWwAlH5pw

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//mongodb cofiguration
 
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mern-demo-book:oAPD5tGeWwAlH5pw@cluster0.h7vrmi4.mongodb.net/?retryWrites=true&w=majority";

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
    const booksColletion =  client.db("BookInventory").collection("books");

    //insert a book to the db: post method
    app.post("/upload-book",async(req,res)=>{
        const data = req.body
        const result = await booksColletion.insertOne(data);
        res.send(result)
    })

    // get all books from the database
    app.get("/all-books",async(req,res)=>{
      const books =  await booksColletion.find();
      const result = await books.toArray();
      res.send(result);
    })

    //update a book data : patch or update methods

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      console.log("ID:", id);
      const filter = { _id: new ObjectId(id) };
  
      
       const options = { upsert: true };
    
      const updatedoc = {
        $set: {
          ...updateBookData
        }
      };
    
      // Update
      const result = await booksColletion.findOneAndUpdate(filter, updatedoc, options);
    
      if (result.modifiedCount > 0) {
        res.send({ success: true, message: 'Book updated successfully' });
      } else {
        res.send({ success: false, message: 'No matching book found for the given ID' });
      }
    });

    //delete a book data
   // ...

// Delete a book data
app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await booksColletion.deleteOne(filter);
  res.send(result);
});

// ...
//find by cagegory 
app.get("/all-books",async(req,res)=>{
  let query = {};
  if(req.query?.category){
    query = {category: req.query.category}
  }
  const result = await booksColletion.find(query).toArray();
  res.sendStatus(result);
})

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})