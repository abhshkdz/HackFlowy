
	var socket = null; 
	var AppRouter = Backbone.Router.extend({

		socketEvents: _.extend({}, Backbone.Events),

		routes: {
			'': 'initialize', 
			':id': "viewRoot"
		}, 

		initialize: function(){ 

			socket = io.connect(); 
			this.setUpSocket(); 
			

			$.ajax({
				url: "/ajaxlogin", 
				type: "POST", 

				complete: function(){
				},
				success: function(data){
					console.log("AjaxLoginDATA"); 
					if(typeof data == "string"){
						$("textarea").attr("disabled", true); 
					} //User is not logged in. 
					if(typeof data == "object"){//we've got the userObject. 
						$("#googleButton").parent().html("<a href='logout'>Logout</a> "); 
						socket.emit("logIn", data); //logs the user into the socket.


						data.google.id = null; 
						data.google.token = null; 
						data.google.email = null; 
						CurrentUser = data; 

						console.log("CURRENT USER"); 
						console.log(CurrentUser); 
					}
				},


				error: function(data){
				console.log("ERROR- AjaxLoginDATA");
				}
		    }); 

		},

		// index: function(otherID){
		// 	var that = this;
			
		// 	otherID = otherID || 

		// }, 

		viewRoot: function(id, snapCollection){

			var rootModel; 
			var metaCollection; 
			var snapView = 0; 
			if(snapCollection){
				rootModel = snapCollection.findWhere({cur_id: id});
				metaCollection = snapCollection
				snapView = 1; 
			}
			else{
				rootModel = nodesCollection.findWhere({_id: id});
				metaCollection = nodesCollection; 
			}

			var rootView = new listView({
					viewWindow: ".main1",
					model: rootModel, 
					metaCollection: metaCollection,
					snapView: snapView
				})
			this.changeView(rootView);
		}, 

		changeView: function(view) {
	     	if ( null != this.currentView ) {
	        	this.currentView.undelegateEvents();
	      	}
	      	
	      	this.currentView = view;
	      	$("textarea").textareaAutoExpand(); 
	      	

	    }, 

	    setUpSocket: function(){
	    	var that = this; 
	socket.on('nodeData', function(data){
		//alert("data");

		console.log(data);
		nodesCollection = new NodesCollection(data); 
		var id = nodesCollection.findWhere({text: "0root"}).get("_id");
		// if(otherID){
		// 	id = otherID
		// }


		that.viewRoot(id);
	});


	socket.on("commitReceived", function(){
		alert("commitReceived"); 
	}); 

	socket.on("revHistory", function(data){
		alert("revHistory!!"); 
		console.log("revHistory!!"); 
		snapHash = data[0]; 
		timeHash = data[1]; 
		console.log("snapHash"); 
		console.log(snapHash); 
		console.log("timeHash"); 
		console.log(timeHash); 

		var list = ""; 
		_.each(Object.keys(timeHash), function(timestamp){
			list += "<li><a class='timestamp'>"+timestamp+"</a></li>"; 
		})

		$("#revTimestamps").html(list); 
	})


	$("#revTimestamps").on("click", "a.timestamp", function(event){
		// debugger; 
		var a = event.target; 
		var timestamp = parseInt($(a).html()); 
		var subRootId = $(".getRevHistory").attr("data-id"); 

		var snapCollection = renderRevControl(subRootId, timestamp); 

		console.log("snapCollection")
		console.log(snapCollection); 

		that.viewRoot(subRootId, snapCollection); 
	}); 


	socket.on('edit', function(data){
		var id = data[0];
		var newText = data[1];
		
		var curModel = nodesCollection.findWhere({_id: id})
		curModel.set("text", newText);
		_.each(curModel.get("views"), function(view){
			view.updateText(newText);
			
		});

	});

	socket.on("updateReceived", function(data){
		//data[0] is _id. data[1] is instance. 
		var instance = data[1];
		var old_id = data[0];
		var parId = data[2][0];
		var newIndex = data[2][1];

		var parentModel = nodesCollection.findWhere({_id: parId});
		var new_id = instance._id
		var oldModel = nodesCollection.findWhere({ _id: old_id }); 
		oldModel.set("_id", new_id );
		_.each(oldModel.get("views"), function(view){
			view.updateId(new_id);
		});
		parentModel.get("children")[newIndex] = instance._id;
	})

	socket.on("newNode", function(data){
		//need the instance + the index. 
		var modelJson = data[1]; //(includes the negative ID to find later);
		var parId = data[0][0];
		var newIndex = data[0][1];

		var newNode = new NodeModel(modelJson);
		nodesCollection.add(newNode);
		var parentModel = nodesCollection.findWhere({_id: parId});
		var parentViews = parentModel.get("views");
		_.each(parentViews, function(parentView){
			parentView.addNode(newNode, newIndex).lock();
			//look at socket.emit("newNode" to see why -1);
		}); 
		parentModel.get("children").insert(newIndex, modelJson._id); 
	});

	socket.on("editing", function(data){
		var id = data[0]; 
		var authorName = data[1]; 
		console.log("EDITING RECEIVED + ID");
		console.log(id);
		if(id < 0){return;}
		var tempViews = nodesCollection.findWhere({_id: id}).get("views");
		_.each(tempViews, function(tempView){
			tempView.lock();
		}); 
	}); 

	socket.on("blurred", function(data){
		var id = data[0];
		var text = data[1];
		var author = data[2]; 
		
		var tempModel = nodesCollection.findWhere({_id: id}); 
		tempModel.set("text", text);
		tempModel.set("author", author); 
		var tempViews = tempModel.get("views");
		_.each(tempViews, function(tempView){
			tempView.unlock();
			tempView.updateText(text);
		}); 
	});

	socket.on("removeNode", function(data){
		var tempVo = {}; //PROTECTING STATE!!

		// tempVo.author = data[3]; //(actually, unnecessary...)
		tempVo.thisId = data[0];
	    tempVo.thisIndex = data[1];
	    tempVo.parentId = data[2]; 
	    tempVo.thisModel = nodesCollection.findWhere({_id: tempVo.thisId});
	    tempVo.parentModel = nodesCollection.findWhere({_id: tempVo.parentId});
	    
	    
	    removeNode(tempVo, true); //true means came from broadcast.  
	});

	socket.on("movedNode", function(data){
		var ids = data[0];
		var indices = data[1];
		var author = data[2]; 

		var thisModel = nodesCollection.findWhere({_id: ids[0]});
		var oldParModel = nodesCollection.findWhere({_id: ids[1]});
		var newParModel = nodesCollection.findWhere({_id: ids[2]});


		thisModel.set("author", author); 
		moveNode(thisModel, indices[0], oldParModel, newParModel, indices[1]);
	}); 


	socket.on("revControl", function(data){
		//(store all of this...). 
		var timeHash = data[0]; 
		var snapHash = data[1]; 
		var timeStamps = timeHash.keys; 

		//To be continued...




	}); 

	socket.emit("nodeRequest"); 
	}

	});

function setUpSocket(){

}

	


// socket.on('nodeData', function(data){
// 	console.log("nodeDATA RECEIVED\n");
// 	console.log(data);
// 	nodesCollection = new nodesCollection(data); //nodes
// 	//alert(data);
// 	var model = new NodeModel(data[1]);
// 	console.log("NodeModel(data[1])\n");
// 	console.log(model);
// 	console.log("nodesCollection.models");
// 	console.log(nodesCollection.models);
// 	var rootNode = nodesCollection.findWhere({_id: "52b7422c36dd4c5215ce78bf"});
// 	console.log("rootNode");
// 	console.log(rootNode);
// 	//console.log(rootNode);
// 	that.viewRoot("52b7422c36dd4c5215ce78bf")
// });