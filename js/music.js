let currentPlaying; // 현재 플레이 되고 있는지
let currentIndex; // 현재 재생되고 있는 리스트 아이템의 index
let enter = 1;
let section;
let data;
let volume = 1;
let linkLocation;
let x = 0;
let y = 0;
let mx = 0;
let my = 0;
let mouse = {
    x: undefined,
    y: undefined
}
let speed = 0.009;
let progress;
let fft;
let song = [];
let songDuration = [];


let colorarray = [{
    main: '#D3310B',
    wall: "#F7CCC2",
    floor: "#CD8979",
    window: "#FFAF9D" //linear-gradient(180deg, #D3310B 0%, #6F1500 100%)"
}, {
    main: '#DE6C36',
    wall: "#FACDB6",
    floor: "#987F73",
    window: "#FFD5C1" //linear-gradient(180deg, #FF9D6F 0%, #D75D23 100%)"
}, {
    main: '#FEBB45',
    wall: "#FFDDA4",
    floor: "#BCA479",
    window: "#454545" //linear-gradient(180deg, #FEBB45 0%, #BF8C34 100%)"
}, {
    main: '#5FB876',
    wall: "#B8DFC2",
    floor: "#718C75",
    window: "#B8DFC2" //linear-gradient(180deg, #5FB876 0%, #478A58 100%)"
}, {
    main: '#679D9F',
    wall: "#BAD2D3",
    floor: "#698484 ",
    window: "#89B9BB" //linear-gradient(180deg, #679D9F 0%, #4D7677 100%)"
}, {
    main: '#49ABC8',
    wall: "#BDE2EE",
    floor: "#64787C",
    window: "#8EC7DB" //linear-gradient(180deg, #69B8BC 0%, #4F8A8D 100%)"
}, {
    main: '#81A1E1',
    wall: "#C1D1F1",
    floor: "#606D82",
    window: "#809FDF" //"linear-gradient(180deg, #81A1E1 0%, #6179A9 100%)"
}, {
    main: '#8D8BBA',
    wall: "#B3ACC9",
    floor: "#70677B",
    window: "#7765AD" //"linear-gradient(180deg, #3A2E5D 0%, #0D071E 100%)"
}, {
    main: '#CDAF8D',
    wall: "#E3D2BF",
    floor: "#898178",
    window: "#A9A5A0" //"linear-gradient(180deg, #DEB78C 0%, #9D7445 100%)"

}];


function preload() {
    section = parseInt(localStorage.getItem("section"));
    data = JSON.parse(localStorage.getItem(`m${section}`));

    for (let i = 0; i < 3; i++) {
        song[i] = loadSound(`${data[i+1].music}`);
    }
}

function setup() {
    init();
    createCanvas($(".tv_container").innerWidth() / 2.5, $(".tv_container").innerHeight() / 2.5);
    angleMode(DEGREES)
    //fft = new p5.FFT();
    for (let i = 0; i < 3; i++) {
        songDuration[i] = song[i].duration();
    }
}

function draw() {
    // 원형 파동 표현
    // clear();
    // stroke(200);
    // noFill();

    // translate(width / 2, height / 2);
    // let wave = fft.waveform();

    // for (let t = -1; t <= 1; t += 2) {
    //     beginShape();
    //     for (let i = 0; i < 181; i += 0.5) {
    //         let index = floor(map(i, 0, 180, 0, wave.length - 1))

    //         var r = map(wave[index], -1, 1, 40, 90)
    //         var x = t * r * sin(i);
    //         var y = r * cos(i);
    //         vertex(x, y)
    //     }
    //     endShape();
    // }

    // progressing 표현
    if (currentPlaying) {
        song[currentIndex].setVolume(volume);
        progress = getProgress() * 100;
        $('.music_progressBar >div> .progress').css('width', progress + '%');
        $('.progress_container >div> .mouse').css('left', (progress + 8) + '%');
        if (!song[currentIndex]._playing && currentPlaying) {
            $('.prev').unbind("click");
            //currentPlaying = false;
            playNext();
        }
    }
}

