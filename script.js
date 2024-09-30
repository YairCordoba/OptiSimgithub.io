document.getElementById('calcular').addEventListener('click', function() {
    const funcion = document.getElementById('funcion').value;
    const resultadoElement = document.getElementById('resultado');

    try {
        const fPrimera = math.derivative(funcion, 'x').toString();
        const fSegunda = math.derivative(fPrimera, 'x').toString();
        const puntosCriticos = encontrarPuntosCriticos(fPrimera);
        const analisis = analizarPuntosCriticos(puntosCriticos, fSegunda, funcion);
        mostrarResultados(funcion, fPrimera, fSegunda, analisis);
        graficarFuncion(funcion, fPrimera, fSegunda);
    } catch (error) {
        resultadoElement.innerHTML = "Error en la función. Asegúrate de que está en el formato correcto.";
        console.error(error);
    }
});

function insertarTexto(texto) {
    const input = document.getElementById('funcion');
    input.value += texto;
    input.focus();
}

function encontrarPuntosCriticos(derivada) {
    const puntos = [];
    const xValues = math.range(-10, 10, 0.1).toArray();

    xValues.forEach(x => {
        const fDerivada = math.evaluate(derivada, { x: x });
        if (Math.abs(fDerivada) < 0.01) {
            puntos.push(parseFloat(x.toFixed(2)));
        }
    });

    return puntos;
}

function analizarPuntosCriticos(puntos, fSegunda, funcion) {
    const resultados = [];

    if (puntos.length === 0) {
        return ["No hay puntos críticos."];
    }

    puntos.forEach(x => {
        const fSegundaEvaluada = math.evaluate(fSegunda, { x: x });
        const valor = math.evaluate(funcion, { x: x });

        if (fSegundaEvaluada > 0) {
            resultados.push(`Mínimo local en ( ${x}, ${valor.toFixed(4)} )`);
        } else if (fSegundaEvaluada < 0) {
            resultados.push(`Máximo local en ( ${x}, ${valor.toFixed(4)} )`);
        } else {
            resultados.push(`Punto de silla en ( ${x}, ${valor.toFixed(4)} )`);
        }
    });

    return resultados;
}

function mostrarResultados(funcion, fPrimera, fSegunda, analisis) {
    const resultadoElement = document.getElementById('resultado');
    resultadoElement.innerHTML = `
        <strong>Función original:</strong> ${funcion} <br>
        <strong>Primera derivada:</strong> ${fPrimera} <br>
        <strong>Segunda derivada:</strong> ${fSegunda} <br>
        <strong>Puntos críticos:</strong> <br>${analisis.join('<br>')}
    `;
}

function graficarFuncion(funcion, fPrimera, fSegunda) {
    const xValues = math.range(-10, 10, 0.1).toArray();
    const yValues = xValues.map(x => math.evaluate(funcion, { x: x }));
    const yPrimera = xValues.map(x => math.evaluate(fPrimera, { x: x }));
    const ySegunda = xValues.map(x => math.evaluate(fSegunda, { x: x }));

    const trace1 = {
        x: xValues,
        y: yValues,
        mode: 'lines',
        name: 'Función Original',
        line: { color: 'blue' }
    };

    const trace2 = {
        x: xValues,
        y: yPrimera,
        mode: 'lines',
        name: 'Primera Derivada',
        line: { color: 'red' }
    };

    const trace3 = {
        x: xValues,
        y: ySegunda,
        mode: 'lines',
        name: 'Segunda Derivada',
        line: { color: 'green' }
    };

    const data = [trace1, trace2, trace3];

    const layout = {
        title: 'Gráfica de la Función y sus Derivadas',
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
    };

    Plotly.newPlot('grafica', data, layout);
}

function clearInput() {
    const input = document.getElementById('funcion');
    input.value = '';
}
