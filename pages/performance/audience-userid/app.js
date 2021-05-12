console.log('hello world');

window.addEventListener('load', () => {
    let splitURL = window.location.href.split('audience/');
    console.log(splitURL[1]);
    document.getElementById('title').innerHTML = "Welcome to " + splitURL[1] + "'s performance";
    document.getElementById('button1').addEventListener('click', () => {
        window.location.href = document.referrer;
    });
});