# ¿A dónde se van nuestros productos?
Objetivo: 
La finalidad de esta visualización es poder explorar y descubrir 
las rutas de los principales productos de exportación Colombianos. 
Desde los departamentos que las comercializan, hasta los países 
a los que llegan.

Instrucciones: 

Los puntos en la gráfica representan:
Departamentos en Colombia
Productos generados en Colombia
Países a los que exportamos los productos
Las líneas representan las rutas recorridas por los productos. 

El usuario puede hacer click sobre cualquier nodo, y 
dependiendo del tipo, se mostrará lo siguiente:
Si hizo click sobre un departamento, se muestran los productos que 
comercializan allí, y los países a los que se les vende. Si hizo 
click sobre un producto, se muestran todos los departamentos 
que los comercializan, y los países en donde terminan, y si hizo 
click sobre un país, se mostrará, todos los productos que reciben, 
y de que departamento proviene cada uno

WHAT
Los datos escogidos para la visualización provienen de una Tabla. El DataSet representa una Red, en donde se relacionan departamentos comercializadores de productos, los productos como tal, y los países hacia donde se exportan dichos productos.
Variables
Departamento: Categórica
Producto: Categórica
País: Categórica

WHY
Locate/Discover Path
Localizar o descubrir las rutas que hay para los productos que se producen o se comercializan en nuestro país.
Summarize Topology
Resumir la topología: Tener un panorama general de toda la topología de las exportaciones en Colombia
Identify Outliers
Identificar datos atípicos en las rutas de las exportaciones en Colombia.
Explore Feature
La visualización permite al usuario la exploración de datos a tráves de sus interacciones y de esta manera descubrir datos interesantes.

HOW
Marcas
Puntos: Para los departamentos, países y productos
Líneas: Para las relaciones de ruta, entre los departamentos, países y productos
Canales
Color Hue: Para los tipos de nodos, separar a los productos, departamentos y países
Align: los nodos tienen una alineación dependiendo el tipo
Separate: Los nodos se encuentran separados unos de otros
Manipulate
Select: El usuario puede seleccionar un nodo, y ver sus rutas
Facet
Partition: Los nodos se encuentran particionados por su tipo

Insights: 
Nuestros productos más vendidos son: El cacao, el maíz, las flores y el café
Outlier: Estamos vendiendo pescados a Curazao, siendo esta última una Isla
Estados Unidos nos compra todos los productos que producimos
El Valle del Cauca exporta unicamente aves y pescados

Tecnologías: 
D3 V4
JavaScript
Clarify Design
Este proyecto se publica bajo la licencia MIT


![alt text](https://i.imgur.com/427oSZP.png)

