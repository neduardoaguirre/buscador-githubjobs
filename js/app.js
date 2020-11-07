const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', validarBusqueda);
});

function validarBusqueda(e) {
    e.preventDefault();
    const busqueda = document.querySelector('#busqueda').value;
    if (busqueda === '') {
        mostrarAlerta('Agregue un término de búsqueda');
        return;
    }
    consultarAPI(busqueda)
}

async function consultarAPI(busqueda) {
    const githubUrl = `https://jobs.github.com/positions.json?search=${busqueda}`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(githubUrl)}`;
    spinner();
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarAvisos(JSON.parse(resultado.contents));
    } catch (error) {
        console.error(error);
    }
}

function mostrarAvisos(avisos) {
    limpiarHTML();
    if (avisos.length > 0) {
        resultado.classList.add('grid', 'items-center');
        avisos.forEach(aviso => {
            const {
                company,
                title,
                type,
                url
            } = aviso;
            resultado.innerHTML +=
                `<div class="shadow bg-white p-6 rounded">
                    <h2 class="text-2xl font-light mb-4">${title}</h2>
                    <p class="font-bold uppercase">Empresa: <span class="font-light normal-case">${company}</span></p>
                    <p class="font-bold uppercase">Tipo de Contrato: <span class="font-light normal-case">${type}</span></p>
                    <a class="bg-green-500 max-w-lg mx-auto mt-3 rounded p-2 block uppercase font-xl font-bold text-white text-center hover:bg-orange-500" href="${url}" target="_blank" rel="noopener noreferrer">Ver Aviso</a>
                </div>`;
        });
    } else {
        mostrarAlerta('No hay avisos, intenta con otro término de búsqueda');
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarAlerta(msj) {
    const existeAlerta = document.querySelector('.alerta');
    if (!existeAlerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-700', 'mt-3', 'p-3', 'text-center', 'text-white', 'rounded', 'max-w-lg', 'mx-auto', 'alerta');
        alerta.textContent = msj;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function spinner() {
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `<div class="spinner">`;
    resultado.classList.remove('grid');
    resultado.appendChild(spinner);
}