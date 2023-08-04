document.addEventListener('mousemove', function(e){
    const red  = Math.floor(e.pageX/window.innerWidth  * 256);
    const blue = Math.floor(e.pageY/window.innerHeight * 256);
    const green = 0;
    console.log(e.pageX, e.pageY, red, green, blue);
    document.body.style.backgroundColor = `rgb(${red},${green},${blue})`;
})