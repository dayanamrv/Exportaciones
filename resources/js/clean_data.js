var datos;
var open_data = d3.csv("resources/data/ini_data.csv");
var new_data = []; var datos_agr= [];
open_data.then(function(result) {


	//Generación y limpieza de datos
	datos = result;
	//	datos = datos.slice(0,20);

	//Reduce para agrupar sumatoria de datos
	var groupBy = function (miarray, prop) {
	    return miarray.reduce(function(groups, item) {
	    	
	        var val = item.Anio + '|' + 
	                  item.Mes + '|' + 
	                  item.DepartamentoOrigen + '|' + 
	                  item.PaisDestino + '|' +
	                  item.Producto;
	        groups[val] = groups[val] || {anio: item.Anio, 
	        							  mes: item.Mes, 
	        							  origen: item.DepartamentoOrigen, 
	        							  destino: item.PaisDestino, 
	        							  producto: item.Producto,
	        							  VolumenToneladas: 0, 
	        							  ValorMilesFOBDol: 0};
	        groups[val].VolumenToneladas += parseFloat(item.VolumenToneladas);
	        groups[val].ValorMilesFOBDol += parseFloat(item.ValorMilesFOBDol);
	        return groups;
	    }, {});
	}

	//Llamar al metodo que agrupa y totaliza
	datos_agr = groupBy(datos,'Anio');


	//Crear array de salida
	for (var i in datos_agr){

		new_data.push({"anio": datos_agr[i]["anio"], 
			           "mes": datos_agr[i]["mes"], 
			           "origen": datos_agr[i]["origen"],
					   "destino": datos_agr[i]["destino"],  
					   "producto": datos_agr[i]["producto"],
					   "toneladas": datos_agr[i]["VolumenToneladas"], 
					   "precio_dolares": datos_agr[i]["ValorMilesFOBDol"]});

	}

	//Convertir el array a json
	json = JSON.stringify(new_data);
	var json_data = JSON.parse(json);
	
	console.log(new_data);
	DownloadJSON2CSV(json_data);

});
	

function DownloadJSON2CSV(objArray)
{
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';

        for (var index in array[i]) {
            line += array[i][index] + ',';
        }
        line = line.substr(0, line.length-1);
        str += line + '\r\n';
    }

    window.open( "data:resources/data;charset=utf-8," + escape(str));
}