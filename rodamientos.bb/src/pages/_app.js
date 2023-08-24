import '../styles/globals.css'
import '../styles/cards.css'
import '../styles/productoSingular.css'
import '../styles/navbar.css'
import '../styles/banner.css'
import '../styles/servicios.css'
import '../styles/productos.css'
import '../styles/footer.css'
import '../styles/mercadoLibre.css'
import '../styles/inicioSesion.css'
import '../styles/registro.css'
import '../styles/edicionProducto.css'
import '../styles/inicioProducto.css'
import '../styles/carrousel.css'
import '../styles/edicionMasiva.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
  <>
   <Head>
        <link rel="icon" href="/logoWeb.ico" />
       
      </Head>
  <Component {...pageProps} />
  
  </>

  )
  
}
