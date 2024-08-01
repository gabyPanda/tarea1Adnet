
const esEdadPension = async (edad) => {
    if (edad < 65) {
        throw new Error(`La edad para pension debe ser mayor o igual a 65`);
    }
}


const esIntervarlo10 = async (rango) => {
    const rangoAux = rango.split('-');
    const rango1 = rangoAux[0];
    const rango2 = rangoAux[1];
    const minRango = Math.min(rango1, rango2);
    const maxRango = Math.max(rango1, rango2);

    if (maxRango - minRango !== 10) {
        throw new Error('El rango debe ser en intervalos de 10 años');
    }
}

module.exports = {
    esEdadPension,
    esIntervarlo10
}