

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


const addTester = async (email) => {



    let group = 'androidtesters@tomconey.dev'

    try {
        const response = await fetch('http://localhost:5001/api/v1/addtester/android', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN', 
            },
            body: JSON.stringify({
                userEmail: email,
                groupEmail: group 
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Tester added successfully:', result);
    } catch (error) {
        console.error('Error adding tester:', error.message);
    }
};


export {addUser, addTester}