import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signOut } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {auth, db } from '../firebase'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const Navbar = () => {

  const [modal,setModal] = useState(false)
 
  const auth = getAuth();





  const activarModal = () => {
    setModal(!modal)
  }
  const cambiarContrasena = ()=> {
    
    sendPasswordResetEmail(auth, admin)
      .then(() => {
        setModal(false)
        Swal.fire({
          title: 'Email enviado',
          icon: 'success',
          timer: 1000, // 3 segundos
          timerProgressBar: true,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

const [admin, setAdmin] = useState('');
const router = useRouter();
function deleteLocalStorageAfterTime() {

  const item = localStorage.getItem('email');
  if (item) {
    const data = JSON.parse(item);
    if (data && data.timestamp) {
    
      const currentTime = new Date().getTime();
      const itemTime = new Date(data.timestamp).getTime();
      const maxAgeInMillis = 240 * 60 * 1000;

      if (currentTime - itemTime > maxAgeInMillis) {
        localStorage.removeItem('email');
        signOut(auth);
        router.push('/')

      }
    }
  }
}


const terminarSesion = () => {
  window.localStorage.setItem('email', '');
  return signOut(auth);
};



useEffect(() => {
  
  if ( window.localStorage.getItem('email')) {
    const adminData = JSON.parse(window.localStorage.getItem('email'))
    if(adminData) {
  
      setAdmin(adminData.email);
    }
  }
  
  deleteLocalStorageAfterTime()
 
}, []);

const handleSignOut = () => {
  terminarSesion();
  localStorage.removeItem('email');
  router.push('/')
  
};


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">
          <Image
            alt="BB Rodamientos Logo"
            width={190}
            height={90}
            src="/logo2.jpg"
            className="logo-image"
          />
        </Link>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              Se le va a enviar un email para cambiar la contraseña a {admin}
            </p>
            <div className="modal-actions">
              <button
                className="modal-button confirm"
                onClick={cambiarContrasena}
              >
                Aceptar
              </button>
              <button
                className="modal-button cancel"
                onClick={() => setModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="navbar-links">
        <Link href="/segundaVersion/busquedaCodigo2" className="nav-link">
          PRODUCTOS
        </Link>

        {admin !== "" && admin !== "rodamientosbb@admin.com" && (
          <button onClick={activarModal} className="nav-link">
            CAMBIAR CONTRASEÑA
          </button>
        )}

        {admin === "rodamientosbb@admin.com" && (
          <>
            <Link href="/segundaVersion/edicionProducto2" className="nav-link">
              EDITAR
            </Link>
            <Link href="/segundaVersion/creacionProducto2" className="nav-link">
              CREAR
            </Link>
            <Link href="/usuarios" className="nav-link">
              USUARIOS
            </Link>
            <Link href="/register" className="nav-link">
              ALTA USUARIOS
            </Link>
            <Link href="/segundaVersion/actualizarCsv2" className="nav-link">
              CSV
            </Link>
            <Link href="/segundaVersion/aplicaciones" className="nav-link">
              APLICACIONES
            </Link>
          </>
        )}
      </div>

      <div className="navbar-auth">
        <Image
          alt="Login Icon"
          width={24}
          height={24}
          src="/login1.png"
          className="auth-icon"
        />
        {admin !== "" ? (
          <button onClick={handleSignOut} className="auth-link">
            <Link href="/">CERRAR SESION</Link>
          </button>
        ) : (
          <Link href="/iniciarSesion" className="auth-link">
            INICIAR SESION
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar