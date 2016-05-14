/*GAME DEFINITIONS*/
function game_title(){return '!DE';}
function game_background(){return '#3D3D3D';}
function game_wbackground(){return '#3D3D3D';}
function game_width(){return window.innerWidth;}
function game_height(){return window.innerHeight;}

/*CUSTOM DEFINITIONS*/

/*GAME EVENTS*/
function game_init(game)
{
	gameC = new GameControl();
	
	//DEFINE AUDIO
	ConnectedSound = new Audio('AUDIO/CONNECTED.wav');
	ErrorSound = new Audio('AUDIO/ERROR.wav');
	DeleteSound = new Audio('AUDIO/DELETE.wav');
	CreateSound = new Audio('AUDIO/CREATE.wav');
	muted = false;
	
	//DISABLE SCROLLS
	document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
	
	//SETUP FILE LOADING - IS FILE API SUPPORTED?
		if (window.File && window.FileReader && window.FileList && window.Blob) {	
			function readSingleFile(evt) {
				//READ FIRST FILE OF EVENT
				var f = evt.target.files[0]; 

				if (f) {
				  var r = new FileReader();
				  r.onload = function(e) { 
						var contents = e.target.result;
						load(contents);
				  }
				  r.readAsText(f);
				} else { 
				  alert("Failed to load file");
				}
			}
			
			document.getElementById('load-file').addEventListener('change', readSingleFile, false);
		}
		else
		{
		  alert("The File APIs are not fully supported by your browser.");
		}
	
	//CHECK URL PARAMS
	var reg = /\?hex(s)?\s?=\s?true/i;
	if (!reg.test(window.location.href))
	{
		document.getElementById("CreateType").options[7].disabled = true;
	}
	
	var reg = /\?stage(s)?\s?=\s?false/i;
	if (reg.test(window.location.href))
	{
		document.getElementById("CreateType").options[11].disabled = true;
		document.getElementById("CreateType").options[13].disabled = true;
		document.getElementById("stage").disabled = true;
	}
	
	var reg = /\?load(?:s)?\s?=\s?(.*)/ig;
	if (reg.test(document.URL))
	{
		var reg = /\?load(?:s)?\s?=\s?(.*)/ig;
		var a = reg.exec(document.URL);
		log("loading: "+a[1]);
		load(a[1]);
	}
	
	//SET FROM PARAMS
	var reg = /#([a-z0-9"'(){}[\];.+\-_\!\?]*)\s?=\s?([a-z0-9"'(){}[\];.+\-_\!\?]+)\$/ig;
	if (reg.test(document.URL))
	{
		var reg = /#([a-z0-9"'(){}[\];.+\-_\!\?]*)\s?=\s?([a-z0-9"'(){}[\];.+\-_\!\?]+)\$/ig;
		var a = matchAll(document.URL,reg);
		for (var i = 0;i<a.length;i++)
		{
			eval(a[i][0] + " = "+a[i][1]);
		}
	}
}

