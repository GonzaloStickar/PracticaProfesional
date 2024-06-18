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
}

module.exports = {
    reparacion: Reparacion
}