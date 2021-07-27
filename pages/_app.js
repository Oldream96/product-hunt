import '../styles/globals.css'
import firebase,{ FirebaseContext } from '../firebase'
import useAutenticacion from '../hooks/useAutenticacion';

function MyApp(props) {

  const usuario = useAutenticacion();
  
  const { Component, PageProps } = props;

  return (
    <FirebaseContext.Provider
      value={{
          firebase, 
          usuario
      }}
    >
      <Component {...PageProps} />
    </FirebaseContext.Provider>
  )
}

export default MyApp
