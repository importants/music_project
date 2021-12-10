let door;
let bg;
let h1;
let text3d;
let pipe;
let mouse = {
    x: undefined,
    y: undefined
}

let x = 0;
let y = 0;
let mx = 0;
let my = 0;
let speed = 0.009;

$(function () {
    // draw()와 비슷한 기능
    loop();

    // 마우스 움직임
    window.addEventListener("mousemove", mouseFunc, false);

    // mian 입장
    $(".door").click(function () {
        linkLocation = "./main.html";
        $(".overlay_container").css("display", "block").animate({
            "opacity": 1,
        }, 400).addClass("active")
        setTimeout(function () {
            window.location = linkLocation;
        }, 1000);
    })
    // 마우스 위치에 따라서 easing 함수로 animation
    function loop() {
        mx += (x - mx) * speed;
        my += (y - my) * speed;
        $(".door").css("transform", "translate(" + (mx / 10) + "px," + (my / 10) + "px)");
        $(".txt").css("transform", "translate3d(" + -(mx / 5) + "px," + -(my / 5) + "px,0)  rotate3d(0,1,0," + -mx / 20 + "deg)");
        // 프레임단위로 loop
        window.requestAnimationFrame(loop);
    }

    //마우스 위치
    function mouseFunc(e) {
        x = (e.clientX - window.innerWidth / 2);
        y = (e.clientY - window.innerHeight / 2);
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
})

// 마우스 down
$(window).mousedown(function () {
    $(".cursor").addClass("active");
})

// 마우스 up (down을 길게 누르면 up event 실행 안됨 - click으로 대체)
$(window).click(function () {
    $(".cursor").removeClass("active");
})

// 마우스 위치값
$(window).mousemove(function () {
    $(".cursor").css({
        left: mouse.x - 15,
        top: mouse.y - 15,
    });
});

// 데이터 (서버 대체)
let m0 = [
        'dance', {
            music: "../musics/00/00.mp3",
            singer: "BTS",
            title: "BTS Permission to Dance",
            musicImg: "../musics/00/00.jpg",
        }, {
            music: "../musics/00/01.mp3",
            singer: "David Guetta",
            title: "Hey Mama, (ft. Nicki Minaj, Bebe Rexha)",
            musicImg: "../musics/00/01.jpg",
        }, {
            music: "../musics/00/02.mp3",
            singer: "Mark Ronson",
            title: "Uptown Funk_ ft. Bruno Mars",
            musicImg: "../musics/00/02.jpg",
        }
    ],
    m1 = [
        'pop', {
            music: "../musics/01/00.mp3",
            singer: "Ariana Grande & Justin Bieber",
            title: "Stuck with U",
            musicImg: "../musics/01/00.jpg",
        }, {
            music: "../musics/01/01.mp3",
            singer: "Dua Lipa",
            title: "Don't Start Now",
            musicImg: "../musics/01/01.jpg",
        }, {
            music: "../musics/01/02.mp3",
            singer: "Lizzo",
            title: "Juice",
            musicImg: "../musics/01/02.jpg",
        }
    ],
    m2 = [
        'rap', {
            music: "../musics/02/00.mp3",
            singer: "Post Malone",
            title: "Psycho  ft. Ty Dolla $ign",
            musicImg: "../musics/02/00.jpg",
        }, {
            music: "../musics/02/01.mp3",
            singer: "sokodomo ",
            title: "회전목마 (Feat. Zion.T, 원슈타인) (Prod. Slom)",
            musicImg: "../musics/02/01.jpg",
        }, {
            music: "../musics/02/02.mp3",
            singer: "다이나믹듀오 ",
            title: "죽일 놈",
            musicImg: "../musics/02/02.jpg",
        }
    ],
    m3 = [
        'indie', {
            music: "../musics/03/00.mp3",
            singer: "10센치 (10cm)",
            title: "방에 모기가 있어 (Do You Think Of Me)",
            musicImg: "../musics/03/00.jpg",
        }, {
            music: "../musics/03/01.mp3",
            singer: "밀리그램(Milligram)",
            title: "어른이 되면(AM 0213)",
            musicImg: "../musics/03/01.jpg",
        }, {
            music: "../musics/03/02.mp3",
            singer: "적재",
            title: "별 보러 가자",
            musicImg: "../musics/03/02.jpg",
        }
    ],
    m4 = [
        'solo', {
            music: "../musics/04/00.mp3",
            singer: "nawhij",
            title: "cloud nine",
            musicImg: "../musics/04/00.jpg",
        }, {
            music: "../musics/04/01.mp3",
            singer: "Pink Sweat$",
            title: "Honesty",
            musicImg: "../musics/04/01.jpg",
        }, {
            music: "../musics/04/02.mp3",
            singer: "Sole(쏠)",
            title: "Slow",
            musicImg: "../musics/04/02.jpg",
        }
    ],
    m5 = [
        'electronic', {
            music: "../musics/05/00.mp3",
            singer: "Deepshower(딥 샤워)",
            title: "DRIVEANDLOVE",
            musicImg: "../musics/05/00.jpg",
        }, {
            music: "../musics/05/01.mp3",
            singer: "Sima Kim & Ryuei Kotoge",
            title: "Rêveur",
            musicImg: "../musics/05/01.jpg",
        }, {
            music: "../musics/05/02.mp3",
            singer: "리듬킹(RTMKNG)",
            title: "Into You",
            musicImg: "../musics/05/02.jpg",
        }
    ],
    m6 = [
        'urban', {
            music: "../musics/06/00.mp3",
            singer: "D2ear",
            title: "Board Game (Feat. 크루셜스타)",
            musicImg: "../musics/06/00.jpg",
        }, {
            music: "../musics/06/01.mp3",
            singer: "MaterClass",
            title: "NO.467 (№ series)",
            musicImg: "../musics/06/01.jpg",
        }, {
            music: "../musics/06/02.mp3",
            singer: "콜린(COLL!N)",
            title: "ORANGE",
            musicImg: "../musics/06/02.jpg",
        }
    ],
    m7 = [
        'soul', {
            music: "../musics/07/00.mp3",
            singer: "Bruno Mars",
            title: "Talking to the moon",
            musicImg: "../musics/07/00.jpg",
        }, {
            music: "../musics/07/01.mp3",
            singer: "Colde",
            title: "Your Dog Loves You (Feat. Crush)",
            musicImg: "../musics/07/01.jpg",
        }, {
            music: "../musics/07/02.mp3",
            singer: "DEAN",
            title: "D (Half Moon) (ft. Gaeko)",
            musicImg: "../musics/07/02.jpg",
        }
    ],
    m8 = [
        'ballade', {
            music: "../musics/08/00.mp3",
            singer: "High",
            title: "5 Seconds Of Summer (5 SOS)",
            musicImg: "../musics/08/00.jpg",
        }, {
            music: "../musics/08/01.mp3",
            singer: "Lewis Capaldi",
            title: "Someone you loved",
            musicImg: "../musics/08/01.jpg",
        }, {
            music: "../musics/08/02.mp3",
            singer: "벤",
            title: "꿈의 대화",
            musicImg: "../musics/08/02.jpg",
        }
    ]

// 로컬스토리지에 배열 값 저장
localStorage.setItem(`m0`, JSON.stringify(m0));
localStorage.setItem(`m1`, JSON.stringify(m1));
localStorage.setItem(`m2`, JSON.stringify(m2));
localStorage.setItem(`m3`, JSON.stringify(m3));
localStorage.setItem(`m4`, JSON.stringify(m4));
localStorage.setItem(`m5`, JSON.stringify(m5));
localStorage.setItem(`m6`, JSON.stringify(m6));
localStorage.setItem(`m7`, JSON.stringify(m7));
localStorage.setItem(`m8`, JSON.stringify(m8));




// 배열 값 가져오려면 밑 참조
//let 배열 = JSON.parse(localStorage.getItem("키 값"));

// 일반 값 가져오려면 밑 참조
//let 변수 = JSON.parse(localStorage.getItem("키 값"));