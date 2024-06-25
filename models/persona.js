class Persona {
    
    id;
    nombre;
    direccion;
    telefono;
    email;
    
    constructor(id, nombre, direccion, telefono, email) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }
}

module.exports = {
    persona: Persona
}