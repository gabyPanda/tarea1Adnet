const calculaEdad = (fechaNacimiento = '') => {
    const fechaNaci = new Date(fechaNacimiento);
    const hoy = new Date();
    let edadAux = hoy.getFullYear() - fechaNaci.getFullYear();

    const mes = hoy.getMonth() - fechaNaci.getMonth();
    const dia = hoy.getDate() - fechaNaci.getDate();

    // Ajustar la edad si el cumpleaños aún no ha llegado este año
    if (mes < 0 || (mes === 0 && dia < 0)) {
        edadAux--;
    }
    return edadAux;
}

const calculaPensionados = (fechaNacimiento = '', edad = '') => {
    const edadAux = calculaEdad(fechaNacimiento);

    if (edadAux < 65) {
        return false;
    }
    if (edadAux >= 65 || edadAux <= edad) {
        return true;
    }

}


module.exports = {
    calculaEdad,
    calculaPensionados
}

