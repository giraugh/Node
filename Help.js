/*
!DE BY EWAN BREAKEY - 2016

You create nodes and connect them to build a program.
Nodes are grouped in stages, stage 1 is called automatically.
The 'Do' And 'If' Nodes perform Stages.

TO CREATE A NODE:
	Select node type in top left, then right click to create node
	at your mouse point.

MOVE NODE:
	Click and drag a node with the left mouse to move it.
	
TO CONNECT NODE:
	Left click on Node socket (grey box) to select it, click on
	another to connect them.

TO DELETE NODE:
	Hover over node and press 'D' to delete it.

TO DISCONNECT NODE:
	Hover over node and press 'E' to disconnect it.
	
TO DESELECT NODE:
	Press 'E' when not on a socket to deselect.
	
THE 'VALUE' NODE:
	The Value node has the value set in the top left when created.

TO SET STAGE OF NODE:
	Node's stage are set when creating by changing the text box
	at the top.
	
*/



function showHelp()
{
	var help = [];
	var i = 0;
	help[i] = "!DE BY EWAN BREAKEY - 2016";i++;
	help[i] = "";i++;
	help[i] = "You create nodes and connect them to build a program.";i++;
	help[i] = "Nodes are grouped in stages, stage 1 is called automatically.";i++;
	help[i] = "The 'Do' And 'If' Nodes perform Stages.";i++;
	help[i] = "";i++;
	help[i] = "TO CREATE A NODE:";i++;
	help[i] = "    Select node type in top left, then right click to create node";i++;
	help[i] = "    at your mouse point.";i++;
	help[i] = "";i++;
	help[i] = "MOVE NODE:";i++;
	help[i] = "    Click and drag a node with the left mouse to move it.";i++;
	help[i] = "";i++;
	help[i] = "TO CONNECT NODE:";i++;
	help[i] = "    Left click on Node socket (grey box) to select it, click on";i++;
	help[i] = "    another to connect them.";i++;
	help[i] = "";i++;
	help[i] = "TO DELETE NODE:";i++;
	help[i] = "    Hover over node and press 'D' to delete it.";i++;
	help[i] = "";i++;
	help[i] = "TO DISCONNECT NODE:";i++;
	help[i] = "    Hover over node and press 'E' to disconnect it.";i++;
	help[i] = "";i++;
	help[i] = "TO DESELECT NODE:";i++;
	help[i] = "    Press 'E' when not on a socket to deselect.";i++;
	help[i] = "";i++;
	help[i] = "THE 'VALUE' NODE:";i++;
	help[i] = "    The Value node has the value set in the top left when created.";i++;
	help[i] = "";i++;
	help[i] = "TO SET STAGE OF NODE:";i++;
	help[i] = "    Node's stage are set when creating by changing the text box";i++;
	help[i] = "    at the top.";i++;

	var e = "";
	for (var n in help)
	{
		e += help[n] + "\n";
	}
	
	alert(e);
}