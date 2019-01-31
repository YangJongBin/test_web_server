const path = require('path');
const bodyParser = require('body-parser');
var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');

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
app.post('/auth', (req, res) => {
  console.dir(req.sessionID);

  const returnUserInfo = {
    commandId: null,
    isError: 1,
    contents: ''
  };

  //FIXME: 세션아이디 확인
  if (req.sessionID) {
    returnUserInfo.isError = 0;
    returnUserInfo.contents = {
      main_seq: 1,
      user_name: '관리자',
      grade: 'manager',
    };
    res.json(returnUserInfo);
  }

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