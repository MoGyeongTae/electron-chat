const socket = io.connect("http://localhost:3000");
const currentWindow = remote.getCurrentWindow();


// Title Component
class Title extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conusers : "",
      nextchannel : "1"
    }
  }
  selectChange = e => {
    const { value } = e.target;
    this.setState({nextchannel : value})
  }
  changeChannel = () => {
    if(this.props.channel == this.state.nextchannel) {
      notifier.notify('이미 그 채널입니다', {
        message : `당신은 이미 당신이 가고싶어하는 채널에 있습니다!`
      })
      return;
    }
    socket.emit("sendChannel", {currentChannel : this.props.channel, nextChannel : this.state.nextchannel})
  }
  render() {
    return (
      <div className="title">
        <h2 style={{color : "white"}}>현재 채널 ({this.props.channel}채널)</h2>
        <select className="selectChannel" onChange={this.selectChange}>
          <option value="1">1채널</option>
          <option value="2">2채널</option>
        </select>
        <button onClick={this.changeChannel} className="btnChange">Change Channel</button>
      </div>
    )
  }
}

class StatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conusers : 0,
      conusersList : []
    }
  }

  componentDidMount() {
    socket.on("conusers", data => {
      this.setState({
        conusers : data.usercount,
        conusersList : data.userlist
      })
    })
  }

  render() {
    const { conusersList } = this.state
    const userlist = conusersList.map(
      (item, idx) => (
        <div className="userlistItem">
          {item.username}
          <div className="online"></div>
        </div>
      )
    )
    return (
      <div className="statusBar">
        <div className="currentUsers">
          <p>현재 유저 수 : {this.state.conusers}</p>
        </div>
        <div className="currentUsersList">
          {userlist}
        </div>
      </div>
    )
  }
}









// Chat Log Component
const Chat = (props) => (
  <div>
    {
      props.my != null && props.my &&
      <div className="myChat">{props.username} : {props.message}</div>
    }
    {
      props.my != null && !props.my &&
      <div className="otherChat">{props.username} : {props.message}</div>
    }
    {
      props.system &&
      <div className="systemChat">{props.username} : {props.message}</div>
    }
  </div>
)

const ImageChat = (props) => (
  <div>
  {
    props.my &&
    <div className="myImageChat">
      <p>- {props.username} -</p>
      <p><img src={props.url} width="400" height="auto"/></p>
    </div>
  }
  {
    !props.my &&
    <div className="otherImageChat">
      <p>- {props.username} -</p>
      <p><img src={props.url} width="400" height="auto"/></p>
    </div>
  }
  </div>
)







