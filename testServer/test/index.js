const path = require('path');
const bodyParser = require('body-parser');
var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
const _ = require('lodash');

const app = express();
app.use(bodyParser.json());
const DIST_DIR = __dirname;
const PORT = 8888;

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

// 접속 인증
app.post(['/app/auth'], (req, res) => {
  console.log('접속 인증 요청...');
  console.log(`세션: ${req.sessionID}`);

  setTimeout(() => {
    console.log('인증 성공...');
    res.json();
  }, 2000);
});

// 로그아웃
app.get(['/app/auth/logout'], (req, res) => {
  console.log('logout');

  setTimeout(() => {
    res.json('ok');
  }, 2000);
});

//로그인 인증 (세션아이디 습득)
app.post(['/app/auth/login/', '/app/login'], (req, res) => {
  console.log('로그인 요청...');
  const { id, pw } = req.body;
  console.log(req.body);

  if (id === 'admin' && pw === '1234') {
    setTimeout(() => {
      console.log('로그인 성공...');
      returnResInfo = {
        name: '관리자',
        main_seq: '0',
        grade: 'manager',
        nick_name: '테스터',
        user_id: 'admin'
      };
      res.json(returnResInfo);
    }, 2000);
  } else {
    console.log('로그인 실패...');
    res.status(500).send('error');
  }
});

