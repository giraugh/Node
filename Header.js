//HEADER, CUSTOM CLASS DEFINITIONS ETC

//REGEXP FUNCTION
function matchAll(str, regex) {
    var res = [];
    var m;
    if (regex.global) {
        while (m = regex.exec(str)) {
            res.push([m[1],m[2]]);
        }
    } else {
        if (m = regex.exec(str)) {
            res.push([m[1],m[2]]);
        }
    }
    return res;
}


function sign(x){
	if (x > 0){return 1;}
	if (x < 0){return -1;}
	return x;
}

function deg(r) {
  return r * 180 / Math.PI;
};

function rad(d) {
  return d * Math.PI / 180;
};

function getDir(x1,y1,x2,y2){
	var xd = x2-x1;
	var yd = y2-y1;
	var theta = Math.atan2(yd,xd);
	if (theta < 0){theta += 2*Math.PI}
	return 360-deg(theta);
}

function getCardinal(dir){
	return new Vector2(-Math.cos(rad(dir)),Math.sin(rad(dir)));
}

function containsElement(arr,obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function log(x) {
	console.log(x);
}

class Vector2 {
	constructor (x,y){
		this.x = x;
		this.y = y;
	}
}

class Vector3 extends Vector2 {
	constructor(x,y,z) {
		super(x,y);
		this.z = z;
	}
}

class Shape {
	constructor(x, y, width, height){
		this.position = new Vector2(x,y);
		this.size = new Vector2(width,height);
	}
}

class Socket extends Shape {
	constructor(x,y){
		super(x,y,32,32);
		this.value = 0;
		this.connections = new Array();
		this.owner = undefined;
		this.input = false;
	}
	
	connect(s){
		this.connections.push(s);
		s.connections.push(this);
	}
}

class NodeMethods {
	static addSocket(x,y) {
		var sock = new Socket(x,y);
		sock.owner = this;
		this.sockets.push(sock);
	}
	
	static addSocketInput(x,y){
		var sock = new Socket(x,y);
		sock.owner = this;
		sock.input = true;
		this.sockets.push(sock);
	}
	
	static setType(x) {
		this.type = x;
		this.label = x;
		
		if (this.type == "Add" || this.type == "Subtract" || this.type == "Multiply" || this.type == "Divide" || this.type == "If" || this.type == "Larger" || this.type=="Equal")
		{
			this.sockets = new Array();
			this.addSocketInput(0,this.size.y/3);
			this.addSocketInput(0,this.size.y*0.75);
			this.addSocket(this.size.x,this.size.y/2);
		}
		
		if (this.type == "Pass" || this.type == "Random" || this.type == "Get" || this.type == "Calculate" || this.type == "Do" || this.type == "Not")
		{
			this.sockets = new Array();
			this.addSocketInput(0,this.size.y/2);
			this.addSocket(this.size.x,this.size.y/2);
		}
		
		if (this.type == "Value")
		{
			this.sockets = new Array();
			this.addSocket(this.size.x,this.size.y/2);
			var val = document.getElementById("value").value;
			if (!isNaN(val)){val = parseFloat(val);}
			this.sockets[0].value = val;
		}
		
		if (this.type == "Hex" || this.type == "Set")
		{
			this.sockets = new Array();
			this.addSocketInput(0,this.size.y/3);
			this.addSocketInput(0,this.size.y*.75);
		}
		
		if (this.type == "Return")
		{
			this.sockets = new Array();
			this.addSocketInput(0,this.size.y/2);
		}
	}
	
	static getJsString() {
		var type = this.type;
		var socket = this.sockets;
		if (type == "Pass" && socket[0].connections.length > 0)
		{
			return socket[0].connections[0].owner.getJsString();
		}
		
		if (type == "Calculate" && socket[0].connections.length > 0)
		{
			return socket[0].connections[0].value;
		}
		
		if (type == "Add" && socket[0].connections.length > 0 && socket[1].connections.length > 0)
		{
			return "( "+socket[0].connections[0].owner.getJsString()+" + "+socket[1].connections[0].owner.getJsString()+" )";
		}
		
		if (type == "Subtract" && socket[0].connections.length > 0 && socket[1].connections.length > 0)
		{
			return "( "+socket[0].connections[0].owner.getJsString()+" - "+socket[1].connections[0].owner.getJsString()+" )";
		}
		
		if (type == "Multiply" && socket[0].connections.length > 0 && socket[1].connections.length > 0)
		{
			return "( "+socket[0].connections[0].owner.getJsString()+" * "+socket[1].connections[0].owner.getJsString()+" )";
		}
		
		if (type == "Divide" && socket[0].connections.length > 0 && socket[1].connections.length > 0)
		{
			return "( "+socket[0].connections[0].owner.getJsString()+" / "+socket[1].connections[0].owner.getJsString()+" )";
		}
		
		if (type == "Random" && socket[0].connections.length > 0)
		{
			return "rnd( "+socket[0].connections[0].owner.getJsString()+" )";
		}
		
		if (type == "Get" && socket[0].connections.length > 0)
		{
			return socket[0].connections[0].value;
		}
		
		if (type == "Value")
		{
			return socket[0].value;
		}
		
		if (type == "Do")
		{
			var add = "";
			if (!isNaN(socket[0].connections[0].owner.getJsString()))
			{
				add = "stage";
			}
			return add+socket[0].connections[0].owner.getJsString()+"()";
		}
		
		if (type == "If")
		{
			if (!isNaN(node.sockets[0].connections[0].owner.getJsString())){var add = "stage";}else{var add = "";}
			return "if ("+socket[0].connections[0].owner.getJsString()+"){"+add+socket[1].value+"();"+"};";
		}
		
		if (type == "Larger")
		{
			return "("+socket[0].connections[0].owner.getJsString()+">"+socket[1].connections[0].owner.getJsString()+")";
		}
		
		if (type == "Equal")
		{
			return "("+socket[0].connections[0].owner.getJsString()+"=="+socket[1].connections[0].owner.getJsString()+")";
		}
		
		if (type == "Not")
		{
			return "!("+socket[0].connections[0].owner.getJsString()+")";
		}
		
		return "/*ERROR*/";
	}
	
	static updateValue() {
		//UPDATE SOCKET VALUES
		for (var s in this.sockets)
		{
			var socket = this.sockets[s];
			if (socket.input)
			{
				if (socket.connections.length > 0)
				{
					socket.value = socket.connections[0].value;
				}
			}
		}
		
		if (this.type == "Pass" || this.type == "Calculate")
		{
			//GET 1ST VAR FROM 1st SOCKET AND SET OUT
			this.sockets[1].value = this.sockets[0].value;
		}
		
		if (this.type == "Add")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			var v2 = this.sockets[1].value;
			this.sockets[2].value = v1+v2;
		}
		
		if (this.type == "Subtract")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			var v2 = this.sockets[1].value;
			this.sockets[2].value = v1-v2;
		}
		
		if (this.type == "Multiply")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			var v2 = this.sockets[1].value;
			this.sockets[2].value = v1*v2;
		}
		
		if (this.type == "Divide")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			var v2 = this.sockets[1].value;
			this.sockets[2].value = v1/v2;
		}
		
		if (this.type == "Random")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			this.sockets[1].value = Math.round(Math.random()*v1);
		}
		
		if (this.type == "Larger")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			var v2 = this.sockets[1].value;
			this.sockets[2].value = (v1 > v2) ? 1 : 0;
		}
		
		if (this.type == "Equal")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			var v2 = this.sockets[1].value;
			this.sockets[2].value = (v1 == v2) ? 1 : 0;
		}
		
		if (this.type == "Not")
		{
			//GET 1ST VAR FROM 1st SOCKET
			var v1 = this.sockets[0].value;
			this.sockets[1].value = (v1 == 1) ? 0 : 1;
		}
	}
}

class Node extends Shape {
	constructor(x, y, width, height){
		super(x,y,width,height);
		
		this.label = "";
		this.sockets = new Array();
		this.type = "Pass";
		this.stage = 0;
		
		//FUNCTIONS
		this.addSocket = NodeMethods.addSocket;
		this.addSocketInput = NodeMethods.addSocketInput;
		this.setType = NodeMethods.setType;
		this.getJsString = NodeMethods.getJsString;
		this.updateValue = NodeMethods.updateValue;
	}
}

class GameControl {
	constructor(){
		this.nodes = [];
		this.connections = [];
		this.nodeBeingDragged = "none";
		this.nodeDragOffset = new Vector2();
		this.selectedSocket = undefined;
		this.currentNodeType = "Pass";
		this.showNodeValues = false;
		this.position = new Vector2(0,0);
		this.stages = [];
		this.straightLines = false;
		this.prevMPos = new Vector2();
	}
	
	movePos(ctx,x,y)
	{
		this.position.x += x;
		this.position.y += y;
		ctx.translate(x,y);
	}
	
	setPos(ctx,x,y){
		var xd = this.position.x - x;
		var yd = this.position.y - y;
		this.movePos(ctx,xd,yd);
	}
}
