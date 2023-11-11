export default function loginFetch(email, password){
    return new Promise((resolve, reject) => {
        fetch(`https://back-relax-project.vercel.app/api/validateUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.msg) {
                console.log(data.msg);
                if(data.msg === 'User authenticated successfully'){
                    resolve(true);
                } else {
                    resolve(data.msg);
                }
            } else {
                console.error('Error:', data.error);
                alert(data.error);
                resolve(false); 
            }
        })
        .catch(error => console.error('Error:', error)); 
    });   
}
