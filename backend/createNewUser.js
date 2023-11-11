const connectToDatabase = require('./db.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function createNewUser(req, res){
    
    // Obtenemos los datos del cuerpo de la solicitud
    const { email, password } = req.body;

    // Conectamos a la base de datos
    const db = await connectToDatabase();

    // Verificamos si el correo electrónico ya existe en la base de datos
    const userExists = await db.collection('primerRelaxProject').findOne({ email: email });

    if (userExists) {
        res.status(400).send(`${email} already exist`);
    } else {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let document = {
            email: email,
            password: hashedPassword
        };

        // Insertamos el documento en la colección
        const result = await db.collection('primerRelaxProject').insertOne(document);

        // Si la inserción fue exitosa, enviamos una respuesta
        if (result.insertedId) {
            res.status(200).send(`${email} was created successfully`);
        } else {
            res.status(500).send(`It had been a problem creating the new ${email} user, please try again`);
        }
    }
}

module.exports = createNewUser;
