const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);

    // if ('loading' in HTMLImageElement.prototype) {
    //     console.log('El navegador soporta `lazy-loading`...');
    // } else {
    //     console.log('`lazy-loading` no soportado...');
    // }
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded',
            'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class = "font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    const key = '14941369-b02c14bbaa4405a089053865c';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

// Generador que va a registrar la cantidade elementos de acuerdo a la paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    console.log(imagenes);

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y contruir el HTML

    imagenes.forEach(imagen => {
        const { webformatURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="cards w-1/2 md:w-1/3 lf:w-1/4 p-3 mb-4">
                <div class="bg-white rounded-lg shadow-xl">
                    <img loading="lazy" class="w-full rounded-t-lg" src="${webformatURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-medium text-blue-800">Me Gusta</span> </p>
                        <p class="font-bold">${views} <span class="font-normal">Veces Vista</span> </p>

                        <a 
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                        href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `
    });

    // Limpiar el paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    // Generamos un nuevo HTML
    imprimirPaginador();

}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next();
        if (done) return;

        // Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#'
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-5', 'rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}