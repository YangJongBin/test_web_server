const path = require('path');
const bodyParser = require('body-parser');
var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());
const DIST_DIR = __dirname;
const PORT = 8080;

app.use(
  session({
    secret: 'keyboard cat',
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

app.post(['/auth'], (req, res) => {
  console.dir(req.sessionID);

  const returnResInfo = {
    userInfo: {}
  };

  //FIXME: 세션아이디 확인
  if (true) {
    returnResInfo.userInfo = {
      user_name: '관리자',
      mainSeq: '0',
      grade: 'manager'
    };

    res.json(returnResInfo);
  }
});

app.get(['/main', '/main/0'], (req, res) => {
  console.log('Request!!!');
  const returnResInfo = {
    mainDataInfo: {
      placeList: [{}],
      placeDataInfo: {},
      selectedMainSeq: ''
    }
  };

  returnResInfo.mainDataInfo.placeList = [
    {
      //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
      //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
      placeName: '6kW급 테스트베드 (나주)',
      mainSeq: '0'
    },
    {
      //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
      //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
      placeName: '12kW급 테스트베드 (목포)',
      mainSeq: '1'
    }
  ];
  returnResInfo.mainDataInfo.placeDataInfo = {
    powerGenerationInfo: {
      currKw: _.random(0, 10), //현재발전량 = 현재출력
      dailyPower: _.random(0, 100), //금일발전량
      monthPower: _.random(0, 100), //당월발전량
      comulativePower: _.random(0, 100) //누적발전량
    },
    headerEnv: {
      inclinedSolar: _.random(0, 100), // 경사 일사량,
      ws: _.random(0, 100), // 풍속
      temp: _.random(0, 100), // 기온
      wf: _.random(1, 7) // 날씨
    },
    //농지 현황 그래프 데이터
    growthEnv: {}
  };
  returnResInfo.mainDataInfo.selectedMainSeq = '0';

  res.json(returnResInfo);
});

app.get(['/trend', '/trend/0', '/trend/1'], (req, res) => {
  const returnResInfo = {
    trendDataList: {}
  };

  returnResInfo.trendDataList = {
    //TODO: 일사량 정보
    solarChartInfo: {},
    //TODO: 조도 정보
    luxChartInfo: {},
    //TODO: 양액 농도 정보
    waterValueChartInfo: {},
    //TODO: 온도 정보
    temperatureChartInfo: {},
    //TODO: 습도 정보
    rehChartInfo: {},
    //TODO: 풍속 정보
    windSpeedChartInfo: {},
    //TODO: 이산화탄소 정보
    co2ChartInfo: {},
    //TODO: 시간당 강우량 정보
    r1ChartInfo: {},
    //TODO: 강우 감지 여부 정보
    isRainChartInfo: {}
  };

  res.json(returnResInfo);
});

// app.post('/auth', (req, res) => {
//   console.dir(req.sessionID);
//   console.log(req.body);

//   const { userId, password } = req.body;
//   const returnUserInfo = {
//     commandId: null,
//     isError: 1,
//     contents: 'check your id/pw'
//   };

//   if (userId === 'a' && password === 'a') {
//     returnUserInfo.isError = 0;
//     returnUserInfo.contents = {
//       session_id: 'asdfasdf',
//       main_seq: 1,
//       user_name: '관리자',
//       grade: 'manager',
//       connectUrl: 'app/main'
//       // sessionId: 'asjdkhask',
//     };
//   }

//   res.json(returnUserInfo);
// });

app.post('/auth', (req, res) => {
  // const { userId, password } = req.body;
  // console.log(userid, password);
  // const returnUserInfo = {
  //   commandId: null,
  //   isError: 1,
  //   contents: 'check your id/pw'
  // };
  // if (userId === 'a' && password === 'a') {
  //   returnUserInfo.isError = 0;
  //   returnUserInfo.contents = {
  //     session_id: 'asdfasdf',
  //     main_seq: 1,
  //     user_name: '관리자',
  //     grade: 'manager',
  //     connectUrl: 'app/main'
  //     // sessionId: 'asjdkhask',
  //   };
  // }
  // res.json(returnUserInfo);
});

app.listen(PORT, () => {
  console.log('Server Listen', PORT);
});
