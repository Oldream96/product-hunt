export default function validarCrearProducto(valores){

    let errores = {};

    //validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El Nombre es obligatorio";
    }

    if(!valores.empresa){
        errores.empresa = "La empresa es obligatorio";
    }

    if(!valores.url){
        errores.url = "La url es obligatorio";
    } 

    if(!valores.descripcion){
        errores.descripcion = "La descripcion es obligatorio";
    }





    return errores;

}