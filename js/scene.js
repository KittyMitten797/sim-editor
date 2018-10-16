// definitions for jsPlumb
// this is the paint style for the connecting lines..
var connectorPaintStyle = {
		strokeWidth: 1,
		stroke: "#61B7CF",
		joinstyle: "round",
		outlineStroke: "white",
		outlineWidth: 2
	},
// .. and this is the hover style.
	connectorHoverStyle = {
		strokeWidth: 3,
		stroke: "#216477",
		outlineWidth: 5,
		outlineStroke: "white"
	},
	endpointHoverStyle = {
		fill: "#216477",
		stroke: "#216477"
	},
// the definition of source endpoints (the small blue ones)
	sourceEndpoint = {
//		endpoint: "Dot",
		paintStyle: {
			stroke: "#7AB02C",
			fill: "transparent",
			radius: 7,
			strokeWidth: 1
		},
		isSource: true,
		connector: [ "Flowchart", { stub: [50, 50], midpoint: 0.7, gap: 10, cornerRadius: 10, alwaysRespectStubs: true } ],
		connectorStyle: connectorPaintStyle,
		hoverPaintStyle: endpointHoverStyle,
		connectorHoverStyle: connectorHoverStyle,
		dragOptions: {},
		overlays: [
			[ "Label", {
				location: [0.5, 1.5],
				label: "Drag",
				cssClass: "endpointSourceLabel",
				visible:false
			} ]
		]
	},
