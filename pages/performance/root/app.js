console.log('hello world');

window.addEventListener('load', () => {
    document.getElementById('button1').addEventListener('click', () => {
        console.log('button 1 clicked');
        // window.location.replace(window.location.href + "performance");
        window.location.href = window.location.href + "login";
    });
    document.getElementById('button2').addEventListener('click', () => {
        console.log('button 2 clicked');
        // window.location.replace(window.location.href + "info/about");
        window.location.href = window.location.href + "audience";
    });
});