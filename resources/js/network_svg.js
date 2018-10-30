var datos;
var linkedByIndex = {};
var open_data = d3.csv("resources/data/data.csv");			//Leer el fichero
var svg = d3.select("#network"); 							//Traer el canvas del HTML
var	width =  svg.attr("width"); 							//Obtengo el ancho del canvas
var height = svg.attr("height"); 							//Obtengo el alto del canvas
var r = 4; 	
var node, graph, simulation;											

var types = d3.scaleOrdinal()
	.domain(["origen","producto","destino"])
	.range(["#9B56BB","#F52F22","#FF8400"]);

var typeLegend = d3.scaleOrdinal()
	.domain(["Dpto Origen","Producto","País Destino"])
	.range(["#9B56BB","#F52F22","#FF8400"]);

var tooltip = d3.select("body")
				.append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);

svg.on("click",click_event_svg);

 var legend = svg.selectAll(".legend")
    .data(typeLegend.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate( 380 ," + ((i+1)*20) + ")"; });
    var texto_legend = legend.append("text")
    .attr("x", 370 )
    .attr("y", 40)
    .attr("dy", ".20em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

    legend.append("rect")
    .attr("x", 380)
    .attr("y", 30)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function(d){
      return typeLegend(d)});


/**************************************** OBTENER LOS NODOS Y LINKS  **********************************/
function get_graph(data){
  var list = {'nodes' :[],'links' :[] };

  var index = 0;
  var nodes_duplicates = {};
  var links_duplicates = [];
  
  data.forEach(function(d,i,arr){
    
    if(typeof nodes_duplicates[d.origen] == "undefined"){

      list.nodes.push({"id":index, "name":d.origen, "type": "origen"});
      nodes_duplicates[d.origen] = index;
      index++;
    }

    if(typeof nodes_duplicates[d.producto] == "undefined"){

      list.nodes.push({"id":index , "name":d.producto, "type":"producto"});
      nodes_duplicates[d.producto] = index;
      index++;
    }

    if(typeof nodes_duplicates[d.destino] == "undefined"){

      list.nodes.push({"id":index , "name":d.destino, "type":"destino"});
      nodes_duplicates[d.destino] = index;
      index++;
    }

    if(!links_duplicates.includes(d.origen+"_"+d.producto)){
      list.links.push({"source":nodes_duplicates[d.origen], "target":nodes_duplicates[d.producto], "to": nodes_duplicates[d.destino]});
      links_duplicates.push(d.origen+"_"+d.producto);
      if(typeof tos[nodes_duplicates[d.origen]] == "undefined" ){
      	tos[nodes_duplicates[d.origen]]=[
      	{s:nodes_duplicates[d.producto],t:nodes_duplicates[d.destino]},
      	{s:nodes_duplicates[d.origen],t:nodes_duplicates[d.producto]}
      	]
      }else{
      	tos[nodes_duplicates[d.origen]].push({s:nodes_duplicates[d.producto],t:nodes_duplicates[d.destino]});
      	tos[nodes_duplicates[d.origen]].push({s:nodes_duplicates[d.origen],t:nodes_duplicates[d.producto]})
      }
    }

    if(!links_duplicates.includes(d.producto+"_"+d.destino)){
      list.links.push({"source":nodes_duplicates[d.producto], "target":nodes_duplicates[d.destino], "from": nodes_duplicates[d.origen]});
      links_duplicates.push(d.producto+"_"+d.destino);
      if(typeof tos[nodes_duplicates[d.destino]] == "undefined" ){
      	tos[nodes_duplicates[d.destino]]=[
      	{s:nodes_duplicates[d.producto],t:nodes_duplicates[d.destino]},
      	{s:nodes_duplicates[d.origen],t:nodes_duplicates[d.producto]}
      	]
      }else{
      	tos[nodes_duplicates[d.destino]].push({s:nodes_duplicates[d.producto],t:nodes_duplicates[d.destino]});
      	tos[nodes_duplicates[d.destino]].push({s:nodes_duplicates[d.origen],t:nodes_duplicates[d.producto]})
      }
    }

    
  });

  list.links.forEach((d) => {
    linkedByIndex[`${d.source},${d.target}`] = true;
    linkedByIndex[`${d.source},${d.to}`] = true;
    linkedByIndex[`${d.target},${d.from}`] = true;
  });

  return list;
}
var tos = {};
/**************************************** MANIPULAR DATOS A PARTIR DEL PROMISE  **********************************/
open_data.then(function(result) {

	datos = result;
	
	graph = get_graph(datos);

   simulation =d3.forceSimulation(graph.nodes)    			//Varible que implementará el sistema de fuerzas de d3
    	.force("x", d3.forceX(function (d){ 
    		if (d.type == "origen" ) { return -800; }
    		if (d.type == "producto" ) { return  0; }
    		if (d.type == "destino" ) { return 500; }
    	})) 					//Ubicar los nodos de x al centro
    	.force("y", d3.forceY())					//Ubicar los nodos de y al centro 
    	.force("collide", d3.forceCollide(r+2))				//Para que los nodos no queden unos encima de otros
    	.force("charge", d3.forceManyBody().strength(-100))	//Para que los nodos se separen (entre mas negativo, mas se separan)    	
		.force("link", d3.forceLink(graph.links).distance(200))//Le pongo esto para que use los nombres de los nodos y no se quede esperando una posición (esto para que acepte las cadenas como enlace, sino, d3 esperaria numeros, la posición de cada uno)
		.on("tick", ticked);

	var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	link = g.append("g").attr("stroke", "#000").attr("stroke-width", 1.5).selectAll(".link"),
	node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
	restart();


	restart();
});

/********************************************* PINTAR NODOS  ********************************************/
function restart() {

  // Apply the general update pattern to the nodes.
  node = node.data(graph.nodes, function(d) { return d.id;});

  node.exit().transition()
  .attr("r", 0)
  .remove();

  node = node.enter().append("circle")
  .attr("fill", function(d) { return types(d.type); })
  .call(function(node) { node.transition().attr("r", 6); })
  .merge(node);

  node
  .on('mouseover.tooltip', function(d) {
    tooltip.transition()
    .duration(300)
    .style("opacity", .95);
    tooltip.html(d.name+" - "+d.type )
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY + 10) + "px");
  })
  .on("mouseout.tooltip", function() {
    tooltip.transition()
    .duration(300)
    .style("opacity", 0);
  })
  .on("mousemove", function() {
    tooltip.style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY + 10) + "px");
  })
  .on("click", click_Event);

  node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  // Apply the general update pattern to the links.
  link = link.data(graph.links, function(d) { return d.source.id + "-" + d.target.id; });

  // Keep the exiting links connected to the moving remaining nodes.
  link.exit().transition()
  .attr("stroke-opacity", 0)
  .attrTween("x1", function(d) { return function() { return d.source.x; }; })
  .attrTween("x2", function(d) { return function() { return d.target.x; }; })
  .attrTween("y1", function(d) { return function() { return d.source.y; }; })
  .attrTween("y2", function(d) { return function() { return d.target.y; }; })
  .remove();

  link = link.enter().append("line")
  .call(function(link) { link.transition().attr("stroke-opacity", .1).attr("stroke", function(d) { return "grey"; })
    ; })
  .merge(link);

  // Update and restart the simulation.
  simulation.nodes(graph.nodes);
  simulation.force("link").links(graph.links);
  simulation.alpha(1).restart();
}


