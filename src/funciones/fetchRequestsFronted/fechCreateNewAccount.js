export default function fechCreateNewAccount(email, password){
    return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`https://back-relax-project.vercel.app/api/createNewUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                });
                const text = await response.text();
                console.log(text);
                if (response.ok) {
                    resolve(true);
                } else {
                    resolve(text); // Devuelve el mensaje de error personalizado
                }
            } catch (error) {
                console.error('Error:', error);
                resolve('Ha ocurrido un error inesperado'); // Mensaje de error personalizado
            }
    });
}