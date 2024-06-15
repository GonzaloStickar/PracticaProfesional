class Reparacion {

    id;
    persona_id;
    descripcion;
    tipo;
    fecha;
    estado;

    constructor(id, persona_id, descripcion, tipo, fecha, estado) {
        this.id = id;
        this.persona_id = persona_id;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.fecha = fecha;
        this.estado = estado;
    }

    get get_id() {
        return this.id;
    }

    get get_persona_id() {
        return this.persona_id;
    }

    get get_descripcion() {
        return this.descripcion;
    }

    get get_tipo() {
        return this.tipo;
    }

    get get_fecha() {
        return this.fecha;
    }

    get get_estado() {
        return this.estado;
    }

    set_persona_id(value) {
        this.persona_id = value;
    }

    set_descripcion(value) {
        this.descripcion = value;
    }

    set_tipo(value) {
        this.tipo = value;
    }

    set_fecha(value) {
        this.fecha = value;
    }

    set_estado(value) {
        this.estado = value;
    }
}

module.exports = {
    reparacion: Reparacion
}