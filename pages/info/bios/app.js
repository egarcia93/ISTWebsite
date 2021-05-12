console.log('hello world');

window.addEventListener('load', () => {
    document.getElementById('button1').addEventListener('click', () => {
        window.location.href = "http://localhost:3000/info/about";
    });
    document.getElementById('button2').addEventListener('click', () => {
        window.location.href = "http://localhost:3000/info/video";
    });
});