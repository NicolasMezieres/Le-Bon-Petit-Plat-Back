import '../styles/globals.css'; // Importer des styles globaux
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Code à exécuter lors du chargement de l'application
    console.log('App loaded');
  }, []);

  return (
    <>
      <Component {...pageProps} /> {/* Rendre la page courante */}
    </>
  );
}

export default MyApp;