function game_update()
{
	
	//SELECT SOCKET
	if (document.activeElement == document.body && mouse.left == 2){
		for(var n in gameC.nodes){
			//GET NODE
			var node = gameC.nodes[n];
			for (var s in node.sockets)
			{
				//GET SOCKET
				var socket = node.sockets[s];
				
				//IS THE MOUSE ON IT?
				var sx = node.position.x+socket.position.x;sx -= 8;
				var sy = node.position.y+socket.position.y;sy += 16;
				if ((mouse.x >= sx && mouse.x <= ((sx) + 32)) && (mouse.y >= sy && mouse.y <= ((sy)+32)))
				{
					//SET, DISCONNECT OR CONNECT?
					if (gameC.selectedSocket == undefined)
					{
						//SET
						gameC.selectedSocket = socket;
					}
					else 
					{
						if (gameC.selectedSocket != undefined){
							//CONNECT
							log((socket.input ? "input" : "output") + ":"+(gameC.selectedSocket.input ? "input" : "output"));
							if (socket.input != gameC.selectedSocket.input)
							{
								if (containsElement(gameC.selectedSocket.connections,socket) || gameC.selectedSocket.owner != socket.owner)
								{	
									gameC.selectedSocket.connect(socket);
									if (!muted){ConnectedSound.play();gameC.selectedSocket = undefined;}
								}
								else
								{
									log("already connected or connection to self");
									if (!muted){ErrorSound.play();gameC.selectedSocket = undefined;}
								}
								if (gameC.selectedSocket != undefined){
									gameC.selectedSocket.owner.updateValue();
									socket.owner.updateValue();
								}
							}
							else
							{
								log("can't connect two " + (socket.input ? "input" : "output") + "s together");if (!muted){ErrorSound.play();gameC.selectedSocket = undefined;}
							}
						}
					}
				}
			}
		}
	}
	
	//DISCONNECT
	if (document.activeElement.id !="value" && getKeyPressed("e") && document.activeElement == document.body){
		for(var n in gameC.nodes){
			//GET NODE
			var node = gameC.nodes[n];
			for (var s in node.sockets)
			{
				//GET SOCKET
				var socket = node.sockets[s];
				
				//IS THE MOUSE ON IT?
				var sx = node.position.x+socket.position.x;sx -= 8;
				var sy = node.position.y+socket.position.y;sy += 16;
				if ((mouse.x >= sx && mouse.x <= ((sx) + 32)) && (mouse.y >= sy && mouse.y <= ((sy)+32)))
				{
					//DISCONNECT THEM FROM US
					for (var c in socket.connections)
					{
						removeA(socket.connections[c].connections,socket);
					}
					
					//DISCONNECT US FROM EVERYONE
					socket.connections = new Array();
					socket.parent = undefined;
				}
			}
		}
	}
	
	//UNSELECT
	if (document.activeElement.id !="value" && document.activeElement.id !="stage" && getKey("e") == 1 && gameC.selectedSocket != undefined && document.activeElement == document.body)
	{
		gameC.selectedSocket = undefined;
	}
	
	//DRAG NODES
	if (document.activeElement == document.body)
	{
		for(var n in gameC.nodes){
			//GET NODE
			var node = gameC.nodes[n];
			if (gameC.nodeBeingDragged == "none" && mouse.left>0 && mouse.x >= node.position.x && mouse.x <= (node.position.x + node.size.x) && mouse.y >= node.position.y && mouse.y <= (node.position.y+node.size.y))
			{
				//SET DRAG
				gameC.nodeBeingDragged = node;
				gameC.nodeDragOffset = new Vector2(mouse.x-node.position.x,mouse.y-node.position.y);
			}
		}
	}
	
	if (gameC.nodeBeingDragged != "none"){
		if (mouse.left == 0){gameC.nodeBeingDragged = "none";}
		gameC.nodeBeingDragged.position = new Vector2(mouse.x-gameC.nodeDragOffset.x,mouse.y-gameC.nodeDragOffset.y);
	}
	
	
	//CREATE NODE
	if (mouse.right == 2){
		log("CREATE NODE!");
		var n = new Node(mouse.x-100,mouse.y-100,200,200);
		n.setType(document.getElementById("CreateType").value);
		n.stage = document.getElementById("stage").value + "";
		if (!containsElement(gameC.stages,n.stage)){gameC.stages.push(n.stage);}
		gameC.nodes.push(n);
		if (!muted){CreateSound.play();}
	}

	if (getKeyPressed("r") && gameC.selectedSocket != undefined && document.activeElement == document.body)
	{
		log("SET");
		gameC.selectedSocket.value = document.getElementById("value").value;
	}
	
	//DELETE NODE
	if (getKeyPressed("d") && document.activeElement == document.body)
	{
		for(var n in gameC.nodes){
			//GET NODE
			var node = gameC.nodes[n];
			if (mouse.x >= node.position.x && mouse.x <= (node.position.x + node.size.x) && mouse.y >= node.position.y && mouse.y <= (node.position.y+node.size.y))
			{
				//DELETE
				for(var s in node.sockets){var socket = node.sockets[s];for (var c in socket.connections){removeA(socket.connections[c].connections,socket);}}
				node.sockets = new Array();
				removeA(gameC.nodes,node);
				if (!muted){DeleteSound.play();}
			}
		}
	}
	
	//UPDATE ALL
	for(var n in gameC.nodes){
		//GET NODE
		var node = gameC.nodes[n];
		
		//UPDATE IT
		node.updateValue();
	}

	
	//ENABLE OR DISABLE VALUE FIELD
	document.getElementById("value").disabled = !((document.getElementById("CreateType").value == "Value") || (gameC.selectedSocket != undefined && gameC.selectedSocket != undefined));
	
	//SHOW SOCKET VALUES?
	gameC.showNodeValues = document.getElementById("showValues").checked;
	
	//MUTED?
	muted = document.getElementById("muted").checked;
}

