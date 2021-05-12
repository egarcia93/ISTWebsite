console.log('hello world');

window.addEventListener('load', () => {
    let splitURL = window.location.href.split('performer/');
    console.log(splitURL[1]);
    document.getElementById('title').innerHTML = "Welcome " + splitURL[1];
    document.getElementById('button1').addEventListener('click', () => {
        console.log('button1 pressed');
        let data = document.getElementById('input').value;
        document.getElementById('input').value = '';
    });
});