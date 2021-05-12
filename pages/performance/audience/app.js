console.log('hello world');

window.addEventListener('load', () => {
    document.getElementById('button1').addEventListener('click', () => {
        window.location.href = window.location.href + document.getElementById('button1').innerHTML;
    });
});