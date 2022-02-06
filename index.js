let URL = "https://open.er-api.com/v6/latest";

const $importeParrafo = document.querySelector(".cotizacion__importe");
const $cotizacionParrafo = document.querySelector(".cotizacion");
const $divisaValorBaseParrafo = document.querySelector(".cotizacion__base");

function validarImporte(importe) {
  if (importe.length === 0) {
    return "Este campo necesita al menos un digito";
  }
  return "";
}

function validarDivisaBase(divisa) {
  if (divisa === "0") {
    return "Seleccione una divisa por favor";
  }
  return "";
}

function validarDivisaAConvertir(divisa) {
  if (divisa === "0") {
    return "Seleccione una divisa por favor";
  }
  return "";
}

try {
  fetch(URL)
    .then((respuesta) => respuesta.json())
    .then((respuestaJson) => {
      const apiData = respuestaJson;
      agregarDivisas(apiData);
    });
} catch (error) {
  console.log("algo salio mal", error);
}

function agregarDivisas(data) {
  const divisas = Object.keys(data.rates);
  const $divisaBase = document.querySelector("#divisa-base");
  const $divisaAConvertir = document.querySelector("#divisa-a-convertir");
  for (let divisa of divisas) {
    let $optionDivisaBase = document.createElement("option");
    let $optionDivisaAConvertir = document.createElement("option");
    crearDatosOption($optionDivisaBase, divisa);
    crearDatosOption($optionDivisaAConvertir, divisa);
    $divisaBase.appendChild($optionDivisaBase);
    $divisaAConvertir.appendChild($optionDivisaAConvertir);
  }
}
function crearDatosOption(option, divisa) {
  option.value = divisa;
  option.textContent = divisa;
}

function calcularDivisa(importe, divisaAConvertir) {
  const valorDivisa = importe * divisaAConvertir;
  return valorDivisa;
}

function mostrarResultado() {
  document.querySelector(".oculto").classList.remove("oculto");
}

function validarFormulario(event) {
  event.preventDefault();
  const form = document.getElementById("formulario");

  const $importe = form.importe.value;
  const $divisaBase = form["divisa-base"].value;
  const $divisaAConvertir = form["divisa-a-convertir"].value;

  const errorImporte = validarImporte($importe);
  const errorDivisaBase = validarDivisaBase($divisaBase);
  const errorDivisaAConvertir = validarDivisaAConvertir($divisaAConvertir);

  const errores = {
    importe: errorImporte,
    "divisa-base": errorDivisaBase,
    "divisa-a-convertir": errorDivisaAConvertir,
  };

  eliminarErrores();
  const esExito = manejarErrores(errores) === 0;

  if (esExito) {
    try {
      fetch(`${URL}/${$divisaBase}`)
        .then((respuesta) => respuesta.json())
        .then((respuestaJson) => {
          const divisas = respuestaJson.rates;
          const divisaConvertida = calcularDivisa(
            $importe,
            divisas[$divisaAConvertir]
          );

          $importeParrafo.textContent = `${$importe} ${$divisaBase} =`;
          $cotizacionParrafo.textContent = `${divisaConvertida} ${$divisaAConvertir}`;
          $divisaValorBaseParrafo.textContent = `1 ${$divisaBase} = ${divisas[$divisaAConvertir]} ${$divisaAConvertir}`;
        });
      mostrarResultado();
    } catch (error) {
      console.log("algo salio mal", error);
    }
  }
}

function manejarErrores(errores) {
  const llaves = Object.keys(errores);
  const $errores = document.querySelectorAll(".errores");

  let contadorErrores = 0;

  llaves.forEach((llave, index) => {
    const error = errores[llave];

    if (error) {
      contadorErrores++;
      document.formulario[llave].classList.add("error");

      const $error = document.createElement("li");
      $error.classList.add("error-texto");
      $error.textContent = error;

      $errores[index].appendChild($error);
    } else {
      document.formulario[llave].classList.remove("error");
    }
  });

  return contadorErrores;
}

function eliminarErrores() {
  const $errores = document.querySelectorAll("li");
  for (let $error of $errores) {
    $error.remove();
  }
}

document.querySelector("#btn-cotizacion").onclick = validarFormulario;
