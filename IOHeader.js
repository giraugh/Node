//HEADER, CUSTOM CLASS DEFINITIONS FOR SAVING AND LOADING
/*REQUIRES cycle.js*/

//SAVE 'gameC'
function jsonify(val){
	return JSON.stringify(JSON.decycle(val));
}

function save(){
	var cyc = jsonify(gameC);
	return cyc;
}

function downloadSave(){
	download(prompt("ENTER FILENAME","save")+".nodes",window.btoa(save()));
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//SET GAMEC
function load(cyc){
	cyc = window.atob(cyc);
	var copy = JSON.retrocycle(JSON.parse(cyc));
	gameC = copy;
	for (var n in gameC.nodes)
	{
		var node = gameC.nodes[n];
		
		//FUNCTIONS
		node.addSocket = NodeMethods.addSocket;
		node.addSocketInput = NodeMethods.addSocketInput;
		node.setType = NodeMethods.setType;
		node.getJsString = NodeMethods.getJsString;
		node.updateValue = NodeMethods.updateValue;
	}
}