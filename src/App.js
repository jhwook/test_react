import './App.css';
import ApexCharts from 'react-apexcharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// const cryptosocket = io()
// const loginUserSocket = io('http://users.defi1.net:33845/loginusers');

function App() {
  let [isLogin, setIsLogin] = useState(false);
  let [loginUsername, setLoginUsername] = useState('');
  let [data, setData] = useState([]);
  let [openPrice, setOpenPrice] = useState([]);
  let [currentPrice, setCurrentPrice] = useState([]);

  let socket = io('http://users.defi1.net:33845', {
    query: `username=bot111`,
  });
  // let [sessionInfo, setSessionInfo] = useState('');
  console.log('loginUsername', loginUsername);
  if (socket) {
    socket.on('connection', () => {
      console.log('this socket id', socket.id);
    });
  }
  // loginUserSocket.on('connection', (socket) => {
  //   console.log('loginUserSocket Namespace socket id', socket.id);
  // });

  // loginUserSocket.on('login', (data) => {
  //   console.log(data);
  // });
  console.log(data);

  console.log('isLogin', isLogin);
  if (isLogin) {
    socket.on('receive_direct_message', (data) => {
      console.log(data);
    });
    socket.on('receive_notification', (data) => {
      console.log(data);
    });
  }

  function Notice() {
    axios.post('http://users.defi1.net:33845/admin/notice/to/everyone', {
      message: 'send message to everyone',
    });
    console.log('this socket id', socket.id);
    console.log('send notification');
    // loginUserSocket.emit('notice', 'notification');
  }

  function Login() {
    axios
      .post('http://users.defi1.net:33845/users/login', {
        email: 'aaa@aaa.com',
        pw: '1234',
      })
      .then((resp) => {
        let { username } = resp.data;
        setLoginUsername(username);
        // setSessionInfo(resp.sessionId);
      });
    // loginUserSocket.emit('login', loginUserSocket.id);

    console.log('socket2 id', socket.id);
    setIsLogin(true);
  }

  function Login2() {
    axios
      .post('http://users.defi1.net:33845/users/login', {
        email: 'bbb@bbb.com',
        pw: '1234',
      })
      .then((resp) => {
        let { username } = resp.data;
        setLoginUsername(username);
        // setSessionInfo(resp.sessionId);
      });
    // loginUserSocket.emit('login', loginUserSocket.id);

    console.log('socket2 id', socket.id);

    setIsLogin(true);
  }

  function Logout() {
    axios.post('http://users.defi1.net:33845/users/logout').then((resp) => {
      console.log(resp);
    });
    setIsLogin(false);
  }

  function connect() {
    socket.connect();
    console.log('connected');
  }
  function disconnect() {
    // loginUserSocket.disconnect();
    console.log('disconnected');
    console.log('socket id', socket.id);
  }

  // socket.on('hello', (data) => {
  //   console.log(data);
  // });
  // socket.on('evaluate', (data) => {
  //   console.log(data);
  // });
  // socket.on('notification', (data) => {
  //   console.log(data);
  // });

  socket.on('evaluate_result', (data) => {
    // console.log(data);
    let parsedData = [];
    for (let i = 0; i < data.length; i++) {
      parsedData.push(JSON.parse(data[i]));
    }
    setData(parsedData);
    let openpricearr = [...openPrice, parsedData[0].opentickerprice];
    setOpenPrice(openpricearr);
    let currentpricearr = [...currentPrice, parsedData[0].latesttickerprice];
    setCurrentPrice(currentpricearr);
    setSeries([
      {
        name: 'openprice',
        data: openpricearr,
      },
      {
        name: 'currentprice',
        data: currentpricearr,
      },
    ]);

    // {
    //   name: 'openprice',
    //   data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    // },
    // {
    //   name: 'currentprice',
    //   data: [1, 4, 15, 41, 69, 32, 39, 31, 48],
    // },
  });
  useEffect(() => {}, [currentPrice]);
  const [options, setOptions] = useState({
    chart: {
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'Product Trends by Month',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],
    },
  });

  const [series, setSeries] = useState([
    {
      name: 'openprice',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
    {
      name: 'currentprice',
      data: [1, 4, 15, 41, 69, 32, 39, 31, 48],
    },
  ]);

  // function coinData() {
  //   axios.get('http://localhost:30559/');
  // }

  return (
    <ApexCharts
      options={options}
      series={series}
      typs="line"
      width={500}
      height={300}
    />
    // <div>
    //   {/* <button onClick={Notice}>Notice</button>
    //   <button onClick={Login}>Login_aaa</button>
    //   <button onClick={Login2}>Login_bbb</button>
    //   <button onClick={connect}>connect</button>
    //   <button onClick={disconnect}>disconnect</button> */}
    //   <ul>
    //     {data.map((el) => {
    //       <li>{el}</li>;
    //     })}
    //   </ul>
    // </div>
  );
}

export default App;
