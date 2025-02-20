// Point d'entree a la racine
const app = require('./src/app.js');
const db = require('./src/config/database.js');
const http = require('http');

// Assurons-nous que l'application démarre
const PORT = process.env.PORT || 8300;
const server = http.createServer(app);

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt gracieux...');
  server.close(() => {
    console.log('Serveur HTTP fermé.');
    db.end().then(() => {
      console.log('Connexion à la base de données fermée.');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu. Arrêt gracieux...');
  server.close(() => {
    console.log('Serveur HTTP fermé.');
    db.end().then(() => {
      console.log('Connexion à la base de données fermée.');
      process.exit(0);
    });
  });
});

// Vérifier la connexion à la base de données avant de démarrer le serveur
db.getConnection()
  .then(connection => {
    console.log('Base de données connectée avec succès');
    connection.release();

    // Démarrer le serveur après la connexion à la base de données
    server.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
        console.log(`Mode: ${process.env.NODE_ENV}`);
        console.log(`URL de la base de données: ${process.env.DB_HOST}`);
        console.log('Process ID:', process.pid);
        console.log('Working directory:', process.cwd());
    }).on('error', (err) => {
        console.error('Erreur de démarrage du serveur:', err);
        console.error('Details:', {
          port: PORT,
          pid: process.pid,
          cwd: process.cwd(),
          node_env: process.env.NODE_ENV
        });
    });
  })
  .catch(err => {
    console.error('Erreur fatale de connexion à la base de données:', err);
    console.error('Connection details:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    process.exit(1);
  }); 