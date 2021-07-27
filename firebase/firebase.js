import app from 'firebase/app';

import firebaseConfig from './config';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'

class Firebase {
    constructor(){
        !app.apps.length && app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
    }

    async registrar(nombre,email,password){
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email,password);

        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        })
    }

    async iniciaSesion(email,password){
        return await this.auth.signInWithEmailAndPassword(email,password);
    }

    async cerrarSesion(){
        await this.auth.signOut();
    }
}

const firebase = new Firebase();
export default firebase;