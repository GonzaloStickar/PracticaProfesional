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

    get get_id() {
        return this.id;
    }

    get get_nombre() {
        return this.nombre;
    }

    get get_direccion() {
        return this.direccion;
    }

    get get_telefono() {
        return this.telefono;
    }

    get get_email() {
        return this.email;
    }

    get get_dni() {
        return this.dni;
    }

    set_nombre(value) {
        this.nombre = value;
    }

    set_direccion(value) {
        this.direccion = value;
    }

    set_telefono(value) {
        this.telefono = value;
    }

    set_email(value) {
        this.email = value;
    }

    set_dni(value) {
        this.dni = value;
    }
}

module.exports = {
    persona: Persona
}