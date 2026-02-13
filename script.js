// --- UTILITIES ---
function saveHighScore(key, score) {
    let best = localStorage.getItem(key) || 0;
    if (score > best) localStorage.setItem(key, score);
    return localStorage.getItem(key);
}

function surpriseMe() {
    const games = ['startBtn', 'blockBtn', 'targetBtn', 'typeBtn', 'dodgeBtn', 'memoryBtn'];
    document.getElementById(games[Math.floor(Math.random()*games.length)]).click();
}

// --- GAME 1: SNAKE ---
function startSnake() {
    const sCanvas = document.getElementById("snakeGame");
    const sCtx = sCanvas.getContext("2d");
    let snake = [{x: 10, y: 10}], food = {x: 5, y: 5}, dx = 1, dy = 0, score = 0;
    sCanvas.closest(".game-canvas-wrap").classList.add("is-visible");
    document.getElementById("startBtn").classList.add("is-hidden");
    window.addEventListener("keydown", e => {
        if(e.key==="ArrowUp" && dy===0){dx=0;dy=-1} if(e.key==="ArrowDown" && dy===0){dx=0;dy=1}
        if(e.key==="ArrowLeft" && dx===0){dx=-1;dy=0} if(e.key==="ArrowRight" && dx===0){dx=1;dy=0}
    });
    setInterval(() => {
        let head = {x: snake[0].x + dx, y: snake[0].y + dy};
        if(head.x<0||head.x>=20||head.y<0||head.y>=20){alert("Over! Best: "+saveHighScore('s',score));location.reload();}
        snake.unshift(head);
        if(head.x===food.x && head.y===food.y){score++; food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)}}
        else snake.pop();
        sCtx.fillStyle="black"; sCtx.fillRect(0,0,200,200);
        sCtx.fillStyle="red"; sCtx.fillRect(food.x*10,food.y*10,8,8);
        sCtx.fillStyle="#ff4757"; snake.forEach(p=>sCtx.fillRect(p.x*10,p.y*10,8,8));
    }, 100);
}

// --- GAME 2: BLOCK FALL ---
function startBlocks() {
    const bCanvas = document.getElementById("blockGame");
    const bCtx = bCanvas.getContext("2d");
    let px = 80, b = {x:100, y:0, s:2}, score = 0;
    bCanvas.closest(".game-canvas-wrap").classList.add("is-visible");
    document.getElementById("blockBtn").classList.add("is-hidden");
    bCanvas.onmousemove = e => px = e.clientX - bCanvas.getBoundingClientRect().left - 20;
    setInterval(() => {
        b.y += b.s;
        if(b.y>180 && b.x>px && b.x<px+40){ b.y=0; b.x=Math.random()*180; b.s+=0.2; score++; }
        else if(b.y>200){alert("Dropped! Best: "+saveHighScore('b',score));location.reload();}
        bCtx.fillStyle="black"; bCtx.fillRect(0,0,200,200);
        bCtx.fillStyle="#47a0ff"; bCtx.fillRect(b.x,b.y,15,15);
        bCtx.fillStyle="white"; bCtx.fillRect(px,190,40,10);
    }, 20);
}

// --- GAME 3: TARGET HIT ---
function startTarget() {
    const tCanvas = document.getElementById("targetGame");
    const tCtx = tCanvas.getContext("2d");
    let target = {x:100,y:100}, score = 0;
    tCanvas.closest(".game-canvas-wrap").classList.add("is-visible");
    document.getElementById("targetBtn").classList.add("is-hidden");
    const draw = () => {
        tCtx.fillStyle="#111"; tCtx.fillRect(0,0,200,200);
        tCtx.fillStyle="#47ff75"; tCtx.fillRect(target.x,target.y,20,20);
    };
    tCanvas.onclick = e => {
        let r = tCanvas.getBoundingClientRect();
        if(e.clientX-r.left >= target.x && e.clientX-r.left <= target.x+20 && e.clientY-r.top >= target.y && e.clientY-r.top <= target.y+20) {
            score++; target={x:Math.random()*180,y:Math.random()*180}; draw();
        }
    }; draw();
}

// --- GAME 4: SPEED TYPER ---
function startTyping() {
    let words = ["LEAN", "FUN", "FAST", "WEB", "GAME"], cur = "";
    document.getElementById("typeArea").classList.add("is-visible");
    document.getElementById("typeBtn").classList.add("is-hidden");
    const next = () => { cur = words[Math.floor(Math.random()*words.length)]; document.getElementById("wordDisplay").innerText = cur; };
    document.getElementById("typeInput").oninput = e => { if(e.target.value.toUpperCase()===cur){ e.target.value=""; next(); } };
    next();
}

// --- GAME 5: DODGE BALL ---
function startDodge() {
    const dCanvas = document.getElementById("dodgeGame");
    const dCtx = dCanvas.getContext("2d");
    let px = 100, en = [];
    dCanvas.closest(".game-canvas-wrap").classList.add("is-visible");
    document.getElementById("dodgeBtn").classList.add("is-hidden");
    dCanvas.onmousemove = e => px = e.clientX - dCanvas.getBoundingClientRect().left;
    setInterval(() => {
        if(Math.random()<0.05) en.push({x:Math.random()*200, y:0});
        dCtx.fillStyle="black"; dCtx.fillRect(0,0,200,200);
        dCtx.fillStyle="cyan"; dCtx.fillRect(px-10,180,20,10);
        en.forEach((e,i) => {
            e.y+=3; dCtx.fillStyle="white"; dCtx.beginPath(); dCtx.arc(e.x,e.y,5,0,7); dCtx.fill();
            if(e.y>180 && Math.abs(e.x-px)<15){alert("Hit!"); location.reload();}
            if(e.y>200) en.splice(i,1);
        });
    }, 20);
}

// --- GAME 6: MEMORY TILES ---
function startMemory() {
    let sym = ['⭐','⭐','🍎','🍎','💎','💎','👻','👻','🔥','🔥','🤖','🤖','🍀','🍀','🌈','🌈'], flip = [], match = 0;
    const board = document.getElementById("memoryBoard");
    board.classList.add("is-visible");
    document.getElementById("memoryBtn").classList.add("is-hidden");
    sym.sort(() => Math.random()-0.5).forEach(s => {
        const t = document.createElement("div");
        t.className = "memory-tile";
        t.style.cssText = "width:36px;height:36px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;";
        t.innerText="?"; t.onclick = () => {
            if(flip.length<2 && t.innerText==="?"){ t.innerText=s; flip.push(t);
                if(flip.length===2){ setTimeout(()=>{
                    if(flip[0].innerText===flip[1].innerText){match+=2; if(match===16)alert("Win!");}
                    else flip.forEach(x=>x.innerText="?"); flip=[];
                },500); }
            }
        }; board.appendChild(t);
    });
}