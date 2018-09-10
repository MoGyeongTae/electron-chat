const socket = io.connect("http://electronchat.gyeongtae.com");
const currentWindow = remote.getCurrentWindow();


// Title Component
class Title extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conusers : "",
      nextchannel : "1",
      channelList : [{channel : "1",id : null},{channel : "2", id : null}]
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
    const channels = this.state.channelList.map(
      (item, key) => (
        <option value={item.channel}>{item.channel}</option>
      )
    )
    return (
      <div className="title">
        <h2 style={{color : "white"}}>현재 채널 ({this.props.channel}채널)</h2>
        <select className="selectChannel" onChange={this.selectChange}>
          {channels}
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
      <div className="myChat"><p>{props.username} : {props.message}</p></div>
    }
    {
      props.my != null && !props.my &&
      <div className="otherChat"><p>{props.username} : {props.message}</p></div>
    }
    {
      props.system &&
      <div className="systemChat"><p>{props.username} : {props.message}</p></div>
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
      <p><a href={props.url} download><img src={props.url} width="400" height="auto"/></a></p>
    </div>
  }
  </div>
)


const WhisperChat = (props) => (
  <div>
  {
    props.my &&
    <div className="myWhisperChat">
      <p style={{color : "white"}}>{props.username} 님에게 귓속말 : {props.message}</p>
    </div>
  }
  {
    !props.my &&
    <div className="otherWhisperChat">
      <p style={{color : "white"}}>{props.username} 님으로 부터 귓속말 : {props.message}</p>
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
      if(this.myChatBox.current.scrollTop < this.state.currentScroll) {
        return;
      } else {
        this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight;
      }
      this.setState({
        currentScroll : this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight
      })
    })

    socket.on("system:leave", data => {
      this.setState((prevState) => ({
        chatLog : [...prevState.chatLog, {username : "System", message : data.message, my : null, system : true}]
      }))
      if(this.myChatBox.current.scrollTop < this.state.currentScroll) {
        return;
      } else {
        this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight;
      }
      this.setState({
        currentScroll : this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight
      })
    })

    socket.on("receiveImage", data => {
      var ismy = this.props.username == data.username;
      this.setState((prevState) => ({
        chatLog : [...prevState.chatLog, {username : data.username, message : null, url : data.url, my : ismy}]
      }))
      if(this.myChatBox.current.scrollTop < this.state.currentScroll) {
        return;
      } else {
        this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight;
      }
      this.setState({
        currentScroll : this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight
      })
    })

    socket.on("receiveWhisper", data => {
      var ismy = data.username == this.props.username;
      console.log(data)
      this.setState((prevState) => ({
        chatLog : [...prevState.chatLog, {username : data.username, message : data.message, whisper : true, my : ismy}]
      }))
      if(this.myChatBox.current.scrollTop < this.state.currentScroll) {
        return;
      } else {
        this.myChatBox.current.scrollTop = this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight;
      }
      this.setState({
        currentScroll : this.myChatBox.current.scrollHeight - this.myChatBox.current.offsetHeight
      })
    })
  }
  render() {
    const { chatLog } = this.state;
    const chat = chatLog.map(
      (item,idx) => {
        if(!item.whisper && !item.url) return <Chat
        username = {item.username}
        message = {item.message}
        my = {item.my}
        system = {item.system}
        key = {idx}
        />
        else if(item.url) return <ImageChat
        username = {item.username}
        my = {item.my}
        url = {item.url}
        key = {idx}
        />
        else if(item.whisper) return <WhisperChat
        username = {item.username}
        message = {item.message}
        my = {item.my}
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
// props - username , channel
class ChatInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input : "",
      whisperUser : "",
      conuserList : []
    }
    this.fileInput = React.createRef();
    this.fileLabel = React.createRef();
  }
  onChange = e => {
    const { value } = e.target;
    this.setState((prevState, props) => {
      return {input : value}
    })
  }

  buttonClick = () => {
    if(this.state.whisperUser) {
      socket.emit("sendWhisper",{username : this.props.username, message : this.state.input, whisper : this.state.whisperUser})
      this.setState((prevState, props) => {
        return {input : ""}
      })
    } else {
      socket.emit("sendChat",{username : this.props.username, message : this.state.input, channel : this.props.channel})
      this.setState((prevState, props) => {
        return {input : ""}
      })
    }
  }
  onFocus = () => {
    if(this.state.whisperUser) return;
    socket.emit("startChat", {channel : this.props.channel})
  }
  onBlur = () => {
    if(this.state.whisperUser) return;
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
    var file = this.fileInput.current.files
    this.fileLabel.current.innerText = file[0].name
  }

  fileSend = e => {
    if(this.state.whisper) {
      return;
    }
    const exArray = ["jpg","png","jpeg","gif"];
    var file = this.fileInput.current.files
    if(!file[0]) {
      notifier.notify('파일이 없습니다', {
        message : `파일을 추가해 주신 후 눌러주세요`
      })
      return;
    }
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
      socket.emit("sendImage", {username : this.props.username, url : reader.result, channel : this.props.channel})
      e.target.value = "";
    }
    reader.readAsDataURL(file[0]);
    this.fileLabel.current.innerText = "이미지 선택"
  }

  selectChange = e => {
    const { value } = e.target;
    console.log(value)
    this.setState({whisperUser : value})
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.channel) !== JSON.stringify(nextProps.channel)) // Check if it's a new user, you can also use some unique, like the ID
    {
      this.setState({
        whisperUser : ""
      })
    }
}

  componentDidMount() {
    socket.on("conusers", data => {
      this.setState({
        conuserList : data.userlist
      })
    })
  }


  render() {
    const { conuserList } = this.state;
    const list = conuserList.map(
      (item,key) => {
        if(item.username == this.props.username) {
          return <option value="">없음</option>
        }
        return <option value={item.id}>{item.username}</option>
      }
    )
    return (
      <div className="functionBox">
        <div className="inputBox">
          <select onChange={this.selectChange} value={this.state.whisperUser}>
            {list}
          </select>
          <input type="text" value={this.state.input} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} onKeyPress={this.onKeyPress}/>
          <button onClick={this.buttonClick} className="btnSend">Send</button>
        </div>
        <div className="filebox">
          <label for="fileupload" ref={this.fileLabel}>이미지 선택</label>
          <input type="file" id="fileupload" ref={this.fileInput} onChange={this.fileChange}/>
          <button className="btn" onClick={this.fileSend}>이미지 전송</button>
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
    title: '이름을 입력하세요',
    label: '당신이 채팅앱에서 쓸 이름을 입력해주세요',
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
    axios.get("http://download.gyeongtae.com/chatver?version=0.1")
    .then( data => {
      if(!data.data.result) {
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
