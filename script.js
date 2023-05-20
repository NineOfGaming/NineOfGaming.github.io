window.addEventListener("load", function(){
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    var oldWidth = window.innerWidth;
    var oldHeight = window.innerHeight;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var dots = [];
    var dotCount = 75;
    for (var i = 0; i < dotCount; i++){
        var dot = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() * 0.25) + 0.25,
            speedY: (Math.random() * 0.25) + 0.25,
            radius: (Math.random() * 2) + 3,
            speedMagnitude: 0,
            oldSpeedMagnitude: 0,
            newSpeedMagnitude: 0,
            speedFrames: 0,
            speedFramesCount: 0,
            lastChange: 0,
            nextChange: 0,
            direction: Math.random() * Math.PI * 2,
            oldDirection: 0,
            newDirection: 0,
            dirFrames: 0,
            dirFramesCount: 0
        };
        dot.speedMagnitude = Math.sqrt(dot.speedX * dot.speedX + dot.speedY * dot.speedY);
        RandomizeDurDir(dot);
        dots.push(dot);
    }
    UpdateCanvasSize();
    function RandomizeDurDir(dot){
        dot.nextChange  = Math.floor(Math.random() * 480) + 240;
        dot.oldDirection = dot.direction;
        dot.newDirection = dot.oldDirection + (Math.random() * 2 - 1) * (120 * Math.PI / 180);
        dot.dirFrames = Math.floor(Math.random() * 240) + 180;
        if (dot.dirFrames > dot.nextChange){
            dot.dirFrames = dot.nextChange;
        }
        dot.dirFramesCount = 0;
        dot.oldSpeedMagnitude = dot.speedMagnitude;
        dot.newSpeedMagnitude = Math.random() * (0.707 - 0.3535) + 0.3535;
        dot.speedFrames = Math.floor(Math.random() * 240) + 180;
        if (dot.speedFrames > dot.nextChange){
            dot.speedFrames = dot.nextChange;
        }
        dot.speedFramesCount = 0;
    }
    function DrawDots(){
        for (var i = 0; i < dots.length; i++){
            var dot = dots[i];
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    }
    function DrawLines(){
        for (var i = 0; i < dots.length; i++){
            var dot = dots[i];
            for(var j = 0; j < dots.length; j++){
                if (i != j){
                    var dot2 = dots[j];
                    var distX = dot.x - dot2.x;
                    var distY = dot.y - dot2.y;
                    var distance = Math.sqrt(distX * distX + distY * distY);
                    if (distance < 175){
                        ctx.beginPath();
                        ctx.moveTo(dot.x, dot.y);
                        ctx.lineTo(dot2.x, dot2.y);
                        ctx.strokeStyle = 'rgba(100, 100, 200, ' + (1 - distance / 175) + ')';
                        ctx.stroke();
                    }
                }
            }
        }
    }
    function Update(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < dots.length; i++){
            var dot = dots[i];
            if (dot.lastChange >= dot.nextChange){
                RandomizeDurDir(dot);
                dot.lastChange = 0;
            }
            else{
                if (dot.dirFramesCount < dot.dirFrames){
                    dot.direction += (dot.newDirection - dot.oldDirection) / dot.dirFrames;
                    dot.dirFramesCount++;
                }
                if (dot.speedFramesCount < dot.speedFrames) {
                    dot.speedMagnitude += (dot.newSpeedMagnitude - dot.oldSpeedMagnitude) / dot.speedFrames;
                    dot.speedFramesCount++;
                }
            }
            dot.speedX = dot.speedMagnitude * Math.cos(dot.direction);
            dot.speedY = dot.speedMagnitude * Math.sin(dot.direction);
            dot.x += dot.speedX;
            dot.y += dot.speedY;
            if (dot.x < -15){
                dot.x = canvas.width + 15;
            }
            else if (dot.x > canvas.width + 15){
                dot.x = -15;
            }
            if (dot.y < -15){
                dot.y = canvas.height + 15;
            }
            else if (dot.y > canvas.height + 15){
                dot.y = -15;
            }
            dot.lastChange++;
        }
        DrawLines();
        DrawDots();
        requestAnimationFrame(Update);
    }
    requestAnimationFrame(Update);
    function UpdateCanvasSize(){
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        var widthRatio = window.innerWidth / oldWidth;
        var heightRatio = window.innerHeight / oldHeight;
        for (var i = 0; i < dots.length; i++){
            var dot = dots[i];
            dot.x *= widthRatio;
            dot.y *= heightRatio;
        }
        oldWidth = window.innerWidth;
        oldHeight = window.innerHeight;
    }
    window.addEventListener("resize", UpdateCanvasSize)
})