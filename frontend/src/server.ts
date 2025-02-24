const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 8100;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
  console.log(`URL de la base de données: ${process.env.DB_HOST}`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Working directory: ${process.cwd()}`);
}); 
