//import { connectToDatabase } from './db.js';
const connectToDatabase = require('./db.js');

async function getDocumentByTipo(req, res) {
  console.log('Handling request to /api/documents');
  const db = await connectToDatabase();
  const collection = db.collection('primerRelaxProject');

  let filtro = req.body; // Ahora el filtro viene del cuerpo de la solicitud POST
  let llave = Object.keys(filtro)[0];
  let valor = filtro[llave];

  if(llave === 'tags'){
    try {
      const documentsCursor = await collection.find({
        tags: {
          $elemMatch: { $eq: valor }
        }
      });

      const documentsArray = await documentsCursor.toArray();
      console.log(`Found ${documentsArray.length} documents`);
      const responseObj = {
        documentos: documentsArray,
        llave: llave,
        otroDato: valor,
      };
      return res.status(200).json(responseObj);
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  } else {
    console.log('The key is not "tags"');
  }
}

module.exports = getDocumentByTipo;