$(function () {

    // 재생 이벤트 등록 
    $('.prev').click(function () {
        if (currentPlaying) {
            $('.prev').unbind("click");
            playPrev();
        }
    });
    $('.pause').click(function () {
        if (enter) {
            startMusic();
            enter = 0;
        } else {
            pauseAndPlay();
        }
    });
    $('.next').click(function () {
        if (currentPlaying) {
            $('.next').unbind("click");
            playNext();
        }
    });

    //volume 이벤트 등록
    $('.vUp').click(function (e) {
        volumeUp();
        e.preventDefault();
    });
    $('.vDown').click(function (e) {
        volumeDown();
        e.preventDefault();
    });
    // 채널 버튼 이벤트 등록
    $('.cUp').click(function (e) {
        $('.cUp').unbind("click");
        channelUp();
        e.preventDefault();
    });
    $('.cDown').click(function (e) {
        $('.cDown').unbind("click");
        channelDown();
        e.preventDefault();
    });

    // 전원 버튼 눌렀을때
    $(".outBtn").click(function () {
        outSection();
    })

    $(".section>div").click(function () {
        enterSection($(this).index());
    })
})

//화면 크기 변경시 
$(window).resize(function () {
    init()
})

// ===== 재생 컨트롤 함수 =====

// 방 입장 후 처음 시작시
function startMusic() {
    song[currentIndex].play();
    currentPlaying = true;
    $(`
    <h1 class="title"></h1> 
    <h2 class="singer"></h2>
    `).prependTo(".info");

    $(".pause").css("background-image", "url(../img/music/remote/pause.png)")
    $(".play").removeClass("disabled");
    fontSize(data[currentIndex + 1].title, 0);
    fontSize(data[currentIndex + 1].singer, 1);

    $(".sequence").text(`${currentIndex+1}/3`);
    $(".Lp").css("background-image", "url(" + data[currentIndex + 1].musicImg + ")").animate({
        "top": 60 + "%"
    }, 400, "swing")
}

// 일시정지 또는 플레이
function pauseAndPlay() {
    if (currentPlaying) {
        $(".pause").css("background-image", "url(../img/music/remote/play.png)")
        song[currentIndex].pause();
        currentPlaying = false;
        $(".Lp").animate({
            "top": 100 + "%"
        }, 400, "swing");
    } else {
        $(".pause").css("background-image", "url(../img/music/remote/pause.png)")
        song[currentIndex].play();
        currentPlaying = true;
        $(".Lp").animate({
            "top": 60 + "%"
        }, 400, "swing")
    }
}

// 다음곡
function playNext() {

    $(".pause").css("background-image", "url(../img/music/remote/pause.png)")
    currentPlaying = false;
    song[currentIndex].stop();
    $(".Lp").animate({
        "top": 110 + "%"
    }, 400);
    currentIndex = (currentIndex + 1) % 3;
    if (!currentPlaying)
        setTimeout(function () {
            $(".Lp").css("background-image", "url(" + data[currentIndex + 1].musicImg + ")").animate({
                "top": 60 + "%"
            }, 400);
            currentPlaying = true;
            song[currentIndex].play();
            $('.next').bind("click", function () {
                $('.next').unbind("click");
                playNext();
            });
        }, 400);
    fontSize(data[currentIndex + 1].title, 0);
    fontSize(data[currentIndex + 1].singer, 1);
    $(".sequence").text(`${currentIndex+1}/3`);

}

//이전곡
function playPrev() {

    $(".pause").css("background-image", "url(../img/music/remote/pause.png)")
    currentPlaying = false;
    song[currentIndex].stop();
    $(".Lp").animate({
        "top": 110 + "%"
    }, 400, "swing");
    if (--currentIndex == -1) {
        currentIndex = 2;
    }
    if (!currentPlaying)
        setTimeout(function () {
            currentPlaying = true;
            $(".Lp").css("background-image", "url(" + data[currentIndex + 1].musicImg + ")").animate({
                "top": 60 + "%"
            }, 400, "swing");
            song[currentIndex].play();
            $('.prev').bind("click", function () {
                $('.prev').unbind("click");
                playPrev();
            });
        }, 400);
    fontSize(data[currentIndex + 1].title, 0);
    fontSize(data[currentIndex + 1].singer, 1);
    $(".sequence").text(`${currentIndex+1}/3`);

}

