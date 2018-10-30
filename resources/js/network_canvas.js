/* global d3 */

var datos;
var open_data = d3.csv("resources/data/data.csv");			//Leer el fichero
var canvas = d3.select("#network"); 						//Traer el canvas del HTML
var	width = canvas.attr("width"); 							//Obtengo el ancho del canvas
var height = canvas.attr("height"); 						//Obtengo el alto del canvas
var ctx = canvas.node().getContext("2d"); 					//Declarar el contexto del canvas
var r = 4; 													//Tamaño de los circulos

var simulation =d3.forceSimulation()    					//Varible que implementará el sistema de fuerzas de d3
    	.force("x", d3.forceX(width/2)) 					//Ubicar los nodos de x al centro
    	.force("y", d3.forceY(height/2))					//Ubicar los nodos de y al centro 
    	.force("collide", d3.forceCollide(r+2))				//Para que los nodos no queden unos encima de otros
    	.force("charge", d3.forceManyBody().strength(-20))	//Para que los nodos se separen (entre mas negativo, mas se separan)    	
		.force("link", d3.forceLink() 						//fuerza de enlaces
				.id(function (d) {return d.name})); 		//Le pongo esto para que use los nombres de los nodos y no se quede esperando una posición (esto para que acepte las cadenas como enlace, sino, d3 esperaria numeros, la posición de cada uno)


/*******************************MANIPULAR DATOS A PARTIR DEL  PROMISE **********************/
open_data.then(function(result) {
	
	//Generación y limpieza de datos
	datos = result;
	//datos = datos.slice(0,10);
	console.log(datos);
	var list = {'nodes' :[],'links' :[] };

	for (var i in datos){
		list.nodes.push({"name": datos[i]["DepartamentoOrigen"], "tipo": "departamento"},
                   {"name": datos[i]["PaisDestino"], "tipo": "pais"},
                   {"name": datos[i]["Producto"], "tipo": "producto"});

		list.links.push({"source":datos[i]["DepartamentoOrigen"], "target": datos[i]["Producto"], "to": datos[i]["PaisDestino"]},
				   {"source":datos[i]["Producto"], "target": datos[i]["PaisDestino"], "from": datos[i]["DepartamentoOrigen"]});
	}

	json = JSON.stringify(list);
	var graph = JSON.parse(json);

	simulation.nodes(graph.nodes); 			//Se le dice a la simulación cuales son los nodos
	simulation.force("link") 				//Devuelvame la fuerza de enlaces
			  .links(graph.links); 			//Y los datos que le voy a pasar son los que vienen en graph.links 
	simulation.on("tick", update)   		//Cuando en la simulación ocurra un tick - recargue todo   

	//Función actualice la red
	function update(){
		ctx.clearRect(0,0,width,height);	//Limpiar el espacio de dibujo

		ctx.beginPath(); 					//Crear un nuevo path 
		graph.links.forEach(drawLink); 		//Para cada enlace, se llama a la función que los dibuja
		ctx.stroke();						//Muestra los nodos en pantalla (bordes)

		ctx.beginPath(); 					//Crear un nuevo path 
		graph.nodes.forEach(drawNode); 		//Para cada nodo, se llama a la función que los dibuja
		ctx.fill();							//Muestra los nodos en pantalla (relleno)

	}


});   

/*******************************FINAL PROMISE **********************/


// Función que dibuje los nodos, recibe cada registro dentro de nodes
function drawNode (d) {
	ctx.moveTo(d.x, d.y); 				//En el contexto nos movemos a la posición x and y del nodo
	ctx.arc(d.x, d.y, r, 0, Math.PI*2); //Comando de arco para dibujar un circulo en la pos x y, y el radio nos da el tamaño de los circulos
}

// Función que dibuje los links, recibe cada link dentro del json
function drawLink (l) {
	ctx.moveTo(l.source.x, l.source.y); //Me muevo a la posición del nodo origen (x y)
	ctx.lineTo(l.target.x, l.target.y); //Dibujo una linea hasta el nodo destino
}
