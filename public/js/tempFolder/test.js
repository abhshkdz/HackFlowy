var bulletHash = [];
var rootBullets = [];
$(function() {
  // Bullet class declaration
  function Bullet (parentID, text) {
    // If root bullet
    if(parentID === -1){
      this.ID = bulletHash.length;
      this.text = text;
      this.children = [];
      bulletHash.push(this);
      rootBullets.push(this.ID);
      return;
    }
    this.ID = bulletHash.length;
    this.text = text;
    this.children = [];
    bulletHash[parentID].children.push(this.ID);
    bulletHash.push(this);
    // load(this.ID)
    return;
  }

  $(document).ready(function() {
    new Bullet(-1, '')
    // loadRoot(0);
    console.log(bulletHash);
    // bulletHash[0].children = new Array(); //So it doesn't have itself as a child.
    // bulletHash[0].parents = [];
    //I could replace this with an object literal...
    for(var i = 0; i< 5; i++){
      new Bullet(0, "bullet" + i);
      // bulletHash[i].push(new Bullet(0,'bullet' + i));
      console.log(bulletHash);
    }
    loadAll();
    $("textarea").textareaAutoExpand();
  });

    //Load root nodes and all their children
  function loadAll() {
    for(var i = 0; i < rootBullets.length; i++){
      var rootNodeID = rootBullets[i];
      $(".root").append(JSONtoUI(bulletHash[rootNodeID]));
      $("#"+rootNodeID).children(".subList").slideToggle(0); //This makes it so that you can hitTab with luke Skywalker and it will work. 
      loadChildren(rootNodeID);
    }
  }

  function loadChildren(bulletID){
    var childrenBullets = bulletHash[bulletID].children;
    for(var i = 0; i < childrenBullets.length; i++){
      var childID = childrenBullets[i];
      $("#"+bulletID).children().filter(".subList").append( JSONtoUI( bulletHash[childID] ) );
      $("#"+childID).parent().slideToggle(0); //this refers to the UL in which it's contained...(which, in the base case would hide the entire thing)
      $("#"+childID).children(".subList").slideToggle(0); //This makes it so that you can hitTab with luke Skywalker and it will work. 
      loadChildren(childID);
    }
  }
});