// the definition of target endpoints (will appear when the user drags a connection)
	targetEndpoint = {
		endpoint: ["Image", {src: './images/arrow_down.png'}],
//		paintStyle: { fill: "#7AB02C", radius: 7 },
		hoverPaintStyle: endpointHoverStyle,
		maxConnections: -1,
		dropOptions: { hoverClass: "hover", activeClass: "active" },
		isTarget: true,
		overlays: [
			[ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
		]
	},
	initConnectionLabel = function (connection) {
		connection.getOverlay("label").setLabel('Scene ' + connection.sourceId.split('-').pop() + " to " + 'Scene ' + connection.targetId.split('-').pop());
		connection.getOverlay("label").setLocation(connection.getParameter("location"));
	};

var scene = {
	lastSceneID: 0,	// id of last scene added to canvas
	
	currentSceneTitle: '',
	
	sceneRecords: [],
	
	init: function() {
		this.addNextScene();
	},
		
	addNextScene: function() {
		// are we initializing?
		this.currentSceneTitle = 'Scene ' + this.lastSceneID;
		var sceneID = 'scene-' + this.lastSceneID;
		if(this.lastSceneID == 0) {
			this.currentSceneTitle = 'Init';
			$('#canvas').append('<div class="window jtk-node" id="'+ sceneID + '">' + 
									'<strong>' + this.currentSceneTitle + '</strong>' + 
									'<img title="Edit Scene" class="scene-edit scene-button" src="' + BROWSER_IMAGES + 'edit.png" onclick="scene.editScene(\'' + sceneID + '\');" />' + 
								'</div>');
		} else {
			$('#canvas').append('<div class="window jtk-node" id="'+ sceneID + '">' + 
									'<strong>' + this.currentSceneTitle + '</strong>' + 
									'<img title="Delete Scene" class="scene-delete scene-button" src="' + BROWSER_IMAGES + 'delete.png" onclick="scene.deleteScene(\'' + sceneID + '\');" />' + 
									'<img title="Edit Scene" class="scene-edit scene-button" src="' + BROWSER_IMAGES + 'edit.png" onclick="scene.editScene(\'' + sceneID + '\');" />' + 
								'</div>');
		}
		
		// position new div
		$('#scene-' + this.lastSceneID).css({
			"top": "10px",
			"left": "10px"
		});
		
		// log information about scene
		scene.sceneRecords[scene.lastSceneID] = {};
		scene.sceneRecords[scene.lastSceneID].id = scene.lastSceneID;
		scene.sceneRecords[scene.lastSceneID].title = scene.currentSceneTitle;
		
		// track whch endpoints have been used
		scene.sceneRecords[scene.lastSceneID].sources = [false, false, false, false, false, false, false, false, false];
		
		// register new scene with jsPlumb
		// add endpoints to new container
		// suspend drawing and initialise.
		window.jsp.unbind();
		window.jsp.batch(function () {
			scene.addSourceEndPoint(scene.lastSceneID);
							
			// add target endpoint
			var targetUUID = 'scene-' + scene.lastSceneID + '-0-' + 'target';
			window.jsp.addEndpoint("scene-" + scene.lastSceneID, targetEndpoint, { anchor: "TopCenter", uuid: targetUUID });

			// set draggable
			window.jsp.draggable(jsPlumb.getSelector("#" + sceneID), { grid: [20, 20], cursor: "crosshair" });
		
			//
			// listen for clicks on connections, and offer to delete connections on click.
			//
			window.jsp.bind("click", function (conn, originalEvent) {
console.log(conn.getOverlay("label").getLabel());
console.log(conn.getParameters());
			});

			// add endpoint click
			window.jsp.bind("endpointClick", function(endpoint, originalEvent) {
alert("Endpoint clicked!");
console.log(endpoint.getParameters());
console.log(endpoint.getUuid());
			});
        
			// listen for new connections; initialise them the same way we initialise the connections at startup.
			window.jsp.bind("connection", function (connInfo, originalEvent) {
				initConnectionLabel(connInfo.connection);
console.log('connInfo:');
console.log(connInfo.sourceId);
				var _thisSceneID = connInfo.sourceId.split('-').pop();
				scene.addSourceEndPoint(_thisSceneID);				
			});
			
			// listen for new connections disconnect
			window.jsp.bind("connectionDetached", function (connInfo, originalEvent) {
				// get endpoints for element, if greater than 2 then delete endpoint,
				// else leave endpoint alone
				// add in sceneID
console.log(connInfo);
				if(window.jsp.getEndpoints($('#' + connInfo.sourceEndpoint.elementId)).length > 2) {
					var sourceSceneID = connInfo.sourceId.split('-').pop();
					scene.sceneRecords[sourceSceneID].sources[connInfo.sourceEndpoint.getParameter('sourceIndex')] = false;
console.log(connInfo.sourceEndpoint.getParameter('source'));
					setTimeout(function() {
						window.jsp.deleteEndpoint(connInfo.sourceEndpoint.getParameter('source'));
					}, 500);
				}

			});

		}); // end of batch processing
	
		// increment scene number
		scene.lastSceneID++;
	},	// end of addNextScene()
	
	
	
	addSourceEndPoint: function (sceneID) {
		// get next available source anchor
		for(i = 0; i < scene.sceneRecords[sceneID].sources.length; i++) {
			if(scene.sceneRecords[sceneID].sources[i] === false) {
				scene.sceneRecords[sceneID].sources[i] = true;
				break;
			}
		}
		
		var sourceUUID = 'scene-' + sceneID + '-' + i + '-' + 'source';
		window.jsp.addEndpoint("scene-" + sceneID, sourceEndpoint, {
			endpoint: ["Image", {src: sourceAnchorsPos[i][2]}], 
								anchor: sourceAnchorsPos[i][0],
								uuid: sourceUUID, 
								parameters: {"source": sourceUUID, 
											"location": sourceAnchorsPos[i][1], 
											"sourceIndex": i
											}
		});
console.log('addSourceEndpoint: ');
var endpointObj = window.jsp.getEndpoints($('#scene-' + sceneID));
console.log(endpointObj.length);
console.log(endpointObj);
console.log(window.jsp.getConnections($('#scene-' + sceneID)));

	},
	
	deleteAllConnections: function() {
		window.jsp.detachEveryConnection();
		// cleanup connection records in sceneRecord
	},
	
	deleteScene: function(sceneID) {
		if(confirm("Are you sure you want to delete this scene?")) {
			window.jsp.deleteEndpoint(sceneID + '-0-source');
			window.jsp.deleteEndpoint(sceneID + '-1-source');
			window.jsp.deleteEndpoint(sceneID + '-2-source');
			window.jsp.deleteEndpoint(sceneID + '-3-source');
			window.jsp.deleteEndpoint(sceneID + '-4-source');
			window.jsp.deleteEndpoint(sceneID + '-5-source');
			window.jsp.deleteEndpoint(sceneID + '-6-source');
			window.jsp.deleteEndpoint(sceneID + '-7-source');
			window.jsp.deleteEndpoint(sceneID + '-8-source');
			window.jsp.deleteEndpoint(sceneID + '-0-target');
			window.jsp.deleteEndpoint(sceneID + '-1-target');
			window.jsp.deleteEndpoint(sceneID + '-2-target');
			$('#' + sceneID).remove();
			scene.sceneRecords.splice(sceneID.split('-').pop(), 1);
			
			// delete sceneRecord entry
		}
	},
	
	editScene: function(sceneID) {
		$('#test-params').position({
			my: "right",
			at: "right",
			of: $('#' + sceneID)
		});
	}
};

// list of source and target anchors 
var sourceAnchorsPos = new Array(
	[[0.5, 1, 0, 1, 0, 0], 0.1, './images/arrow_down.png'],
	[[0.5, 1, 0, 1, 30, 0], 0.3, './images/arrow_down.png'],
	[[0.5, 1, 0, 1, -30, 0], 0.7, './images/arrow_down.png'],
	[[0.0, 0.5, -1, 0, 0, 0], 0.1, './images/arrow_left.png'],
	[[0.0, 0.5, -1, 0, 0, 30], 0.3, './images/arrow_left.png'],
	[[0.0, 0.5, -1, 0, 0, -30], 0.7, './images/arrow_left.png'],
	[[1, 0.5, 1, 0, 0, 0], 0.1, './images/arrow_right.png'],
	[[1, 0.5, 1, 0, 0, 30], 0.3, './images/arrow_right.png'],
	[[1, 0.5, 1, 0, 0, -30], 0.7, './images/arrow_right.png']
);

jsPlumb.ready(function () {
    instance = window.jsp = jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'crosshair', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW1",
                events:{
                    click:function() { alert("you clicked on the arrow1 overlay")}
                }
            } ],
            [ "Arrow", {
                location: 0,
                visible:true,
                width:11,
                length:11,
                id:"ARROW2",
                events:{
                    click:function() { alert("you clicked on the arrow2 overlay")}
                }
            } ],
            [ "Label", {
                location: 0.1,
                id: "label",
                cssClass: "aLabel",
                events:{
                    click:function() { alert("hey"); }
                }
            }]
        ],
       Container: "canvas"
    });
	
	scene.init();
});