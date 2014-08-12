var mongoose = require('mongoose'); 

var SnapSchema = new mongoose.Schema({
    text: {type: String}, 
    children: {type: Array}, 
    parents: {type: Array}, 
    markdown: {type: Boolean},
    timestamp: {type: Number}, 

    cur_id: {type: String}
});

var MySnap = mongoose.model('snaps', SnapSchema);

module.exports.MySnap = MySnap; 
// module.exports.fetchMostRecent = fetchMostRecent; 
module.exports.addSnap = addSnap; 

// function fetchMostRecent(){
// 	MySnap
// }

//helper function for setUpDB. 
function addSnap(node, now, remove, callback){
  var instance = new MySnap();
  instance.text = node.text;
  instance.children = node.children;
  instance.parents = node.parents;
  instance.markdown = node.markdown; 
  instance.cur_id = node._id;
  instance.timestamp = now;


  if(remove){
    console.log("removingNode!!!"); 
  	node.remove(); 
  }
  else{
    console.log("saving Node!!!"); 
  	node.timestamp = now; 
  	node.save(); 
  }

  instance.save(function(err){
    if(err){
      //callback(err);
    }
    else{
      //callback(null, instance);
    }
  });
}