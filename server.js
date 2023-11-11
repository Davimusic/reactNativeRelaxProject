const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser') 
const getDocumentByTipo = require('./backend/getDocumentByTipo.js');
const validateExistingUserLogin = require('./backend/validateExistingUserLogin.js')
const createNewUser = require('./backend/createNewUser.js');
const getTagNames = require('./backend/getTagNames.js')

const app = express();

app.use(cors()); 
app.use(bodyParser.json());

app.get('/api/getTagsNames', getTagNames)
app.post('/api/documents', getDocumentByTipo);
app.post('/api/users', createNewUser);
app.post('/api/validateUser', validateExistingUserLogin);

app.listen(3000, () => console.log('Server started on port 3000'));

