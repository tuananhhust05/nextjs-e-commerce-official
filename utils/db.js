import mongoose from 'mongoose';

const connection = {};

async function connect() {
 // await mongoose.disconnect();
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to mongoDB.");
  connection.isConnected= true;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}
function convertDocToObj(doc) {
  if(doc._id){
    doc._id = doc._id.toString();
  }
  if(doc.createdAt){
    doc.createdAt = doc.createdAt.toString();
  }
  if(doc.updatedAt){
    doc.updatedAt = doc.updatedAt.toString();
  }
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
