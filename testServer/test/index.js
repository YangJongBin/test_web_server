const path = require("path");
const bodyParser = require("body-parser");
var express = require("express");
var parseurl = require("parseurl");
var session = require("express-session");
const _ = require("lodash");

const app = express();
app.use(bodyParser.json());
const DIST_DIR = __dirname;
const PORT = 8080;
let testSession;

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
  })
);

app.use(function(req, res, next) {
  if (!req.session.views) {
    req.session.views = {};
  }
  // get the url pathname
  var pathname = parseurl(req).pathname;

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
  next();
});

app.use(express.static(path.resolve(DIST_DIR)));

app.get(["/app/auth/logout"], (req, res) => {
  console.log("logout");

  setTimeout(() => {
    res.json("ok");
  }, 2000);
});
app.post(["/auth/login"], (req, res) => {
  console.log("LOGIN_REQUEST");
  const { userId, password } = req.body;
  console.log(req.body);
  const returnResInfo = {};

  //FIXME: 세션아이디 확인
  if (userId === "admin" && password === "1234") {
    setTimeout(() => {
      console.log("login success");
      returnResInfo = {
        name: "관리자",
        main_seq: "0",
        grade: "manager"
      };
      testSession = req.sessionID;
      res.json(returnResInfo);
    }, 2000);
  } else {
    res.status(500).send("error");
  }
});

app.get(["/app/main", "/app/main/0", "/app/main/2"], (req, res) => {
  const returnResInfo = {
    headerInfo: {
      headerEnv: {
        currWeatherCastInfo: {
          inclinedSolar: 0,
          ws: 0,
          wf: 0,
          temp: 0
        }
      },
      headerMenu: {
        naviId: undefined,
        siteId: undefined,
        siteList: undefined
      }
    },
    containerInfo: {
      powerGenerationInfo: {},
      growthEnv: {}
    }
  };

  returnResInfo.headerInfo.headerMenu.siteList = [
    {
      //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
      //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
      name: "6kW급 테스트베드 (나주)",
      siteId: "0"
    },
    {
      //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
      //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
      name: "12kW급 테스트베드 (목포)",
      siteId: "1"
    }
  ];
  returnResInfo.headerInfo.headerEnv.currWeatherCastInfo = {
    inclinedSolar: _.random(0, 100), // 경사 일사량,
    ws: _.random(0, 100), // 풍속
    temp: _.random(0, 100), // 기온
    wf: _.random(1, 7) // 날씨
  };
  returnResInfo.containerInfo.powerGenerationInfo = {
    currKw: _.random(0, 10), //현재발전량 = 현재출력
    currKwMax: _.random(0, 10), //현재 최대 발전량
    dailyPower: _.random(0, 100), //금일발전량
    monthPower: _.random(0, 100), //당월발전량
    comulativePower: _.random(0, 100) //누적발전량
    //농지 현황 그래프 데이터
  };
  returnResInfo.containerInfo.growthEnv = {};

  setTimeout(() => {
    res.json(returnResInfo);
    // res.status(500).send("hi");
  }, 2000);
});

app.get(["/trend", "/trend/0", "/trend/1"], (req, res) => {
  const returnResInfo = {
    headerInfo: {
      headerEnv: {},
      placeList: [{}]
    },
    containerInfo: {
      solarChartInfo: {}, // 일사량 차트 정보
      luxChartInfo: {}, // 조도 차트 정보
      waterValueChartInfo: {}, // 양액 농도 차트 정보
      temperatureChartInfo: {}, // 온도 차트 정보
      rehChartInfo: {}, // 습도 차트 정보
      windSpeedChartInfo: {}, // 풍속 차트 정보
      co2ChartInfo: {}, // 이산화탄소 차트 정보
      r1ChartInfo: {}, // 시간당 강우량 차트 정보
      isRainChartInfo: {} // 강우 감지 여부 차트 정보
    }
  };

  returnResInfo.containerInfo = {
    solarChartInfo: {},
    luxChartInfo: {},
    waterValueChartInfo: {},
    temperatureChartInfo: {},
    rehChartInfo: {},
    windSpeedChartInfo: {},
    co2ChartInfo: {},
    r1ChartInfo: {},
    isRainChartInfo: {}
  };

  res.json(returnResInfo);
});

app.get(["/fieldView", "/fieldView/0", "/fieldView/1"], (req, res) => {
  console.log("Request!!!");
  const returnResInfo = {};
  res.json(returnResInfo);
});

app.post(["/app/control/", "/app/control/0", "/app/control/1"], (req, res) => {
  console.log(req.body);
  res.json("hihi");
});
app.post(["/app/control/", "/app/control/0", "/app/control/1"], (req, res) => {
  console.log(req.body);
  res.json("hihi");
});

app.listen(PORT, () => {
  console.log("Server Listen", PORT);
});
