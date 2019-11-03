function start(){
    document.addEventListener("keydown", function(e){
        if(e.keyCode == 32) startStopSpacebar();
        if(e.keyCode == 13) stopAndClean();
    })
    display.start();
    display.reset();
    sin = new lettore(1);
}

var display = {
    canvas: document.createElement("canvas"),
    active: true,
    height: 480,
    width: 680,
    start: function(){
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.canvas.style.background = "#ddd";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.ctx = this.canvas.getContext("2d");
        this.inteval = setInterval(update, 15)
    },
    clear: function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    makeBackground: function(){
        this.ctx.fillStyle = "black"
        this.ctx.moveTo(0,  this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.stroke();
        this.ctx.moveTo(this.width/2, 0);
        this.ctx.lineTo(this.width/2, this.height);
        this.ctx.stroke();
    },
    reset: function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "black"
        this.ctx.moveTo(0,  this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.stroke();
        this.ctx.moveTo(this.width/2, 0);
        this.ctx.lineTo(this.width/2, this.height);
        this.ctx.stroke();
    }
}

function sinusoide(A, f, phi, t){
    /* A -> Ampiezza in V
        omega -> fase in kHz (per qui t in ms)
        phi -> sfasamento */ 
    v = A * Math.sin(Math.PI * 2 * f * t + phi);
    return v;
}

function update(){
    //incremento 
    if(display.active){
        sin.t += sin.passo;
        sin.disegna();
    }
}

function lettore(passo){
    this.t = 0;
    this.x = 0;
    this.passo = passo;
    this.A = 150;
    this.f = 0;

    this.disegna = function(){
        ctx = display.ctx;
        this.x = this.t%display.width;
        r = sinusoide(this.A, this.f, 0, this.t);

        //cancello ciò che c'è prima
        ctx.clearRect(this.x+3, 0, 20, display.height);
        display.makeBackground();

        //disegno il nuovo punto
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, r + display.height/2, 3, 3);
        delete(ctx);
        delete(r);
    }
}

function aggiornaFrequenza(){
    newF = document.getElementById("freqSlider").value;
    newF /= 100;
    document.getElementById("f").value = newF;
    sin.f = newF;
    delete(newF);
}

function startStopCheckbox(){
    display.active = document.getElementById("state").checked;
}

function startStopSpacebar(){
    display.active = !display.active;
    document.getElementById("state").checked = display.active;
}

function stopAndClean(){
    ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
    ctx.clearRect(0, 0, 1000, 1000);
    delete(ctx);
}