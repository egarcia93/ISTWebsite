console.log('hello world');

window.addEventListener('load', () => {
    document.getElementById('button1').addEventListener('click', () => {
        let username = document.getElementById('username').value;
        document.getElementById('username').value = '';
        let password = document.getElementById('password').value;
        document.getElementById('password').value = '';
        if (username && password !== '') {
           
            let loginInfo =
            {
                "name": username,
                "password": password
            }
            //console.log(loginInfo);
            let jsonData = JSON.stringify(loginInfo);
            fetch('/performance/login',{
                method: 'POST',
                headers:{
                    "Content-type": "application/json"
                },
                body: jsonData
            })
            .then(response => response.json())
            .then(response => {
                if(response.task=="success"){
                    window.location.href = "https://ist-webpage/performance/performer/" + username;
                }
            })
           
        }
        
    });
});