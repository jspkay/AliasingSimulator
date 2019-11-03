function start(){
    canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    canvas.style.background = "#ddd";
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    ctx = canvas.getContext("2d");

    interval = setInterval(update, 1) //ogni 30ms -> 33.3Hz
    console.log("done.");
    makeBackground();
    return 0;
}

height = 480;
width = 680;
t = 0;

function update(){
    t += 5
    if(t > width) clearCanvas();
    disegnaPunto(t % width);
}

function clearCanvas(){
    c = document.getElementsByTagName("canvas")[0];
    ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.height, c.width);
    makeBackground();
}

function makeBackground(){
    ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
    ctx.fillStyle = "black"
    ctx.moveTo(0,  height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();
}

var display = {
    canvas: document.createElement("canvas"),
    height: 480,
    width: 680,
    start: function(){
        canvas.height = height;
        canvas.width = width;
        canvas.style.background = "#ddd";
        document.body.insertBefore(canvas, document.body.childNodes[0]);
        ctx = canvas.getContext("2d");
        inteval = setInterval(update, 30)
    },
    clear: function(){
        ctx.clearRect(0, 0, canvas.height, canvas.width);
    },
    makeBackground: function(){
        ctx.fillStyle = "black"
        ctx.moveTo(0,  height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.moveTo(width/2, 0);
        ctx.lineTo(width/2, height);
        ctx.stroke();
    },
    reset: function(){
        clear();
        makeBackground();
    },
    update: function(){
        sin.incrementa();
        sin.disegna()
    }
}

function sinusoide(A, omega, phi, t){
    /* A -> Ampiezza in V
        omega -> fase in kHz (per qui t in ms)
        phi -> sfasamento */ 
    
    return A * Math.sin(omega * t + phi);
}


function disegnaPunto(){
    display = document.getElementsByTagName("canvas")[0];
    ctx = display.getContext("2d");
    ctx.fillStyle = "green";
    r = sinusoide(150, 1000, 0, t)
    ctx.fillRect(t, r + display.height/2, 1, 1);
}

