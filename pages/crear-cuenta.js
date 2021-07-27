import { css } from '@emotion/react';
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
import firebase from '../firebase';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: '',
}

export default function CrearCuenta() {

  const [error,setError] =  useState(false);
  
  

  const {valores,errores,handleSubmit,handleChange,handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre,email,password } = valores;

  async function crearCuenta(){
    try {
      await firebase.registrar(nombre,email,password);

      
    } catch (error) {
      console.error('hubo un error',error.message);
      setError(error.message);
    }
  }


  return (
    <div>
      <Layout>
        <>
          <h1
           css={css`
            text-align: center;
            margin-top: 5rem;
           `}
          > Crear Cuenta</h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input type="text" id="nombre" placeholder="tu nombre" name="nombre" value={nombre} onChange={ handleChange } onBlur={handleBlur}/>
            </Campo>
            { errores.nombre && <Error>{errores.nombre}</Error> }
            <Campo>
              <label htmlFor="email">Email</label>
              <input type="text" id="email" placeholder="tu Email" name="email" value={email} onChange={ handleChange } onBlur={handleBlur}/>
            </Campo>
            { errores.email && <Error>{errores.email}</Error> }
            <Campo>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="tu Password" name="password" value={password} onChange={ handleChange } onBlur={handleBlur} />
            </Campo>
            { errores.password && <Error>{errores.password}</Error> }

            { error && <Error>{error}</Error> }
            <InputSubmit type="submit" value="Crear Cuenta"/>
          </Formulario>
        </>
      </Layout>
    </div>
  )
}