// 메인 데이터 요청
app.get(
  ['/app/main', '/app/main/0', '/app/main/2', '/app/main/all'],
  (req, res) => {
    console.log('메인화면 데이터 요청...');
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
    returnResInfo.headerInfo.headerMenu.siteId = 'all';
    returnResInfo.headerInfo.headerMenu.siteList = [
      {
        //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
        //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
        name: '12kW급 테스트베드 (목포)',
        siteId: 'all'
      },
      {
        //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
        //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
        name: '6kW급 테스트베드 (나주)',
        siteId: '0'
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
      currKwYaxisMax: 10, //현재 최대 발전량
      dailyPower: _.random(0, 100), //금일발전량
      monthPower: _.random(0, 100), //당월발전량
      comulativePower: _.random(0, 100) //누적발전량
      //농지 현황 그래프 데이터
    };
    returnResInfo.containerInfo.growthEnv = {
      lux: 1576.4,
      co2: 388,
      soilWaterValue: _.random(0, 100),
      soilTemperature: _.random(0, 40),
      soilReh: _.random(0, 100),
      outsideAirTemperature: _.random(0, 40),
      outsideAirReh: _.random(0, 100),
      inclinedSolar: 861.1
    };

    res.json(returnResInfo);
    //   res.status(200).send('hi');
  }
);

// 트렌드 페이지 데이터 요청
app.get(
  ['/app/trend', '/app/trend/0', '/app/trend/1', '/app/trend/all'],
  (req, res) => {
    console.log('트렌드 페이지 데이터 요청...');
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
        inverterTrendList: [],
        sensorTrendList: []
      }
    };
    returnResInfo.headerInfo.headerMenu.siteId = 'all';
    returnResInfo.headerInfo.headerMenu.siteList = [
      {
        //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
        //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
        name: '12kW급 테스트베드 (목포)',
        siteId: 'all'
      },
      {
        //FIXME: 일단 생각없이 적어보자 ㅡㅡ..
        //TODO: 장소 정보 (mainSeq, placeName, company, amount) or siteName?
        name: '6kW급 테스트베드 (나주)',
        siteId: '0'
      }
    ];

    returnResInfo.headerInfo.headerEnv.currWeatherCastInfo = {
      inclinedSolar: _.random(0, 100), // 경사 일사량,
      ws: _.random(0, 100), // 풍속
      temp: _.random(0, 100), // 기온
      wf: _.random(1, 7) // 날씨
    };
    returnResInfo.containerInfo.sensorTrendList = [
      //   {
      //     domId: 'solarChart',
      //     title: '일사량 정보',
      //     subtitle: '경사 일사량, 수평 일사량, 모듈 하부 일사량',
      //     yAxis: [
      //       {
      //         yTitle: '일사량',
      //         dataUnit: ' W/m²'
      //       }
      //     ],
      //     plotSeries: {
      //       pointStart: 1552633200000,
      //       pointInterval: 3600000
      //     },
      //     series: [
      //       {
      //         name: '경사 일사량 001',
      //         color: '#212529',
      //         tooltip: {
      //           valueSuffix: ' W/m²'
      //         },
      //         data: [33.3, 254, 455.8, 221, 570.2, 752.8, 121.5]
      //       },
      //       {
      //         name: '경사 일사량 004',
      //         color: '#99e9f2',
      //         tooltip: {
      //           valueSuffix: ' W/m²'
      //         },
      //         data: [31, 191.4, 378.4, 208.5, 566.4, 766.7, 137]
      //       },
      //       {
      //         name: '수평 일사량 007',
      //         color: '#fdc836',
      //         tooltip: {
      //           valueSuffix: ' W/m²'
      //         },
      //         data: [48, 324.1, 564.9, 317.1, 749.5, 1014.9, 174.8]
      //       },
      //       {
      //         name: '모듈 하부 일사량 002',
      //         color: '#a498e6',
      //         tooltip: {
      //           valueSuffix: ' W/m²'
      //         },
      //         data: [15.2, 113.4, 206.7, 108.1, 310, 281, 58.1]
      //       },
      //       {
      //         name: '모듈 하부 일사량 005',
      //         color: '#a57685',
      //         tooltip: {
      //           valueSuffix: ' W/m²'
      //         },
      //         data: [16, 124, 215, 111.6, 249.4, 572.8, 60.1]
      //       }
      //     ]
      //   },
      //   {
      //     domId: 'luxChart',
      //     title: '조도 정보',
      //     subtitle: '',
      //     yAxis: [
      //       {
      //         yTitle: '조도',
      //         dataUnit: ' lx'
      //       }
      //     ],
      //     plotSeries: {
      //       pointStart: 1552633200000,
      //       pointInterval: 3600000
      //     },
      //     series: [
      //       {
      //         name: '조도 001',
      //         color: '#212529',
      //         tooltip: {
      //           valueSuffix: ' lx'
      //         },
      //         data: [612.4, 3983.7, 7244.8, 4078.2, 9660.6, 16474.4, 2284.3]
      //       },
      //       {
      //         name: '조도 002',
      //         color: '#fcc2d7',
      //         tooltip: {
      //           valueSuffix: ' lx'
      //         },
      //         data: [589.5, 3659.7, 6726, 3836.6, 10109.3, 11523.4, 2249.2]
      //       },
      //       {
      //         name: '조도 003',
      //         color: '#d0bfff',
      //         tooltip: {
      //           valueSuffix: ' lx'
      //         },
      //         data: [568.4, 3544.3, 6235.6, 3714.2, 9953.8, 12147.5, 2182.5]
      //       },
      //       {
      //         name: '조도 004',
      //         color: '#99e9f2',
      //         tooltip: {
      //           valueSuffix: ' lx'
      //         },
      //         data: [616.7, 4042.1, 7194.9, 4005.9, 9122.2, 15508.5, 2301]
      //       },
      //       {
      //         name: '조도 005',
      //         color: '#fd7e14',
      //         tooltip: {
      //           valueSuffix: ' lx'
      //         },
      //         data: [585.2, 3809.3, 6770.5, 3820.2, 8666.8, 15481.9, 2201.5]
      //       },
      //       {
      //         name: '조도 006',
      //         color: '#a9e34b',
      //         tooltip: {
      //           valueSuffix: ' lx'
      //         },
      //         data: [614.4, 3997.4, 7036.6, 3983.1, 9025.7, 16089.5, 2246.5]
      //       },
      //       {
      //         name: '조도 007',
      //         color: '#ffe066',
      //         tooltip: {
      //           valueSuffix: ' lx'
      //         },
      //         data: [1125.9, 6886.8, 12293.8, 7363.8, 18125.6, 25019.1, 4481.6]
      //       }
      //     ]
      //   },
      //   {
      //     domId: 'waterValueChart',
      //     title: '양액 농도 정보',
      //     subtitle: '',
      //     yAxis: [
      //       {
      //         yTitle: '양액 농도',
      //         dataUnit: ' %'
      //       }
      //     ],
      //     plotSeries: {
      //       pointStart: 1552633200000,
      //       pointInterval: 3600000
      //     },
      //     series: [
      //       {
      //         name: '토양 수분 값 001',
      //         color: '#212529',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [0, 0, 0, 0, 0, 0, 0]
      //       },
      //       {
      //         name: '토양 수분 값 002',
      //         color: '#fcc2d7',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [15.9, 16, 15.9, 16, 16, 16, 16]
      //       },
      //       {
      //         name: '토양 수분 값 003',
      //         color: '#d0bfff',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [0, 0, 0, 0, 0, 0, 0]
      //       },
      //       {
      //         name: '토양 수분 값 004',
      //         color: '#99e9f2',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [16.5, 16.5, 16.5, 16.4, 16.4, 16.4, 16.4]
      //       },
      //       {
      //         name: '토양 수분 값 005',
      //         color: '#fd7e14',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [20.1, 20.1, 20.1, 20.1, 20.1, 20.2, 20.2]
      //       },
      //       {
      //         name: '토양 수분 값 006',
      //         color: '#a9e34b',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [16.7, 16.7, 16.7, 16.7, 16.7, 16.7, 16.7]
      //       },
      //       {
      //         name: '토양 수분 값 007',
      //         color: '#ffe066',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [0, 0, 0, 0, 0, 0, 0]
      //       }
      //     ]
      //   },
      //   {
      //     domId: 'temperatureChart',
      //     title: '온도 정보',
      //     subtitle: '토양 온도, 외기 온도',
      //     yAxis: [
      //       {
      //         yTitle: '온도',
      //         dataUnit: ' ℃'
      //       }
      //     ],
      //     plotSeries: {
      //       pointStart: 1552633200000,
      //       pointInterval: 3600000
      //     },
      //     series: [
      //       {
      //         name: '토양 온도 001',
      //         color: '#212529',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [6.2, 6.3, 6.5, 6.8, 7.2, 7.5, 8]
      //       },
      //       {
      //         name: '토양 온도 002',
      //         color: '#fcc2d7',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [6.2, 6.3, 6.3, 6.5, 6.6, 6.9, 7.1]
      //       },
      //       {
      //         name: '토양 온도 003',
      //         color: '#d0bfff',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [6.5, 6.5, 6.5, 6.6, 6.6, 6.8, 6.9]
      //       },
      //       {
      //         name: '토양 온도 004',
      //         color: '#99e9f2',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [6.6, 6.6, 6.6, 6.6, 6.7, 6.8, 6.9]
      //       },
      //       {
      //         name: '토양 온도 005',
      //         color: '#fd7e14',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [6.3, 6.3, 6.4, 6.5, 6.7, 6.9, 7.2]
      //       },
      //       {
      //         name: '토양 온도 006',
      //         color: '#a9e34b',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [6, 6, 6.1, 6.3, 6.5, 6.7, 7.1]
      //       },
      //       {
      //         name: '토양 온도 007',
      //         color: '#ffe066',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [7, 7, 7, 7.1, 7.3, 7.5, 7.8]
      //       },
      //       {
      //         name: '외기 온도 007',
      //         color: '#aeba3a',
      //         tooltip: {
      //           valueSuffix: ' ℃'
      //         },
      //         data: [7.1, 8.7, 10.4, 10.3, 12.1, 12.8, 10.9]
      //       }
      //     ]
      //   },
      //   {
      //     domId: 'rehChart',
      //     title: '습도 정보',
      //     subtitle: '토양 습도, 외기 습도',
      //     yAxis: [
      //       {
      //         yTitle: '습도',
      //         dataUnit: ' %'
      //       }
      //     ],
      //     plotSeries: {
      //       pointStart: 1552633200000,
      //       pointInterval: 3600000
      //     },
      //     series: [
      //       {
      //         name: '토양 습도 001',
      //         color: '#212529',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [31.4, 31.3, 31.3, 31.4, 31.4, 31.5, 31.6]
      //       },
      //       {
      //         name: '토양 습도 002',
      //         color: '#fcc2d7',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [31.9, 31.9, 31.9, 32, 32, 32, 31.9]
      //       },
      //       {
      //         name: '토양 습도 003',
      //         color: '#d0bfff',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [34.8, 34.8, 34.8, 34.8, 34.8, 34.8, 34.8]
      //       },
      //       {
      //         name: '토양 습도 004',
      //         color: '#99e9f2',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [33.5, 33.5, 33.5, 33.6, 33.6, 33.6, 33.7]
      //       },
      //       {
      //         name: '토양 습도 005',
      //         color: '#fd7e14',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [31.3, 31.3, 31.3, 31.3, 31.3, 31.3, 31.3]
      //       },
      //       {
      //         name: '토양 습도 006',
      //         color: '#a9e34b',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [32.3, 32.3, 32.3, 32.4, 32.5, 32.5, 32.5]
      //       },
      //       {
      //         name: '토양 습도 007',
      //         color: '#ffe066',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [37.5, 37.5, 37.5, 37.6, 37.6, 37.6, 37.7]
      //       },
      //       {
      //         name: '외기 습도 007',
      //         color: '#ec943b',
      //         tooltip: {
      //           valueSuffix: ' %'
      //         },
      //         data: [99.9, 99.9, 95.6, 92.6, 76.9, 71.1, 76.5]
      //       }
      //     ]
      //   },
      //   {
      //     domId: 'windSpeedChart',
      //     title: '풍속 정보',
      //     subtitle: '',
      //     yAxis: [
      //       {
      //         yTitle: '풍속',
      //         dataUnit: ' m/s'
      //       }
      //     ],
      //     plotSeries: {
      //       pointStart: 1552633200000,
      //       pointInterval: 3600000
      //     },
      //     series: [
      //       {
      //         name: '풍속 007',
      //         color: '#ffe066',
      //         tooltip: {
      //           valueSuffix: ' m/s'
      //         },
      //         data: [1.2, 1.6, 2, 1.8, 2.4, 3.5, 3.1]
      //       }
      //     ]
      //   },
      //   {
      //     domId: 'co2Chart',
      //     title: '이산화탄소 정보',
      //     subtitle: '',
      //     yAxis: [
      //       {
      //         yTitle: 'co2',
      //         dataUnit: ' ppm'
      //       }
      //     ],
      //     plotSeries: {
      //       pointStart: 1552633200000,
      //       pointInterval: 3600000
      //     },
      //     series: [
      //       {
      //         name: '이산화탄소 001',
      //         color: '#212529',
      //         tooltip: {
      //           valueSuffix: ' ppm'
      //         },
      //         data: [637.2, 701.9, 722.8, 729.9, 848.6, 779.2, 756]
      //       },
      //       {
      //         name: '이산화탄소 002',
      //         color: '#fcc2d7',
      //         tooltip: {
      //           valueSuffix: ' ppm'
      //         },
      //         data: [1011.8, 1073.3, 1064.5, 1007.1, 1106.8, 1127.5, 1113.4]
      //       },
      //       {
      //         name: '이산화탄소 003',
      //         color: '#d0bfff',
      //         tooltip: {
      //           valueSuffix: ' ppm'
      //         },
      //         data: [1461.9, 1517, 1398.2, 1281.4, 1360.9, 1250.3, 1097.6]
      //       },
      //       {
      //         name: '이산화탄소 004',
      //         color: '#99e9f2',
      //         tooltip: {
      //           valueSuffix: ' ppm'
      //         },
      //         data: [502.4, 500.6, 461, 462.2, 437.9, 407.9, 411.8]
      //       },
      //       {
      //         name: '이산화탄소 005',
      //         color: '#fd7e14',
      //         tooltip: {
      //           valueSuffix: ' ppm'
      //         },
      //         data: [836.4, 881.4, 889.6, 846, 881.9, 868.2, 762.2]
      //       },
      //       {
      //         name: '이산화탄소 006',
      //         color: '#a9e34b',
      //         tooltip: {
      //           valueSuffix: ' ppm'
      //         },
      //         data: [688.8, 723.4, 659.5, 637, 697, 640, 568]
      //       },
      //       {
      //         name: '이산화탄소 007',
      //         color: '#ffe066',
      //         tooltip: {
      //           valueSuffix: ' ppm'
      //         },
      //         data: [549.9, 556.3, 554.1, 564, 551.4, 551, 548.8]
      //       }
      //     ]
      //   },
      {
        domId: 'r1Chart',
        title: '시간당 강우량 정보',
        subtitle: '',
        yAxis: [
          {
            yTitle: '강우량',
            dataUnit: ' mm/h'
          }
        ],
        plotSeries: {
          pointStart: 1552633200000,
          pointInterval: 3600000
        },
        series: [
          {
            name: '시간당 강우량 007',
            color: '#ffe066',
            tooltip: {
              valueSuffix: ' mm/h'
            },
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      {
        domId: 'isRainChart',
        title: '강우 감지 여부 정보',
        subtitle: '',
        yAxis: [
          {
            yTitle: '강우 감지 여부',
            dataUnit: ''
          }
        ],
        plotSeries: {
          pointStart: 1552633200000,
          pointInterval: 3600000
        },
        series: [
          {
            name: '강우 감지 여부 007',
            color: '#ffe066',
            tooltip: {
              valueSuffix: ''
            },
            data: [0, 0, 0, 0, 0, 0, 0.3]
          }
        ]
      }
    ];

    setTimeout(() => {
      res.json(returnResInfo);
    }, 2000);
  }
);

app.get(['/fieldView', '/fieldView/0', '/fieldView/1'], (req, res) => {
  console.log('Request!!!');
  const returnResInfo = {};
  res.json(returnResInfo);
});

app.get(
  ['/app/control/0', '/app/control/1', , '/app/control/all'],
  (req, res) => {
    console.log('hihi');
    const pump = 0;
    setTimeout(() => {
      res.json(pump);
    }, 2000);
  }
);

app.post(
  ['/app/control/', '/app/control/0', '/app/control/1', '/app/control/all'],
  (req, res) => {
    console.log(req.body);
    setTimeout(() => {
      res.json('hihi');
    }, 2000);
  }
);
app.post(
  ['/app/control/', '/app/control/0', '/app/control/1', '/app/control/all'],
  (req, res) => {
    console.log(req.body);
    setTimeout(() => {
      res.json('hihi');
    }, 2000);
  }
);

app.listen(PORT, () => {
  console.log('Server Listen', PORT);
});
