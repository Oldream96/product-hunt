import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import {Campo, InputSubmit } from '../../components/ui/Formulario'
import Boton from '../../components/ui/Boton';

const ContenedorProducto= styled.div`
    @media( min-width:768px ){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    const[producto,guardarProducto] = useState({});
    const[error,guardarError] = useState(false);
    const[comentario,guardarComentario] = useState({});
    const[consultarDB,guardarConsultarDB] = useState(true);

    //routing para obtener el id
    const router = useRouter();
    const { query: { id }}  = router;

    //context firebase

    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect( ()=>{
        if (id) {
            const ObtenerProducto = async()=>{
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if (producto.exists) {
                    guardarProducto(producto.data());
                } else {
                    guardarError(true);
                }
                guardarConsultarDB(false);
            }
            ObtenerProducto();
        }
    },[id])

    const {comentarios,creado,descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    const votarProducto = () =>{
        if (!usuario) {
            router.push('/login')
        }
        if(haVotado.includes(usuario.uid)) return;
        
        //obtener y sumar un nuevo voto
        const nuevoTotal = votos +1;


        //actualizar en la base de datos

        const nuevohaVotado = [ ...haVotado, usuario.uid ];


        firebase.db.collection('productos').doc(id).update({ votos: nuevoTotal, haVotado : nuevohaVotado });


        //actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal,
            haVotado: nuevohaVotado,
        })
    }

    //Funciones para crear Comentarios
    const comentarioChange = e =>{
        guardarComentario({
            ...comentario,
            [e.target.name]:e.target.value
        })
    }

    //identifica si el coementario es del creador del producto
    const esCreador = id =>{
        if(creador.id == id){
            return true;
        }
    }

    const agregarComentario = e =>{
        e.preventDefault();
        if(!usuario) return router.push('/login');
        //informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // tomar copia de comentarios
        const nuevoComentarios = [...comentarios, comentario];

        //actualizar bd

        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevoComentarios
        })

        //actyualizar state

        guardarProducto({
            ...producto,
            comentarios: nuevoComentarios,
        })
    }

    const puedeBorrar = () =>{
        if(!usuario) return false;
        if( creador &&(creador.id === usuario.uid) ){
            return true;
        }
    }

    const eliminarProducto = async() =>{
        if(!usuario) return router.push('/login');
        if( creador &&(creador.id === usuario.uid) ){
            return router.push('/');
        }
        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            
        }

    }

    return (
        <Layout>
            { error ? <Error404/> : 
                <div className="contenedor">
                <h1 css={css`
                    text-align:center;
                    margin-top:5rem;
                `} > {nombre}
                </h1>
                <ContenedorProducto>
                    <div>
                        {creado && <p>Publicado hace { formatDistanceToNow( new Date(creado), {locale: es} )}</p> } 
                        <p> Publicado por {creador?.nombre} de {empresa}  </p>
                        <img src={urlimagen} />
                        <p>{descripcion}</p>
                        { usuario && (
                            <>
                            <h2>Agrega tu Comentario</h2>
                            <form onSubmit={ agregarComentario } >
                                <Campo>
                                    <input
                                        type="text"
                                        name="mensaje"
                                        onChange={comentarioChange}
                                    />
                                </Campo>
                                <InputSubmit type="submit" value="Agregar Comentario"
                                />
                            </form>
                            </>
                        )}
                        <h2 css={css`
                            margin: 2rem 0;
                        `} >comentarios</h2>
                        { comentarios && comentarios.length === 0 ? "Aun no hay comentarios" :
                        ( <ul>
                        { comentarios && comentarios.map( (comentario,i) => (
                            <li key={`${comentario.usuarioId}-${i}`} 
                                css={css`
                                    border: 1px solid #e1e1e1;
                                    padding: 2rem;
                                `}
                                >
                                <p>{comentario.mensaje}</p>
                                <p> escrito por: 
                                    <span css={css`
                                        font-weight:bold;
                                        `}>
                                        {''} {comentario.usuarioNombre}  
                                    </span>
                                </p>
                                { esCreador( comentario.usuarioId ) && <CreadorProducto>Es Creador</CreadorProducto>  }
                            </li>
                        ) ) }
                        </ul> ) }
                        
                    </div>
                    <aside>
                        <Boton target="_blank" bgColor="true" href={url} >
                            Visitar URL
                        </Boton>
                        <p css={css`
                            text-align:center;
                            `} >{votos} votos</p>
                        { usuario && (<Boton onClick={votarProducto} >Votar</Boton>) }
                    </aside>
                </ContenedorProducto>
                { puedeBorrar() &&
                    <Boton onClick={eliminarProducto} >Eliminar Producto</Boton>
                }

            </div>
                    
            }

        </Layout>
    );
};

export default Producto;