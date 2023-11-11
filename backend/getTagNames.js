const connectToDatabase = require('./db.js');

async function getTagNames(req, res) {
  console.log('Handling request to /api/getTagNames');
  const db = await connectToDatabase();
  const collection = db.collection('primerRelaxProject');

  try {
    const documentsCursor = await collection.find({
      tags: { $exists: true }
    });

    const documentsArray = await documentsCursor.toArray();
    let tagValues = [];
    documentsArray.forEach(document => {
      document.tags.forEach(tag => {
        if (!tagValues.includes(tag)) {
          tagValues.push(tag);
        }
      });
    });

    console.log(`Found ${tagValues.length} unique tag values`);
    console.log(tagValues); // Esto imprimirá los valores únicos encontrados en el log
    return res.status(200).json(tagValues);
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

module.exports = getTagNames;

