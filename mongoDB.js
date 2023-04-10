const mongodb = require('mongodb');
const mongoclient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = "task-manager";

mongoclient.connect(connectionUrl, {useNewUrlParser: true}, (error,client) => {
  if(error){
    console.log("Unable to connect Database");
  }
    const db = client.db(databaseName);
    
    db.collection('users').insertOne({
      name : "Milan",
      age : 22
    }, (error,result) => {
         if(error){
          throw new Error("Error accur in insertOne")
         }
         console.log(result.ops);
    })
});