import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const IniciarSesion = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Obtén el UID del usuario autenticado
      const user = userCredential.user;
      const uid = user.uid;

      const timestamp = Date.now();
      const data = {
        email: email,
        timestamp: timestamp,
        uid: uid, // Agrega el UID al objeto de datos si lo necesitas
      };

      const jsonData = JSON.stringify(data);
      window.localStorage.setItem("email", jsonData);
      window.localStorage.setItem("idRodamientos", uid);
      router.push("/segundaVersion/busquedaCodigo2");
    } catch (error) {
      setError(error.message);
      Swal.fire({
        text: "Email o contraseña incorrecta!",
        icon: "error",
        confirmButtonText: "Volver",
      });
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("email")) {
      const adminData = JSON.parse(window.localStorage.getItem("email"));
      if (adminData !== "") {
        router.push("/segundaVersion/busquedaCodigo2");
      }
    }
  }, []);

  const terminarSesion = () => {
    return signOut(auth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(email.toLowerCase(), password.toLowerCase());
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="logo-container">
            <Link href={"/"}>
              <Image
                alt="Rodamientos BB Logo"
                src="/logo2.jpg"
                width={400}
                height={240}
                priority
              />
            </Link>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="login-form">
              <h1> Iniciar sesion </h1>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Escriba su email"
                className="input-inicio"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Escriba su contraseña"
                className="input-inicio"
              />

              <button style={{ cursor: "pointer" }} type="submit">
                {" "}
                Iniciar sesión{" "}
              </button>
            </form>
            <div className="whatsapp-info">
              <span className="sinCuenta">
                {" "}
                No tiene una cuenta? Solicitela por nuestro Whatsapp!
              </span>{" "}
              <div className="segundo-container">
                <Image alt="" src="/whatsapp.png" width={30} height={30} />
                <span>
                  {" "}
                  <Link href="https://wa.me/1137660939">
                    {" "}
                    + 54 9 1137660939{" "}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IniciarSesion;
