import { css } from '@emotion/react';
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Campo, Error, Formulario, InputSubmit } from '../components/ui/Formulario';
import useValidacion from '../hooks/useValidacion';
import firebase from '../firebase';
import validarIniciarSesion from '../validacion/validarIniciarSesion';
import Router from 'next/router';


export default function Login() {

  const [error,setError] =  useState(false);
  
  const STATE_INICIAL = {
    email: '',
    password: '',
  }

  const {valores,errores,handleSubmit,handleChange,handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email,password } = valores;

  async function iniciarSesion(){
    try {
      await firebase.iniciaSesion(email,password);
      Router.push('/');
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
          > Iniciar Sesión</h1>
          <Formulario onSubmit={handleSubmit} noValidate>
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
            <InputSubmit type="submit" value="Iniciar Sesion"/>
          </Formulario>
        </>
      </Layout>
    </div>
  )
}
