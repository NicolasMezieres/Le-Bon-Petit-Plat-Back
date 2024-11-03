import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        {' '}
        {/* Définir la langue du document */}
        <Head>
          <meta name="description" content="Votre description ici" />{' '}
          {/* Ajouter des balises meta */}
          <link rel="icon" href="/favicon.ico" />{' '}
          {/* Lien vers l'icône de la page */}
          {/* Ajouter des polices ou d'autres ressources ici */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          />
        </Head>
        <body>
          <Main /> {/* Rendre le contenu de la page */}
          <NextScript /> {/* Scripts Next.js */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
