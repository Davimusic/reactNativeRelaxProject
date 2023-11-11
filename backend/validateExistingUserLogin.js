const connectToDatabase = require('./db.js');
const bcrypt = require('bcrypt');

async function validateExistingUserLogin(req, res){
    console.log('Handling request to /api/validateUser');
    const db = await connectToDatabase();
    const collection = db.collection('primerRelaxProject');

    let email = req.body.email;
    let password = req.body.password;

    try {
        const userDocument = await collection.findOne({
            email: email
        });
    
        if (!userDocument) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        const match = await bcrypt.compare(password, userDocument.password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
    
        console.log(`User ${email} authenticated successfully`);
        const responseObj = {
            user: userDocument,
        };
        return res.status(200).json(responseObj);
        } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}

module.exports = validateExistingUserLogin;