// 볼륨 높이기
function volumeUp() {
    volume < 4 ? volume += 0.1 : volume;
    $(".vol").css("opacity", 1).text((volume / 4 * 100).toFixed(0));
    // 차후 1단위로 올라가게 하기 ~100
    setTimeout(function () {
        $(".vol").css("opacity", 0);
    }, 10000)
}

// 볼륨 낮추기
function volumeDown() {
    volume > 0 ? volume -= 0.1 : volume;
    $(".vol").css("opacity", 1).text((volume / 4 * 100).toFixed(0));
    setTimeout(function () {
        $(".vol").css("opacity", 0);
    }, 10000)
}



// progress 가져오기
function getProgress() {
    if (song[currentIndex]._prevUpdateTime) {
        return song[currentIndex]._prevUpdateTime / songDuration[currentIndex];
    } else {
        return 0;
    }
}

// 채널 이동 버튼 클릭시 호출
function enterSection(num) {
    if (section != num) {
        sectionIn(num)
    } else {
        $(".genre>p").animate({
            "font-size": "4.4rem"
        }, 100).animate({
            "font-size": "4.0rem"
        }, 100);
    }
}

// 채널업
function channelUp() {
    channelMove(1)
}

function channelDown() {
    channelMove(0)
}

//========기타==============
// 초기화
function init() {
    $(".overlay").css("background", colorarray[section].main);
    $(".play").addClass("disabled");
    $(".tv_container").css("bottom", $(".down").innerHeight() - $(".tv").innerHeight() / 2.4);
    $('.window_container img').addClass("none");
    changeImg(section);
    //$(".window_container>div>div").css("background", colorarray[section].window);
    $(".tv").attr("src", `../img/music/tv/${section+1}.png`);
    $(".img_container>img").attr("src", `../img/music/door/${section+1}.png`)
    $(".up").css("background", colorarray[section].wall);
    $(".down").css("background", colorarray[section].floor);
    $(".genre>p").text(data[0]);
    $(".sequence").text("리모컨 플레이 버튼을 누르세요");
    setTimeout(function () {
        $(".overlay").animate({
            "top": window.innerHeight,
        }, 400, "swing");
        currentIndex = 0;
        currentPlaying = false;
        $(".genre>p").addClass("active");
    }, 2000);
}

function changeImg(section) {
    let frame = [];
    switch (section) {
        case 0:
            $(".cat").attr("src", "../img/music/cat/dance_cat.png");
            $('.window_container img').removeClass("none");
            $(".leftWindow").attr("src", "../img/music/window/dance_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/dance_window2.png");
            break;
        case 1:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/pop_cat.png");
            $(".leftWindow").attr("src", "../img/music/window/pop_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/pop_window2.png");
            break;
        case 2:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/rapMoving_cat.gif");
            $(".leftWindow").attr("src", "../img/music/window/rap_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/rap_window2.png");
            break;
        case 3:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/indie_cat.png");
            $(".leftWindow").attr("src", "../img/music/window/indie_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/indie_window2.png");
            break;
        case 4:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/solo_cat.png");
            $(".leftWindow").attr("src", "../img/music/window/solo_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/solo_window2.png");
            break;
        case 5:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/cat.png");
            $(".leftWindow").attr("src", "../img/music/window/electronic_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/electronic_window2.png");
            break;
        case 6:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/cat.png");
            $(".leftWindow").attr("src", "../img/music/window/urban_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/urban_window2.png");
            break;
        case 7:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/cat.png");
            $(".leftWindow").attr("src", "../img/music/window/soul_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/soul_window2.png");
            break;
        case 8:
            $('.window_container img').removeClass("none");
            $(".cat").attr("src", "../img/music/cat/ballade_cat.png");
            $(".leftWindow").attr("src", "../img/music/window/ballade_window1.png");
            $(".rightWindow").attr("src", "../img/music/window/ballade_window2.png");
            break;
        default:
            $(".cat").attr("src", "../img/music/cat/cat.png");
            break;
    }
    randomFrame()
}