// ChatBox Component
// props - channel, username
class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatLog : [],
      currentScroll : 0
    }
    this.myChatBox = React.createRef();
    this.whoChat = React.createRef();
  }
  componentDidMount() {
    socket.on("receiveChat", data => {
      var ismy = this.props.username == data.username;
      this.setState((prevState) => ({
        chatLog : [...prevState.chatLog, {username : data.username, message : data.message, my : ismy, system : false}]
      }))
      if(!currentWindow.isFocused()) {
        var obj = this.state.chatLog[this.state.chatLog.length - 1];
        notifier.notify('새 채팅이 왔습니다', {
          message : `${obj.username} : ${obj.message}`
        })
        return;
      }
      if(this.myChatBox.current.scrollTop < this.state.currentScroll) {
        return;
      } else {
        this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight;
      }
      this.setState({
        currentScroll : this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight
      })
    })

    socket.on("chatStart", data => {
      this.whoChat.current.style.display = "flex";
    })

    socket.on("chatEnd", data => {
      this.whoChat.current.style.display = "none";
    })

    socket.on("system:join", data => {
      this.setState((prevState) => ({
        chatLog : [...prevState.chatLog, {username : "System", message : data.message, my : null, system : true}]
      }))
      this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight;
    })

    socket.on("system:leave", data => {
      this.setState((prevState) => ({
        chatLog : [...prevState.chatLog, {username : "System", message : data.message, my : null, system : true}]
      }))
      this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight;
    })

    socket.on("receiveImage", data => {
      var ismy = this.props.username == data.username;
      this.setState((prevState) => ({
        chatLog : [...prevState.chatLog, {username : data.username, message : null, url : data.url, my : ismy}]
      }))
      this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight;
    })
  }
  render() {
    const { chatLog } = this.state;
    const chat = chatLog.map(
      (item,idx) => {
        if(item.message != null) return <Chat
        username = {item.username}
        message = {item.message}
        my = {item.my}
        system = {item.system}
        key = {idx}
        />
        else return <ImageChat
        username = {item.username}
        my = {item.my}
        url = {item.url}
        key = {idx}
        />
        }
    )
    return (
      <div className="chatBox" ref={this.myChatBox}>
        {chat}
        <div ref={this.whoChat} className="whoChat">누군가 할 말을 입력중입니다</div>
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
    }
  }
  onChange = e => {
    const { value } = e.target;
    this.setState((prevState, props) => {
      return {input : value}
    })
  }

  buttonClick = () => {
    socket.emit("sendChat",{username : this.props.username, message : this.state.input, channel : this.props.channel})
    this.setState((prevState, props) => {
      return {input : ""}
    })
  }
  onFocus = () => {
    socket.emit("startChat", {channel : this.props.channel})
  }
  onBlur = () => {
    socket.emit("endChat", {channel : this.props.channel})
  }

  onKeyPress = e => {
    if(e.key == "Enter") {
      this.buttonClick();
    } else {
      return;
    }
  }

  fileChange = e => {
    e.persist()
    const exArray = ["jpg","png","jpeg","gif"];
    var file = e.target.files
    var type = file[0].type.split("/")[1];
    if(exArray.indexOf(type) < 0) {
      e.target.value = "";
      notifier.notify('이미지 파일만 가능합니다!', {
        message : `당신이 올린 파일의 형식은 현재 불가능합니다`
      })
      return;
    }
    var reader = new FileReader();
    reader.onload = () => {
      this.fileSend(reader.result)
      e.target.value = "";
    }
    reader.readAsDataURL(file[0]);
  }

  fileSend = result => {
    socket.emit("sendImage", {username : this.props.username, url : result, channel : this.props.channel})
  }


  render() {
    return (
      <div className="functionBox">
        <div className="inputBox">
          <input type="text" style={{width : "90%", height : "30px" , float : "left"}}value={this.state.input} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} onKeyPress={this.onKeyPress}/>
          <button onClick={this.buttonClick} className="btnSend">Send</button>
        </div>
        <div className="filebox">
          <label for="fileupload">이미지 업로드</label>
          <input type="file" id="fileupload" onChange={this.fileChange}/>
        </div>
      </div>
    )
  }
}

// Main Ui Component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username : "",
      channel : "1"
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
        socket.emit("initUser",{username : r})
        socket.on("overlap", data => {
          this.setState({
            username : ""
          })
          this.askNick();
          return;
        })
        return;
    })
    .catch(console.error);
  }
  componentDidMount() {
    axios.get("http://download.gyeongtae.com/chatver?version=0.03")
    .then( data => {
      if(data.data.result == 0) {
        var obj = {
          title: '새로운 버전이 있습니다',
          body: '채팅앱을 업데이트 하려면 클릭하세요'
        }
        var update = new window.Notification(obj.title, obj)
        update.onclick = () => {
          shell.openExternal("http://download.gyeongtae.com/chat");
        }
      }
      this.askNick();
    })
    .catch( err => { console.log(err) })
    socket.on("newUser", data => {
      notifier.notify('WelCome New User!', {
        message : `WelCome! ${data.username}!`
      })
    })
    socket.on("changeChannel", data => {
      this.setState({
        channel : data.channel
      })
    })
  }

  render() {
    return (
      <div className="wrap">
        <div className="leftBox">
          <Title channel={this.state.channel}/>
          <ChatBox username={this.state.username}/>
          <ChatInput username={this.state.username} channel={this.state.channel}/>
        </div>
        <div className="rightBox">
          <StatusBar />
        </div>
      </div>
    )
  }
}

window.onload = function() {
  var root = document.getElementById("root");
  ReactDOM.render(<App />,root);
}


// 휴 힘들었ㅅ다
