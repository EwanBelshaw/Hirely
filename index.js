const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://ewanbelshaw:123Mongo@hirely.m61uf.mongodb.net/?retryWrites=true&w=majority&appName=Hirely";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('Hirely');
    const collection = db.collection('Users');

    // Find the first document in the collection
    const first = await collection.findOne();
    console.log(first);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
run().catch(console.error);