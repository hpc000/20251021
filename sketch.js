let objs = [];
let colors = ['#0065CB', '#FF0042', '#758FE4', '#FB4103', '#26A692', '#FAAB0C', '#F9E000', '#FD9B85', '#f9f8f8'];

// 全域變數來儲存選單和子選單元素
let menuDiv;
let menuItem1, menuItem2, menuItem3;
const menuWidth = 100;

function setup() {
	//createCanvas(900, 900);
  createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	addObj();
    
    // 呼叫設定選單的函數
    setupMenu();
}

function draw() {
	//background('#021123');
  background('#ffe5ec');
	for (let i of objs) {
		i.show();
		i.move();
	}

	for (let i = 0; i < objs.length; i++) {
		if (objs[i].isDead) {
			objs.splice(i, 1);
		}
	}

	if (frameCount % 3 == 0) {
		if(objs.length < 50)addObj()
	}
    
    // 呼叫檢查滑鼠位置的函數來控制選單滑動
    handleMenuSlide();
}

// 新增：選單設置函數
function setupMenu() {
    // 1. 建立選單主 DIV 元素
    menuDiv = createDiv('');
    
    // 設定選單樣式
    menuDiv.style('position', 'fixed'); // 固定位置
    menuDiv.style('top', '0');
    menuDiv.style('left', `-${menuWidth}px`); // 初始位置：隱藏在左側
    menuDiv.style('width', `${menuWidth}px`);
    menuDiv.style('height', '100vh'); // 佔滿整個視窗高度
    menuDiv.style('background-color', 'rgba(255, 255, 255, 0.5)'); // 白色，透明度 50%
    menuDiv.style('transition', 'left 0.3s ease'); // 添加過渡效果，使滑動平順
    menuDiv.style('padding', '10px 0'); // 內邊距
    menuDiv.style('box-sizing', 'border-box');
    menuDiv.style('z-index', '100'); // 確保選單在最上層
    
    // 2. 建立子選單元素
    menuItem1 = createMenuItem('單元一作品');
    menuItem2 = createMenuItem('單元一筆記');
    menuItem3 = createMenuItem('作品三');
    
    // 將子選單添加到主選單 DIV
    menuDiv.child(menuItem1);
    menuDiv.child(menuItem2);
    menuDiv.child(menuItem3);
}

// 新增：建立子選單項目的輔助函數
function createMenuItem(text) {
    let item = createDiv(text);
    item.style('color', 'black'); // 預設文字顏色
    item.style('font-size', '15px'); // 文字大小
    item.style('padding', '10px');
    item.style('cursor', 'pointer'); // 顯示為可點擊
    item.style('text-align', 'center');
    item.style('margin-bottom', '10px');
    item.style('user-select', 'none'); // 防止文字被選取
    item.style('transition', 'color 0.1s'); // 為顏色變化添加過渡
    
    // 設定滑鼠移入/移出事件（顯示紅色文字）
    item.mouseOver(() => item.style('color', 'red'));
    item.mouseOut(() => item.style('color', 'black'));
    
	// 點擊事件：根據項目導向到對應網址或印出點擊訊息
	item.mousePressed(() => {
		if (text === '單元一作品') {
			// 導向到指定的 GitHub Pages 網址
			window.location.href = 'https://hpc000.github.io/20251014/';
		} else if (text === '單元一筆記') {
			// 導向到 HackMD 編輯頁面
			window.location.href = 'https://hackmd.io/@hhpc/Hy5Rk-zpxe/edit';
		} else {
			console.log(`${text} 被點擊了`);
		}
	});

    return item;
}

// 新增：處理選單滑動邏輯的函數
function handleMenuSlide() {
    const slideInZone = 100; // 距離視窗最左邊小於 100 的區域
    
    if (mouseX < slideInZone) {
        // 滑鼠靠近左側，選單滑入
        menuDiv.style('left', '0px');
    } else {
        // 滑鼠移出，選單滑出隱藏
        menuDiv.style('left', `-${menuWidth}px`);
    }
}


function easeInOutQuart(x) {
	return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function addObj() {
	for (let i = 0; i < 1; i++) {
		objs.push(new ROK(random(width), random(width), random(60, 120), 0));
	}
}

class ROK {
	constructor(x, y, w, t) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.bw1 = 0;
		this.ew1 = w;
		this.bw2 = 0;
		this.ew2 = w * random(0.1, 0.4);
		this.w1 = this.bw1;
		this.w2 = this.bw2;

		this.ptn = int(random(8, 30));
		this.ewh = random(0.2, 0.35);
		this.ehh = random(0.05, 0.1);
		this.esh = random(0.25, 0.35);

		this.t = t;
		this.t1 = 20;
		this.t2 = this.t1 + 30;
		this.t3 = this.t2 + 20;

		this.ang = random(10);

		this.col1 = random(colors);
		this.col2 = random(colors);

		this.as = random(-1, 1) * 0.02;
		this.ys = -width * 0.001;

		this.xs = random(-1, 1) * width * 0.001;

		this.isDead = false;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		noStroke();
		fill(this.col1);
		for (let i = 0; i < this.ptn; i++) {
			rotate(TAU / this.ptn);
			ellipse(this.w1 * this.esh, 0, this.w1 * this.ewh, this.w1 * this.ehh);
		}
		fill(this.col2);
		circle(0, 0, this.w2);
		pop();
	}

	move() {
		if (0 < this.t && this.t < this.t2) {
			let n = norm(this.t, 0, this.t2 - 1);
			this.w2 = lerp(this.bw2, this.ew2, easeInOutQuart(n));
		}
		if (this.t1 < this.t && this.t < this.t3) {
			let n = norm(this.t, this.t1, this.t3 - 1);
			this.w1 = lerp(this.bw1, this.ew1, easeInOutQuart(n));
		}
		this.y += this.ys;
		this.ys += 0.02;

		if (this.y > height + this.w) {
			this.isDead = true;
		}
		this.t++;
		this.ang += this.as;
		this.x += this.xs
	}
}