/* -----------------------------------------------
 * text-particles.js v1.0.0
 * (c) 2019-present Alden Zamora (https://github.com/ajzamora)
 * Released under MIT license[http://opensource.org/licenses/MIT]
 * =============================================== */
const canvas = document.getElementById("gold-members");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;
let options = {};

let framerate = 0;
let frame = document.getElementById('frame');
/*
setInterval( ()=>{
    frame.innerHTML = framerate;
    framerate = 0;
}, 1000)
*/

class Particle {
    constructor(x, y, moveX, moveY, name, pColor, pSize, tColor, tSize) {
        this.pointX = x;
        this.pointY = y;
        this.moveX = moveX;
        this.moveY = moveY;
        this.name = name;
        this.particleSize = pSize;
        this.particleColor = pColor;
        this.textSize = tSize;
        this.textColor = tColor;
        this.halfTextWidth = 0;
    }

    plot() {
        ctx.beginPath();
        if (this.particleSize > 0) {
            ctx.arc(this.pointX, this.pointY, this.particleSize, 0, Math.PI * 2);
            ctx.fillStyle = this.particleColor;
            ctx.fill();
        }
        ctx.font = `${this.textSize}px Manrope-Light`;
        ctx.fillStyle = this.textColor;
        this.halfTextWidth = ctx.measureText(this.name).width / 2;
        ctx.fillText(this.name, this.pointX, this.pointY);

    }

    update() {
        if (this.pointX > canvas.width - this.halfTextWidth || this.pointX < this.halfTextWidth) this.moveX = -this.moveX;
        if (this.pointY > canvas.height || this.pointY < this.textSize) this.moveY = -this.moveY;
        this.pointX += this.moveX;
        this.pointY += this.moveY;
        this.plot();
    }
}

function accelerate(opt) {
    options = opt;
    options.maxSpeed = opt.speed || 2; // number: positive speed
    options.minSpeed = -opt.speed || -2; // number: negative speed
    options.particleColor = opt.particleColor || "orange"; //string
    options.particleSize = opt.particleSize || 0, // number: particle size, default=0 (not shown)
    options.textColor = opt.textColor || "#dddddd"; // string
    options.textList = (opt.textList || "Warty Warthog, Hoary Hedgehog, Breezy Badger").split(', '); // string: list of strings separated with a comma and a space
    options.textSize = opt.textSize || 24; // number: positive
    reset(options);
    animateFrameLoop();
}

function reset(opt) {
    particlesArray = [];
    ctx.textAlign = "center";
    let numberOfParticles = opt.textList.length;
    let innerMargin = 100;
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * (canvas.width - innerMargin * 2) + innerMargin;
        let y = Math.random() * (canvas.height - innerMargin * 2) + innerMargin;
        let moveX = Math.random() * (opt.maxSpeed - opt.minSpeed) + opt.minSpeed;
        let moveY = Math.random() * (opt.maxSpeed - opt.minSpeed) + opt.minSpeed;
        particlesArray.push(new Particle(x, y, moveX, moveY, opt.textList[i], opt.particleColor, opt.particleSize, opt.textColor, opt.textSize));
    }
}

function animateFrameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let len = particlesArray.length;
    for (let i = 0; i < len; i++) {
        particlesArray[i].update();
    }
    connect();
    //framerate++;
    window.requestAnimationFrame(animateFrameLoop);
}

function connect() {
    let opacity;
    let rgb = 100;
    let startOpacity = 0.7;
    let distanceOpacity = 5;
    let area = canvas.width * canvas.height;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].pointX - particlesArray[b].pointX) * (particlesArray[a].pointX - particlesArray[b].pointX)
                + (particlesArray[a].pointY - particlesArray[b].pointY) * (particlesArray[a].pointY - particlesArray[b].pointY));
            if (distance < area) {
                opacity = startOpacity - distance / (10000*distanceOpacity);
                ctx.strokeStyle = `rgba(${rgb},${rgb},${rgb}, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].pointX, particlesArray[a].pointY);
                ctx.lineTo(particlesArray[b].pointX, particlesArray[b].pointY);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize',
    () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        reset(options);
    }
);


accelerate({
    textSize: 14,
    particleSize: 2,
    particleColor: '#333',
    textColor: '#888',
    speed: 0.3,
    textList: "3 Banken IT GmbH, AGILOX Services GmbH, Alpine Metal Tech GmbH, Avocodo GmbH, Barmherzige Brüder Krankenhaus Linz, BMD Systemhaus, Brain Force GmbH, CBCX Technologies GmbH, CGM Clinical Österreich GmbH, clickandlearn GmbH, Cloudflight Austria GmbH, coilDNA, COUNT IT GmbH, EBM GmbH, Ebner Media & Management GmbH, EFINIO GmbH, Eisenbeiss GmbH, ELO Digital Office AT GmbH, ENGEL AUSTRIA GmbH, epunkt GmbH, FAW Solutions GmbH, FERCHAU Austria GmbH, FH OÖ IT GmbH, FH Hagenberg, Herbsthofer GmbH, HÖDLMAYR INTERNATIONAL AG, IBM ix Austria GmbH, IGS Systemmanagement GmbH & CO KG, inline-service IT-solution GmbH, KE KELIT GmbH, KEBA Group AG, KREISEL Electric GmbH, Latschbacher GmbH - WinforstPro, Miba AG, MIC Datenverarbeitung GmbH, mobile agreements GmbH, Netural GmbH, NTS Retail KG, ÖGK IKT OÖ, PROGRAMMIERFABRIK GmbH, Raiffeisen Software GmbH, Raiffeisenlandesbank Oberösterreich Aktiengesellschaft, RAITEC GmbH, RZL Software GmbH, SecureGUARD GmbH, SKE Engineering Gmbh, Softpoint IT-Solutions GmbH & Co KG, solvistas GmbH, Sprecher Automation GmbH, STIWA Holding GmbH, TeamViewer Austria GmbH, TGW Logistics Group, TRAUNER Verlag + Buchservice GmbH, TRUMPF Maschinen Austria GmbH + Co. KG, umdasch Store Makers Management GmbH, Uni Software Plus GmbH, VSTech Service & Engineering GmbH, Wacker Neuson Linz GmbH, Wirtschaftskammer Oberösterreich"
});
