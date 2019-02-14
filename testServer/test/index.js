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

//TODO: 세션 정보 인증
app.post(['/auth'], (req, res) => {
  console.dir(req.sessionID);

  const returnResInfo = {
    commandId: null,
    isError: 1,
    userInfo: {},
    mainDataList: []
  };

  //FIXME: 세션아이디 확인
  if (req.sessionID) {
    returnResInfo.isError = 0;
    returnResInfo.userInfo = {
      //TODO: 결과는 유저에 대한 정보를 받아오면된다.
      userInfo: {
        user_name: '관리자',
        grade: 'manager'
      }
    };
    returnResInfo.mainDataList = [
      {
        //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
        //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
        mainSeq: '0',
        placeName: '6kW급 테스트베드 (나주)',
        dataInfo: {
          environmentInfo: {
            inclinedSolar: _.random(0, 100), // 경사 일사량,
            ws: _.random(0, 100), // 풍속
            temp: _.random(0, 100), // 온도
            wf: _.random(1, 10) // 날씨
          },
          nowPower: _.random(0, 10), //현재발전량 = 현재출력
          dailyPower: _.random(0, 100), //금일발전량
          monthPower: _.random(0, 100), //당월발전량
          comulativePower: _.random(0, 100), //누적발전량
          //농지 현황 그래프 데이터
          farmlandStatusGraphConfig: {
            chart: {
              type: 'column'
            },
            title: {
              text: ''
            },
            xAxis: {
              categories: ['토양', '외기'],
              crosshair: true
            },
            yAxis: [
              {
                labels: {
                  format: '{value} °C'
                },
                title: {
                  text: '온도'
                },
                min: -10,
                max: 40,
                tickInterval: 10
              },
              {
                labels: {
                  format: '{value} %'
                },
                title: {
                  text: '습도'
                },
                min: 0,
                max: 100,
                tickInterval: 20,
                opposite: 1
              }
            ],
            tooltip: {
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              },
              series: {
                threshold: -20
              }
            },
            series: [
              {
                name: '온도',
                data: [10, 0],
                color: 'red',
                tooltip: {
                  valueSuffix: ' °C'
                }
              },
              {
                name: '습도',
                data: [0, 0],
                yAxis: 1,
                tooltip: {
                  valueSuffix: ' %'
                }
              },
              {
                name: '수분',
                data: [0],
                yAxis: 1,
                tooltip: {
                  valueSuffix: ' %'
                }
              }
            ],
            credits: {
              enabled: false
            }
          }
        }
      },
      {
        //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
        //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
        mainSeq: '1',
        placeName: '16kW급 테스트베드 (나주)',
        dataInfo: {
          environmentInfo: {
            inclinedSolar: 0, // 경사 일사량,
            ws: 0, // 풍속
            temp: 0, // 온도
            wf: 3 // 날씨
          },
          nowPower: _.random(0, 100), //현재발전량 = 현재출력
          dailyPower: 0, //금일발전량
          monthPower: 0, //당월발전량
          comulativePower: 0, //누적발전량
          //농지 현황 그래프 데이터
          farmlandStatusGraphConfig: {
            chart: {
              type: 'column'
            },
            title: {
              text: ''
            },
            xAxis: {
              categories: ['토양', '외기'],
              crosshair: true
            },
            yAxis: [
              {
                labels: {
                  format: '{value} °C'
                },
                title: {
                  text: '온도'
                },
                min: -10,
                max: 40,
                tickInterval: 10
              },
              {
                labels: {
                  format: '{value} %'
                },
                title: {
                  text: '습도'
                },
                min: 0,
                max: 100,
                tickInterval: 20,
                opposite: 1
              }
            ],
            tooltip: {
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              },
              series: {
                threshold: -20
              }
            },
            series: [
              {
                name: '온도',
                data: [10, 0],
                color: 'red',
                tooltip: {
                  valueSuffix: ' °C'
                }
              },
              {
                name: '습도',
                data: [0, 0],
                yAxis: 1,
                tooltip: {
                  valueSuffix: ' %'
                }
              },
              {
                name: '수분',
                data: [0],
                yAxis: 1,
                tooltip: {
                  valueSuffix: ' %'
                }
              }
            ],
            credits: {
              enabled: false
            }
          }
        }
      }
    ];

    res.json(returnResInfo);
  }
});

//FIXME: 필요한가?
app.get(['./main'], (req, res) => {});

app.get(['./trend'], (req, res) => {
  const returnResInfo = {
    commandId: null,
    isError: 1,
    trendDataList: [
      {
        mainSeq: '',
        placeName: '',
        dataInfo: {}
      }
    ]
  };
  returnResInfo.trendDataList = [];
  returnResInfo.isError = 0;

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
