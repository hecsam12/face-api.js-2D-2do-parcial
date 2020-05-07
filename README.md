# Face-api.js

Face-api.js es una libreria usada para el reconocimiento de rostos en imagenes o videos, esta libreria se implementa puede ser implementada en una aplicación web o móvil.

Se agregaron filtros 2D, en ayuda con los landmarks para el posicionamiento de las imagenes en formato SVG, y a continuación se muestran algunos. 

![Filtro_1](https://user-images.githubusercontent.com/36305215/81250987-829c9400-8fdf-11ea-900f-077dc13f6e60.jpg)

![Filtro_2](https://user-images.githubusercontent.com/36305215/81251386-63eacd00-8fe0-11ea-8a25-911762f9283f.jpg)

![Filtro_5](https://user-images.githubusercontent.com/36305215/81251417-736a1600-8fe0-11ea-94ce-2f18f5536880.jpg)

![Filtro_11](https://user-images.githubusercontent.com/36305215/81251438-811f9b80-8fe0-11ea-82e3-851cf1a37864.jpg)

![Filtro_13](https://user-images.githubusercontent.com/36305215/81251450-8bda3080-8fe0-11ea-8b19-5380cc3bcbd2.jpg)

![Filtro_15](https://user-images.githubusercontent.com/36305215/81251468-972d5c00-8fe0-11ea-9fa5-b253f97d6659.jpg)

# Teconolgias usadas

1. [React js](https://es.reactjs.org/)
2. [Face-api.js documentación 1](https://justadudewhohacks.github.io/face-api.js) - [face-api.js documentacion 2](https://github.com/justadudewhohacks/face-api.js)
3. [React-redux](https://www.youtube.com/watch?v=HhtqSwUgP1U&t=1875s)
4. [Programacion funcional](https://medium.com/laboratoria-developers/introducci%C3%B3n-a-la-programaci%C3%B3n-funcional-en-javascript-parte-1-e0b1d0b2142e)

# ScrollBar

Para la implementación de los filtros en botones diferentes, se utilizo un ScrollBar, este componente se realizo con CSS implementando el siguiente codigo:

.scroll {
    height: 50px;
    width: 500px;
    background-color: gray;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
}

Este se importa en el index principal de FacePage, y se le incorporan etiquetas <button></button>, aplicando a cada uno los diferentes filtros con sus valores.

# Versiones

A continuación se muestra en la Tabla I el detalle de cada versión especificando el commit y su descripción de la funcionalidad incluida.

| No. | Commit | Descripción |
| ------ | ------ | ------ |
| 1 | b41f54af4f0abbba29be612a6390ae5099f23f34  | Carga del modelo y reconocimiento facial |
| 2 | f2d1707b9c1fb4f109d8a7056abe5fe111af77c1  | Reconocimiento de edad y sexo |
| 3 | 1f5fe62747d30048d442289f1495869eac1034b7  | Reconocimiento de emoticones  |
| 4 | 1f41fa0f818cb1f745cb0ebeb2bedbf40c2103fd  | Filtros en 2D aplicando platos de comida  |


# Sitios para descargar SVG

En los ejemplos de este repositorio se incluyen archivos SVG, estos han sido descargados del siguiente sitio:

1. [svg] https://www.flaticon.es/home
