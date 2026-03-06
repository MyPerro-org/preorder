const { MongoClient } = require('mongodb');

async function run(){
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'myperro_waitlist';
  const client = new MongoClient(uri);
  try{
    await client.connect();
    const db = client.db(dbName);
    const count = await db.collection('submissions').countDocuments({ amount: 2499, paymentStatus: 'captured' });
    console.log('count', count);
    const docs = await db.collection('submissions').find({ amount: 2499 }).limit(5).toArray();
    console.log('sample', docs);
  }catch(e){
    console.error(e);
  }finally{
    await client.close();
  }
}
run();
