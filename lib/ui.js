const socket = io.connect("http://localhost:3000")
// Title Component
const Title = () => (
  <div style={{width : "100%", height : "50px" , backgroundColor : "#FF9800" , display : "flex" , justifyContent : 'center', alignItems : "center"}}>
    <h2 style={{color : "white"}}>Electron Chat App Title</h2>
  </div>
)

// Chat Log Component
const Chat = (props) => (
  <p>
  {props.username} : {props.message}
  </p>
)

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatLog : [

      ]
    }
  }
  componentDidMount() {
    socket.on("receiveChat", data => {
      var newStateArray = this.state.chatLog.slice();
      newStateArray.push({username : data.username, message : data.message});
      this.setState({
        chatLog : newStateArray
      })
      console.log(this.state.chatLog)
    })
  }
  render() {
    const { chatLog } = this.state;
    const chat = chatLog.map(
      (item,idx) => (<Chat
        username = {item.username}
        message = {item.message}
        key = {idx}
        />)
    )
    return (
      <div style={{width : "100%", height : "500px", overflowY : "scroll"}}>
      {chat}
      </div>
    )
  }
}

class ChatInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input : ""
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
  }
  render() {
    return (
      <div style={{width : "100%", height : "50px", display : "flex" , justifyContent : "center" , alignItems : "center"}}>
        <input type="text" onChange={this.onChange}/>
        <button onClick={this.buttonClick}>Send</button>
      </div>
    )
  }
}

// Main Ui Component
class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username : ""
    }
  }
  askNick = () => {
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
        <ChatBox/>
        <ChatInput username={this.state.username}/>
      </div>
    )
  }
}

window.onload = function() {
  var root = document.getElementById("root");
  ReactDOM.render(<App />,root);
}
