

const addUser = async () => {

    let user = {
        uid: crypto.randomUUID(),
        displayName: 'Tom Coney',
        email: 'tom058715@gmail.com'
    }

    const res = await fetch(`http://localhost:5001/api/users/adduser`, {      
        method: 'POST', 
        body: JSON.stringify({user}),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })
    const data = await res.json()

    console.log(data) 
}

export {addUser}