/********************************************* OTRAS FUNCIONES  ********************************************/
function ticked() {
  node.attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });
}

/******** Eventos del click  ***********/
function click_Event (d) {
  d3.event.stopPropagation();
  const circle = d3.select(this);

  node
  .transition(500)
  .style('opacity', o => {
    const isConnectedValue = isConnected(o, d);
    if (isConnectedValue ) {  return .9; } return 0.2
  })
  .style('fill-opacity', (o) => {
    const isConnectedValue = isConnected(o, d);
    if (isConnectedValue) { return .9; } return 0.2
  });

var tos_tmp = tos[d.id];
  console.log(d,tos_tmp)
  link
  .transition(500)
  .style('stroke-opacity', function(o){
  	if(typeof tos_tmp != "undefined"){
  	var esta = false;
  	tos_tmp.forEach(function (d1,i,a) {
  		console.log(o.source,o.target,d1)
  		if(o.source.id == d1.s && o.target.id == d1.t){
  			esta = true;
  		}
  	});
  	if(esta){
  		return 1;
  	} else{return 0.03}
  }else{
  	if(o.source === d || o.target  === d){
  		return 1;
  	}else{
  		return 0.03;
  	}
  }


  });//o => (o.source === d || o.target === d ? 1 : 0.03));
}

function isConnected(a, b) {
  return isConnectedAsTarget(a, b) || isConnectedAsSource(a, b) || a.index === b.index;
}

function isConnectedAsSource(a, b) {
  return linkedByIndex[`${a.index},${b.index}`];
}

function isConnectedAsTarget(a, b) {
  return linkedByIndex[`${b.index},${a.index}`];
}

function isEqual(a, b) {
  return a.index === b.index;
}

function click_event_svg() {
 console.log("SVGclickFunction")

 node
   .transition(500)
   .style('opacity',.9)
   .style('fill-opacity',.9);

 link
   .transition(500)
   .style("stroke-opacity", .1);

 console.log("SVGclickFunction22")
}

/*********** Eventos de arrastrar  *********************/
function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}