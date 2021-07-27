import React, { useContext, useEffect, useState } from 'react';
import { Global, css } from '@emotion/react';
import Layout from '../components/layout/Layout';
import { FirebaseContext } from '../firebase';
import DetallesProducto from '../components/layout/DetallesProducto';


export default function Home() {

  const[productos,guardarProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() =>{
    const obtenerProductos = () =>{
      firebase.db.collection('productos').orderBy('creado','desc').onSnapshot(manejarSnapshot)
    }
    obtenerProductos();
  },[]);

  function manejarSnapshot(snapshot){
    const productos =  snapshot.docs.map(doc => {
      return{
        id: doc.id,
        ...doc.data(),
      }
    });

    guardarProductos(productos);
  }

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map( producto => (
                <DetallesProducto key={producto.id} producto={producto} >

                </DetallesProducto>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}
