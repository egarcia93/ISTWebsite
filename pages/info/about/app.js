console.log('hello world');

window.addEventListener('load', () => {
    document.getElementById('button1').addEventListener('click', () => {
        window.location.href = "http://localhost:3000/info/bios";
    });
    document.getElementById('button2').addEventListener('click', () => {
        window.location.href = "http://localhost:3000/info/video";
    });
});