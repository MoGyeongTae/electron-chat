const socket = io.connect("http://electronchat.gyeongtae.com");
// Title Component
const Title = () => (
  <div style={{width : "100%", height : "50px" , backgroundColor : "#FF9800" , display : "flex" , justifyContent : 'center', alignItems : "center"}}>
    <h2 style={{color : "white"}}>Electron Chat App Title</h2>
  </div>
)

// Chatting Style For Your Own Chat
const myStyle = {
  padding : "5px",
  float:"right",
  clear : "both",
  backgroundColor : "#FFB74D",
  borderRadius : "3px",
  height: "30px",
  marginBottom : "10px",
  display : "flex",
  alignItems : "center",
  justifyContent : "center"
}

// Chatting Style For Others
const otherStyle = {
  padding : "5px",
  float:"left",
  clear : "both",
  backgroundColor : "#4CAF50",
  borderRadius : "3px",
  height: "30px",
  marginBottom : "10px",
  display : "flex",
  alignItems : "center",
  justifyContent : "center"
}


// Chat Log Component
const Chat = (props) => (
  <div>
    {
      props.my &&
      <div style={myStyle}>{props.username} : {props.message}</div>
    }
    {
      !props.my &&
      <div style={otherStyle}>{props.username} : {props.message}</div>
    }
  </div>
)

// ChatBox Component
class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatLog : []
    }
    this.myChatBox = React.createRef();
    this.whoChat = React.createRef();
  }
  componentDidMount() {
    socket.on("receiveChat", data => {
      var newStateArray = this.state.chatLog.slice();
      var ismy = this.props.username == data.username;
      newStateArray.push({username : data.username, message : data.message, my : ismy});
      this.setState({
        chatLog : newStateArray
      })
      this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight;
    })

    socket.on("chatStart", data => {
      this.whoChat.current.style.display = "flex";
    })

    socket.on("chatEnd", data => {
      this.whoChat.current.style.display = "none";
    })
  }
  render() {
    const { chatLog } = this.state;
    const chat = chatLog.map(
      (item,idx) => (<Chat
        username = {item.username}
        message = {item.message}
        my = {item.my}
        key = {idx}
        />)
    )
    return (
      <div style={{width : "100%", height : "500px", overflowY : "scroll", marginTop : "10px", position:"relative"}} ref={this.myChatBox}>
        {chat}
        <div ref={this.whoChat} style={{display : "none", width : "50%", height : "30px", position : "fixed", backgroundColor : "#F44336", top : "470px", left : "25%", color:"white", justifyContent : "center" , alignItems : "center", borderRadius : "5px"}}>누군가 할 말을 입력중입니다</div>
      </div>
    )
  }
}

// ChatInput Component
class ChatInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input : "",
      usercon : false,
    }
  }
  onChange = e => {
    const { value } = e.target;
    this.setState((prevState, props) => {
      return {input : value}
    })
  }
  buttonClick = () => {
    socket.emit("sendChat",{username : this.props.username, message : this.state.input})
    this.setState((prevState, props) => {
      return {input : ""}
    })
  }
  onFocus = () => {
    socket.emit("startChat")
  }
  onBlur = () => {
    socket.emit("endChat")
  }
  onKeyPress = e => {
    if(e.key == "Enter") {
      this.buttonClick();
    } else {
      return;
    }
  }
  render() {
    return (
      <div style={{width : "100%", height : "50px", display : "flex" , justifyContent : "center" , alignItems : "center"}}>
        <input type="text" value={this.state.input} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} onKeyPress={this.onKeyPress}/>
        <button onClick={this.buttonClick}>Send</button>
      </div>
    )
  }
}

// Main Ui Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username : ""
    }
  }
  askNick = () => {
    if(this.state.username) {
      return;
    }
    prompt({
    title: 'Insert Your Name',
    label: 'Insert Your NickName In ChatApp Plz',
    value: '',
    inputAttrs: { // attrs to be set if using 'input'
        type: 'text'
    },
    type: 'input', // 'select' or 'input, defaults to 'input'
    })
    .then((r) => {
        if(!r) {
          this.askNick();
          return;
        }
        this.setState({
          username : r
        })

        socket.emit("initUser",{username : this.state.username})
        socket.on("overlap", data => {
          this.askNick();
        })
    })
    .catch(console.error);
  }
  componentDidMount() {
    this.askNick();
    socket.on("newUser", data => {
      notifier.notify('WelCome New User!', {
        message : `WelCome! ${data.username}!`
      })
    })
  }

  render() {
    return (
      <div>
        <Title />
        <ChatBox username={this.state.username}/>
        <ChatInput username={this.state.username}/>
      </div>
    )
  }
}

window.onload = function() {
  var root = document.getElementById("root");
  ReactDOM.render(<App />,root);
}


// 휴 힘들었ㅅ다
