// import { MONGODB_URI } from '$env/static/private';
// import { MongoClient, ServerApiVersion } from 'mongodb';
// if (!MONGODB_URI) throw Error('There is no MONGODB_URI in process.env');

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(MONGODB_URI, {
// 	serverApi: {
// 		version: ServerApiVersion.v1,
// 		strict: true,
// 		deprecationErrors: true
// 	}
// });

// let clientPromise: Promise<MongoClient>;

// try {
// 	// Connect the client to the server (optional starting in v4.7)
// 	clientPromise = client.connect();
// 	// Send a ping to confirm a successful connection
// 	await client.db('admin').command({ ping: 1 });
// 	console.log('Pinged your deployment. You successfully connected to MongoDB!');
// } finally {
// 	// Ensures that the client will close when you finish/error
// 	await client.close();
// }

// export default clientPromise;
