console.log('hello world');

window.addEventListener('load', () => {
    document.getElementById('button1').addEventListener('click', () => {
        let email = document.getElementById('email').value;
        document.getElementById('email').value = '';
        let username = document.getElementById('username').value;
        document.getElementById('username').value = '';
        let password = document.getElementById('password').value;
        document.getElementById('password').value = '';
        if (username && password &&email !== '') {
           
            let registerInfo =
            {   "email": email,
                "name": username,
                "password": password
            }
            //console.log(loginInfo);
            let jsonData = JSON.stringify(registerInfo);
            fetch('/performance/register',{
                method: 'POST',
                headers:{
                    "Content-type": "application/json"
                },
                body: jsonData
            })
            .then(response => response.json())
            .then(response=>{
                if(response.task=="success"){
                   var h = document.createElement("H2");
                   var t =  document.createTextNode("Success!")
                   h.appendChild(t);
                   document.body.appendChild(h);
                   console.log("success")
                }

            });
            
        }
        
    });
});