function randomFrame() {
    var numbers = [];
    var pickNumbers = 3;
    for (insertCur = 0; insertCur < pickNumbers; insertCur++) {
        numbers[insertCur] = Math.floor(Math.random() * 6);
        for (searchCur = 0; searchCur < insertCur; searchCur++) {
            if (numbers[insertCur] == numbers[searchCur]) {
                insertCur--;
                break;
            }
        }
    }
    console.log(numbers)
    for (let i = 0; i < 3; i++)
        $(`.frame${i+1} > img`).attr("src", `../img/music/frame/0${numbers[i]}.png`)
}

// ===== 음악 삽입 =====
function musicInsert() {
    for (let i = 0; i < 3; i++) {
        song[i] = loadSound(`${data[i+1].music}`);
    }
    setTimeout(function () {
        for (let i = 0; i < 3; i++) {
            songDuration[i] = song[i].duration();
        }
    }, 1600)
}

// tv 폰트 사이즈 조절
function fontSize(text, num) {
    let what;
    switch (num) {
        case 0:
            what = `title`;
            break;
        case 1:
            what = `singer`;
            break;
    }
    if (17 < text.length && text.length < 30) {
        $(`.${what}`).addClass("active").text(text);
    } else if (30 <= text.length) {
        $(`.${what}`).addClass("activeX").text(text);
    } else {
        $(`.${what}`).removeClass("active").removeClass("activeX").text(text);
    }
}

//채널 이동 (up,down 클릭시)
function channelMove(num) {
    switch (num) {
        case 0:
            --section == -1 ? section = 8 : section;
            setTimeout(function () {
                $('.cDown').bind("click", function () {
                    $('.cDown').unbind("click");
                    channelDown();
                });
            }, 2000)
            break;
        case 1:
            ++section == 9 ? section = 1 : section;
            setTimeout(function () {
                $('.cUp').bind("click", function () {
                    $('.cUp').unbind("click");
                    channelUp();
                });
            }, 2000)
            break;
    }
    sectionIn(section);
}

//채널 이동시 
function sectionIn(num) {
    currentPlaying = false;
    song[currentIndex].stop();
    section = num;
    $(".play").addClass("disabled");
    $(".pause").css("background-image", "url(../img/music/remote/play.png)")
    data = JSON.parse(localStorage.getItem(`m${section}`));
    localStorage.setItem("section", section);
    $(".Lp").animate({
        "top": 110 + "%"
    }, 400);
    $(".title").remove();
    $(".singer").remove();

    $(".genre>p").animate({
        "font-size": "0"
    }, 100).text(data[0]).animate({
        "font-size": "4.0rem"
    }, 100);
    $(".sequence").animate({
        "font-size": "0"
    }, 100).text("장르이동").animate({
        "font-size": "1.2rem"
    }, 100);
    // overlay up
    $(".overlay").css("background", colorarray[num].main);
    setTimeout(function () {
        $(".overlay").animate({
            "top": 0,
        }, 400, "swing");
        $(".genre>p").removeClass("active");
        setTimeout(function () {
            //음악 추가, 리셋 / enter =1로 해 처음 입장한 것처럼
            enter = 1;
            init();
            musicInsert();
        }, 400)
    }, 1000)
}

// 전원 버튼 눌렀을 때
function outSection() {
    currentPlaying = false;
    song[currentIndex].stop();
    $(".play").addClass("disabled");
    $(".inner").addClass("outSection");
    $(".pause").css("background-image", "url(../img/music/remote/play.png)");
    $(".light").css("display", "block").animate({
        "opacity": 1
    }, 400, function () {
        // $(this).animate({
        //     "opacity": 1
        // }, 800)
        // $(this).addClass('active');
    })
    linkLocation = "./main.html"
    setTimeout(function () {
        window.location = linkLocation;
    }, 1600);
};

//=========마우스 관련============ 
window.addEventListener("mousemove", mouseFunc, false);

// 마우스 위치값 
function mouseFunc(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
// 마우스 클릭시
$(window).mousedown(function (e) {
    $(".cursor").addClass("active");
})
// 마우스 up시 (mousedown을 길게 누르면 mouseup 인식 안될 수 있어서 대체)
$(window).click(function (e) {
    $(".cursor").removeClass("active");
})
// 고양이 발바닥 위치값
$(window).mousemove(function (e) {
    $(".cursor").css({
        left: mouse.x - 15,
        top: mouse.y - 15,
    });
});