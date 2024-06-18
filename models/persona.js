class Persona {
    
    id;
    nombre;
    direccion;
    telefono;
    email;
    dni;
    
    constructor(id, nombre, direccion, telefono, email, dni) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.dni = dni;
    }
}

module.exports = {
    persona: Persona
}