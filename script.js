function start(){
    document.addEventListener("keydown", function(e){
        if(e.keyCode == 32) startStopSpacebar();
        if(e.keyCode == 13) stopAndClean();
    })
    display.start();
    display.reset();
    sin = new lettore(1);
}

precision = 100

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
        this.interval = setInterval(update, 1)
    },
    clear: function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    makeBackgroundR: function(reps, x, y, type){
        var m = (y-x)/2;

        if(reps <= 0) return;
        
        this.ctx.strokeStyle = "#000";
        this.ctx.globalAplha = 0.2;
        switch(type){
            case "H":
                this.ctx.moveTo(0, x + m);
                this.ctx.lineTo(this.width, x+m);
                this.ctx.stroke();
                break;
            case "V":
                this.ctx.moveTo(x+m, 0);
                this.ctx.lineTo(x+m, this.height);
                this.ctx.stroke();
                break;
        }

        this.makeBackgroundR(reps-1, x, x+m, type);
        this.makeBackgroundR(reps-1, x+m, y, type)
    },
    makeBackground: function(reps){ 
        this.makeBackgroundR(reps, 0, this.width, "V");
        this.makeBackgroundR(reps, 0, this.height, "H");
    },
    reset: function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

        sin.t += sin.passo; //incremento t
        sin.disegna();
        if(sin.x >= display.width){
            sin.reset();
            clearInterval(display.interval);
        }
        
        //Controllo aliasing
        if(sin.fc > 2*sin.f){
            el = document.getElementById("aliasing");
            el.className = "aliasingFalse";
            el.innerHTML = "NO Aliasing: questi punti possono essere usati per ricostruire il segnale corretto";
        }
        else{
            el = document.getElementById("aliasing");
            el.className = "aliasingTrue";
            el.innerHTML = "Aliasing!";
        }
    }
}

function lettore(passo){
    this.t = 0;
    this.x = 0;
    this.passo = passo;
    this.A = 150;
    this.f = 1;
    this.fc = 1/passo;

    this.reset = function(){
        this.x = 0;
        this.t = 0;
    }

    this.disegna = function(){
        ctx = display.ctx;
        this.x++;
        r = sinusoide(this.A, this.f, 0, this.t);

        //cancello ciò che c'è prima
        ctx.clearRect(this.x+3, 0, 20, display.height);
        display.makeBackground(1);

        //disegno il nuovo punto
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, r + display.height/2, 3, 3);
        delete(ctx);
        delete(r);
    }
}

function cambiaCampionamento(type){
    clearInterval(display.interval);
    sin.reset();

    switch(type){
        case 'freq':
            newF = parseFloat(document.getElementById("Fc").value);
            newT = 1/newF;
            sin.passo = newT;
            document.getElementById("Tc").value = newT;
            break;
        default:
            newT = parseFloat(document.getElementById("Tc").value);
            sin.passo = newT;
            document.getElementById("Fc").value = 1 / newT;
    }
            
    sin.fc = 1/sin.passo;
    display.interval = setInterval(update, 1);
}

function aggiornaFrequenza(type){
    clearInterval(display.interval);
    sin.reset();
    slider = document.getElementById("freqSlider");
    switch(type){
        case 'manual':
            newF = document.getElementById("f").value;
            sin.f = newF;
            if(newF * precision > slider.max){
                alert("Change presicion!");
                return;
            }
            slider.value = (newF*precision);
            newT = 1/newF;
            document.getElementById('t').value = newT;
            break;
        case 'period':
            newT = parseFloat(document.getElementById('t').value);
            newF = 1/newT;
            slider.value = (newF*precision);
            document.getElementById("f").value = newF;
            sin.f = newF;
            break;
        default:
            newF = slider.value;
            newF /= precision;
            document.getElementById("f").value = newF;
            sin.f = newF;
            delete(newF);
    }
    display.interval = setInterval(update, 1);
}0.49

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

function changePrecision(){
    newP = document.getElementById("precision").value;
    newP = Math.pow(10, newP);
    precision = newP;
    document.getElementById("valoriPermessi").innerHTML = "Valori permessi: 0 - " +
        document.getElementById("freqSlider").max / newP;
    aggiornaFrequenza();
}
