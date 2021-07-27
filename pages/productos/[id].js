import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';

const ContenedorProducto= styled.div`
    @media( min-width:768px ){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const Producto = () => {

    const[producto,guardarProducto] = useState({});
    const[error,guardarError] = useState(false);

    //routing para obtener el id
    const router = useRouter();
    const { query: { id }}  = router;

    //context firebase

    const { firebase } = useContext(FirebaseContext);

    useEffect( ()=>{
        if (id) {
            const ObtenerProcucto = async()=>{
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if (producto.exists) {
                    guardarProducto(producto.data());
                } else {
                    guardarError(true);
                }
            }
            ObtenerProcucto();
        }
    },[id])

    const {comentarios,creado,descripcion, empresa, nombre, url, urlimagen, votos} = producto;

    return (
        <Layout>
            { error && <Error404/> }
            <div className="contenedor">
                <h1 css={css`
                    text-align:center;
                    margin-top:5rem;
                `} > {nombre}
                </h1>
                <ContenedorProducto>
                    <div>

                    </div>
                    <aside>

                    </aside>
                </ContenedorProducto>

            </div>
        </Layout>
    );
};

export default Producto;