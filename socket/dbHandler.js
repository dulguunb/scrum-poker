var Datastore = require('nedb')
  , db = new Datastore();

module.exports = {
  database:db,
  insert: (data) => {
      db.insert(data,function(err,newDocs){
        if(err){
          console.log('an error occured');
          console.log(err);
        }
        else{
          console.log('a new document is inserted:');
          // console.log(newDocs);
        }
      });
  },
  remove : (data) => {
    db.remove(data,function(err,numRemoved){
      if(err){
        console.log('an error occured');
        console.log(err);
      }
      else{
        console.log('a new document is inserted');
        console.log(numRemoved);
      }
    });
  },
  find : (query,callback) => {
    this.database.find(query,callback);
  }
}