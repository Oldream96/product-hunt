export default function validarIniciarSesion(valores){

    let errores = {};


    if(!valores.email){
        errores.email = "El email es obligatorio";
    } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ){
        errores.email = "email no valido";
    }

    if(!valores.password){
        errores.password = "El password es obligatorio";
    } else if ( valores.password.lenght < 6 ){
        errores.password = "El password debe ser de minimo 6 caracteres";
    }

    return errores;

}