function game_draw(ctx,game){
	
	//PAN
	if (getKey(" ") && document.activeElement == document.body)
	{
		var spd = 1;
		gameC.movePos(ctx,(mouse.nx-gameC.prevMPos.x)*spd,(mouse.ny-gameC.prevMPos.y)*spd);
		document.body.style.cursor = 'move';
	}
	else
	{
		document.body.style.cursor = 'auto';
	}
	//UPDATE PREVIOUS MOUSE POS
	gameC.prevMPos.x = mouse.nx;
	gameC.prevMPos.y = mouse.ny;

	//UPDATE GAME
	game_update();
	
	//SET FONT
	ctx.font="30px Courier New";
	ctx.textAlign="center"; 
	ctx.textBaseline="middle"; 
	
	//DRAW GAME!
	for(var n in gameC.nodes){
		//GET NODE
		var node = gameC.nodes[n];
		
		//DRAW NODE RECT
		ctx.fillStyle = "#2E2E2E";
		ctx.fillRect(node.position.x,node.position.y,node.size.x,node.size.y);
		
		//DRAW NODE LABEL
		ctx.fillStyle = "#FFFFFF";
		if (node.type == "Value")
		{
			ctx.fillText(node.label,node.position.x+(node.size.x/3),node.position.y+(node.size.y/2));
		}
		else
		{
			ctx.fillText(node.label,node.position.x+(node.size.x/2),node.position.y+(node.size.y/2));
		}
		
		//DRAW NODE STAGE NUMBER
		ctx.textAlign="left"; 
		ctx.textBaseline="top";
		ctx.font="15px Courier New";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("#"+node.stage,node.position.x,node.position.y);
		ctx.textAlign="center"; 
		ctx.textBaseline="middle";
		ctx.font="30px Courier New";
		
		//DRAW NODE'S SOCKETS
		for (var s in node.sockets)
		{
			//GET NODE
			var socket = node.sockets[s];
			var sx = node.position.x+socket.position.x;
			var sy = node.position.y+socket.position.y;
			
			//DRAW NODE CONNECTIONS
			for (var c in socket.connections)
			{
				//GET CONNECTED NODE
				var conSock = socket.connections[c];
				//DRAWLINE
				ctx.strokeStyle = "#5D5D5D";
				ctx.lineWidth = 5;
				ctx.beginPath();
				var csx = conSock.position.x+conSock.owner.position.x;
				var csy = conSock.position.y+conSock.owner.position.y;
				ctx.moveTo(sx,sy);
				if (sx == csx || sy == csy || gameC.straightLines)
				{
					ctx.lineTo(csx,csy);
				}
				else
				{
					ctx.lineTo((csx+sx)/2,sy);
					ctx.lineTo((csx+sx)/2,csy);
					ctx.lineTo(csx,csy);
				}
                ctx.stroke();
			}
			
			//DRAW SOCKET RECT
			ctx.fillStyle = "#4D4D4D";
			if (gameC.selectedSocket == socket){ctx.fillStyle = "#FFFFFF";}
			ctx.fillRect(sx-(16),sy-(16),32,32);
			
			//DRAW SOCKET VAL
			if (node.type == "Value" || gameC.showNodeValues)
			{
				ctx.fillStyle = "#FFFFFF";
				ctx.fillText(socket.value.toString().substring(0,5) + ((socket.value.toString().length > 5) ? "..." : ""),sx,sy)
			}
		}
	}
}

function exportScript()
{	
	var e = "";
	for (var j = 0;j < gameC.stages.length;j++)
	{
		var i = gameC.stages[j];
		var d = "";
		var has = false;
		var has1 = false;
		for(var n in gameC.nodes){
			var node = gameC.nodes[n];
			if (node.stage == i)
			{
				has = true;
				if (node.stage == 1){has1 = true;}
				if (node.type == "Hex")
				{
					d += "return hex( ";
					d += node.sockets[0].connections[0].owner.getJsString();
					d += ", ";
					d += node.sockets[1].connections[0].owner.getJsString();
					d += " );";
				}
				
				if (node.type == "Set")
				{
					d += node.sockets[0].connections[0].owner.getJsString();
					d += " = ";
					d += node.sockets[1].connections[0].owner.getJsString();
					d += ";\n";
				}
				
				if (node.type == "Do" && node.sockets[1].connections.length == 0)
				{
					if (!isNaN(node.sockets[0].connections[0].owner.getJsString())){d += "stage";}
					d += node.sockets[0].connections[0].owner.getJsString();
					d += "();";
				}
				
				if (node.type == "If" && node.sockets[2].connections.length == 0)
				{
					d += "if (";
					d += node.sockets[0].connections[0].owner.getJsString();
					d += ") {";
					if (!isNaN(node.sockets[1].connections[0].owner.getJsString())){d += "stage";}
					d += node.sockets[1].connections[0].owner.getJsString();
					d += "(); ";
					d += "};";
				}
				
				if (node.type == "Return")
				{
					d += "return ";
					d += node.sockets[0].connections[0].owner.getJsString();
					d += ";";
				}
			}
		}
		
		
		var add = "";
		if (!isNaN(i)){add = "stage";}
		if (has){e += "function "+add+i+"(arg1,arg2){\n   "+d+"\n}\n";}
		if (gameC.stages.length == 1){e = d;}
	}
if (has1 && !gameC.stages.length == 1){e += "\nstage1();";}
prompt("PASTE THIS INTO A TEXT EDITOR: ",e);
}