// 마우스 이동 경로
let mouse = {
    x: undefined,
    y: undefined
}
let mouseclick = 0;


// 원 최대 크기 (돌아다니는 원)
let maxradius = 40;
let minradius = 2;
let cnv;
let play = 0;
let secondStop = 0;
let secondPlaying = 0;
let sx;
let stopx = 0;
let circleAry = [];

// 컬러값 
let colorarray = [{
    main: '#D3310B',
}, {
    main: '#DE6C36',
}, {
    main: '#FEBB45',
}, {
    main: '#5FB876'
}, {
    main: '#679D9F',
}, {
    main: '#49ABC8',
}, {
    main: '#81A1E1',
}, {
    main: '#8D8BBA',
}, {
    main: '#CDAF8D',
}];
// 음악 리스트
let musicList = [];

// 방문 클릭시 입장 링크 
let linkLocation;

// 음악 추가

//
let song = [];

// 방 입장시 나오는 노래
let secondSong;

/*마우스 위치*/
window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}, false);

function preload() {
    for (let i = 0; i < 9; i++) {
        musicList.push(`../musics/0${i}/00.mp3`)
    }
}

function setup() {
    cnv = createCanvas(windowWidth - 10, windowHeight - 10);
    cnv.style('position', 'absolute');
    showoverlay();
    init();
}

function draw() {
    animate();
    if (secondStop && secondPlaying) {
        sx = sx + (0 - sx) * 0.02;
        song[secondSong].setVolume(sx);
    }
}




//=========돌아다는 원 관련============ 
// 돌아다는 원 class
class Circle {
    constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.musicMax = 0.2;
        this.musicMin = 0.04;
        this.ex = 0.04;
        this.radius = radius;
        this.minradius = radius;
        this.color = colorarray[Math.ceil(Math.random() * 5)].main;
        this.draw = function () {
            circle(this.x, this.y, this.radius);
            noStroke();
            fill(this.color);
        }
        // 움직임
        this.update = function () {
            if (this.x + this.radius > windowWidth || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > windowHeight || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;
            // 마우스 hover시

            if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
                {
                    if (this.radius < maxradius) this.radius += 1;

                    this.ex = this.ex + (this.musicMax - this.ex) * 0.1;
                    mainSong.setVolume(this.ex);

                }
            } // 마우스 벗어날때
            else if (this.radius > this.minradius) {
                this.radius -= 1;
                // 0.05로 가야함

                if (this.x > windowWidth / 100 * 34.4 || this.x < windowWidth / 100 * 74.4) {
                    this.ex = this.ex + (this.musicMin - this.ex) * 0.1;
                    mainSong.setVolume(this.ex);
                }
            }
            this.draw();
        }
    }
}

//초기화
function init() {
    circleArray = []; // 초기화 화면 늘릴때마다 다시 만듬 

    for (let i = 0; i < 100; i++) {
        let radius = Math.random() * 3 + 2;
        let x = Math.random() * (window.innerWidth - radius * 2) + radius;
        let y = Math.random() * (window.innerHeight - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 2; //속도 
        let dy = (Math.random() - 0.5) * 2;
        circleArray.push(new Circle(x, y, dx, dy, radius));
    }
}

function animate() {
    drawingContext.clearRect(0, 0, width, height);
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

// canvas 반응형
function windowResized() {
    resizeCanvas(windowWidth - 10, windowHeight - 10);
    init();
}

// 처음 시작 시 검은화면
function showoverlay() {
    mainSong = loadSound('../musics/example/00.mp3', loaded);
    setTimeout(function () {
        //버튼 display
        $(".btn").css('display', "flex").animate({
            'opacity': 1
        }, 400, "linear")
    }, 2000)
}


function loaded() {
    mainSong.playMode('restart');
    mainSong.setVolume(0.01);
}


//=========마우스 관련============ 
// 커서 위치
$(window).mousemove(function (e) {
    $(".cursor").css({
        left: mouse.x - 15,
        top: mouse.y - 15,
    });
});

// 마우스 클릭시
$(window).mousedown(function (e) {
    $(".cursor").addClass("active");
})

// 마우스 up시 (mousedown을 길게 누르면 mouseup 인식 안될 수 있어서 대체)
$(window).click(function (e) {
    $(".cursor").removeClass("active");
})

$(function () {
    // click이나 gesture가 없으면 play 자체가 되지 않아 btn 추가
    $(".btn").click(function () {
        for (let i = 0; i < 9; i++) {
            song[i] = loadSound(`${musicList[i]}`);
        }
        $(".LoadingOverlay").removeClass("active");
        $(".LoadingOverlay").remove();
        mainSong.loop();
    })

    //=========방 입장 관련============ 
    // 방 입장
    $(".section").click(function () {
        secondSong = $(this).index();
        let data = JSON.parse(localStorage.getItem(`m${secondSong}`));
        $(".song_container").empty();
        $(".curtain").animate({
            "top": 0,
            "background": color[secondSong]
        }, 400, "swing").css("background-color", colorarray[secondSong].main);
        $(".txt>h1").text(data[0]);
        console.log(data[0])
        // 리스트 추가
        for (let i = 1; i <= data.length - 1; i++) {
            let bubble = `
            <div class="song">
                <h1>${data[i].title}</h1>
                <h2>-&nbsp${data[i].singer}</h2>
            </div>`;
            $(".song_container").append(bubble);
        }
        $(".back").css("display", "block");
        $(".road").css("src", `../img/main/road/${secondSong+1}.png`);
        setTimeout(function () {
            mainSong.pause();
            $(".enter_container").animate({
                    "opacity": 1
                }, 400, "swing"),
                $(".txt").animate({
                    "opacity": 1
                }, 400, "swing"),
                $(".back").animate({
                    "opacity": 1
                }, 400, "swing");
        }, 400);
        setTimeout(function () {
            song[secondSong].loop();
            secondPlaying = 1;
        }, 1000)
    })


    // 뒤로 가기 클릭시 방에서 나감
    $(".back").click(function () {
        song[secondSong].stop();
        secondPlaying = 0;

        $(".enter_container").animate({
                "opacity": 0
            }, 400, "swing"),
            $(".txt").animate({
                "opacity": 0
            }, 400, "swing"),
            $(".back").animate({
                "opacity": 0
            }, 400, "swing");

        setTimeout(function () {
            $(".curtain").animate({
                "top": windowHeight,
                "background": '#fff'
            }, 400, "swing").css("background-color", color[$(this).index()]);
            mainSong.play();
        }, 400);
    })

    // 방문 클릭시 입장
    $(".entering").click(function () {
        secondStop = 1;
        sx = song[secondSong].getVolume();
        linkLocation = `./music.html`;
        let num = windowWidth / 2 - $(this).innerWidth() / 2;
        $(".txt").animate({
                "opacity": 0
            }, 400, "swing"),
            $(".back").animate({
                "opacity": 0
            }, 400, "swing"),
            $(".road").animate({
                "opacity": 0
            }, 400, "swing"),
            $(".entering").animate({
                "margin-right": num
            }, 1000, "swing");
        $(".txt").remove(), $(".back").remove();
        secondStop = 1;
        setTimeout(function () {
            $(".entering").animate({
                "opacity": 0
            }, 900, "swing")
            setTimeout(function () {
                localStorage.setItem("section", secondSong);
                window.location = linkLocation;
            }, 1100)
        }, 2000);
    })
})