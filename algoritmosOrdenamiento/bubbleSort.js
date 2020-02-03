var max;
var min;
var cantidad;
var tiempo;
let spans = []
var numeros = []
var pasos = []
var indicePaso = 0;
var interval;
var offsetLefts = [];
var dif;
var ordenadoListo = false;
actualizarNumeros();



function actualizarNumeros() {
    numeros = []
    spans = []
    offsetLefts = []
    pasos = []
    indicePaso = 0;
    dif = undefined;
    ordenadoListo = false;
    max = Number(document.getElementById('max-input').value);
    min = Number(document.getElementById('min-input').value);
    cantidad = document.getElementById('cantidad-input').value;
    tiempo = Number(document.getElementById('time-input').value) * 1000;
    //console.log("max: ", max, "min: ", min)
    for (let i = 0; i < cantidad; i++) {
        numeros.push(Math.round((Math.random() * (max - min))) + min);
    }
    //numeros = [5, 8, 3, 1]
    poblarSpans();
}

function poblarSpans() {

    var contenedor = document.getElementById('contenedor-numeros');
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
    var order = 0;
    numeros.map(num => {
        var newSpan = document.createElement("span");
        newSpan.classList.add('numero');
        newSpan.style.display = 'inline-block';
        newSpan.style.paddingTop = '10px';
        //newSpan.style.transition = "1s all ease"
        let h = (100 * num) / max;
        let w = 0;
        if (numeros.length > 100) {
            w = Math.round(document.getElementById('contenedor-numeros').offsetWidth / numeros.length);
            newSpan.style.width = `${w}px`;
        } else {
            w = 100 / numeros.length;
            newSpan.style.width = `${String(w)}%`;
        }
        if (numeros.length <= 10) {
            newSpan.innerHTML = `${num}`
        }
        newSpan.style.height = `${String(h)}%`;
        newSpan.style.order = `${order}`
        newSpan.style.transition = 'transform 0.5s';
        order++;
        spans.push(newSpan)
        contenedor.appendChild(newSpan)
        offsetLefts.push(newSpan.offsetLeft);
    })
}

function bubbleSort() {
    pasos = []
    //console.log("Numeros sin ordenar: ", numeros)

    if (ordenadoListo) {
        console.log("ya esta ordenados");
        return;
    }

    if (numeros.length < 2) {
        return;
    }

    var indiceActualMenor = 0;
    var indiceActual = 1;
    var ordenados = false;
    var movimiento = false;
    var indiceOrdenado = numeros.length;

    while (!ordenados) {
        let paso = { anterior: indiceActualMenor, actual: indiceActual, swap: false, ordenado: false };
        if (numeros[indiceActualMenor] > numeros[indiceActual]) {
            movimiento = true;
            paso.swap = true;
            let tmp = numeros[indiceActualMenor];
            numeros[indiceActualMenor] = numeros[indiceActual];
            numeros[indiceActual] = tmp;
            //console.log("Actual: ", spans[indiceActual], "Anterior: ", spans[indiceActualMenor])
            // spans[indiceActual].style.order = String(indiceActualMenor);
            // spans[indiceActualMenor].style.order = String(indiceActual);
        }

        indiceActualMenor++;
        indiceActual++;

        if (indiceActual >= indiceOrdenado) {
            indiceOrdenado--;
            indiceActual = 1;
            indiceActualMenor = 0;
            paso.ordenado = true;


            if (movimiento == false) {
                //console.log('ORDENADOS')
                ordenados = true;
            }

            movimiento = false;
        }
        pasos.push(paso);
    }
    pasos.push({ anterior: 0, actual: 0, swap: false, ordenado: true });
    indicePaso = 0;
    //console.log("Numeros ordenados: ", numeros)

    ordenadoListo = true;
    interval = setInterval(estilizarCambios, tiempo);
    //console.log("pasos: ", pasos)
}

function estilizarCambios() {

    if (indicePaso >= pasos.length) {
        //console.log("pintando: ", "cancelando el interval")
        clearInterval(interval)
        return;
    }

    var paso = pasos[indicePaso];
    //console.log("pintando: ", paso)
    let { actual, anterior, swap, ordenado } = paso;

    //console.log("Anterior: ", anterior, "Actual: ", actual)

    if (dif == undefined) {
        dif = offsetLefts[actual] - offsetLefts[anterior]
        for (let i = 0; i < offsetLefts.length; i++) {
            offsetLefts[i] = 0;
        }
    }


    spans[actual].classList.add('bg-activo');
    spans[anterior].classList.add('bg-activo');
    //console.log("pintando: ", "clases agregadas")


    if (anterior != 0) {
        //console.log("pintando: ", "removiendo clase activo a tras anterior")
        let ant = anterior - 1;
        spans[ant].classList.toggle('bg-activo');
    }



    if (swap) {
        //console.log("pintando: ", "haciendo el cambio")

        // var posXanterior = offsetLefts[anterior];
        // var posXactual = offsetLefts[actual];

        // var dif = posXactual - posXanterior;
        //console.log("dif: ", dif, "Actual: ", posXactual, "anterior: ", posXanterior)

        offsetLefts[actual] = offsetLefts[actual] - dif;
        offsetLefts[anterior] = offsetLefts[anterior] + dif;
        //console.log(offsetLefts)

        spans[actual].style.transform = `translateX(${offsetLefts[actual]}px)`;
        spans[anterior].style.transform = `translateX(${offsetLefts[anterior]}px)`;

        var spanTmp = spans[anterior];
        spans[anterior] = spans[actual];
        spans[actual] = spanTmp;

        var offsetTmp = offsetLefts[anterior];
        offsetLefts[anterior] = offsetLefts[actual];
        offsetLefts[actual] = offsetTmp;

    }

    if (ordenado) {
        //console.log("pintando: ", "agregando clase bg-ordenado")
        spans[actual].classList.add('bg-ordenado');
    }


    indicePaso++;
    //console.log("paso sig: ", pasos[indicePaso])
}