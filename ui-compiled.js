"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var socket = io.connect("http://electronchat.gyeongtae.com");
var currentWindow = remote.getCurrentWindow();

// Title Component

var Title = function (_React$Component) {
  _inherits(Title, _React$Component);

  function Title(props) {
    _classCallCheck(this, Title);

    var _this = _possibleConstructorReturn(this, (Title.__proto__ || Object.getPrototypeOf(Title)).call(this, props));

    _this.selectChange = function (e) {
      var value = e.target.value;

      _this.setState({ nextchannel: value });
    };

    _this.changeChannel = function () {
      if (_this.props.channel == _this.state.nextchannel) {
        notifier.notify('이미 그 채널입니다', {
          message: "\uB2F9\uC2E0\uC740 \uC774\uBBF8 \uB2F9\uC2E0\uC774 \uAC00\uACE0\uC2F6\uC5B4\uD558\uB294 \uCC44\uB110\uC5D0 \uC788\uC2B5\uB2C8\uB2E4!"
        });
        return;
      }
      socket.emit("sendChannel", { currentChannel: _this.props.channel, nextChannel: _this.state.nextchannel });
    };

    _this.state = {
      conusers: "",
      nextchannel: "1",
      channelList: [{ channel: "1", id: null }, { channel: "2", id: null }]
    };
    return _this;
  }

  _createClass(Title, [{
    key: "render",
    value: function render() {
      var channels = this.state.channelList.map(function (item, key) {
        return React.createElement(
          "option",
          { value: item.channel },
          item.channel
        );
      });
      return React.createElement(
        "div",
        { className: "title" },
        React.createElement(
          "h2",
          { style: { color: "white" } },
          "\uD604\uC7AC \uCC44\uB110 (",
          this.props.channel,
          "\uCC44\uB110)"
        ),
        React.createElement(
          "select",
          { className: "selectChannel", onChange: this.selectChange },
          channels
        ),
        React.createElement(
          "button",
          { onClick: this.changeChannel, className: "btnChange" },
          "Change Channel"
        )
      );
    }
  }]);

  return Title;
}(React.Component);

var StatusBar = function (_React$Component2) {
  _inherits(StatusBar, _React$Component2);

  function StatusBar(props) {
    _classCallCheck(this, StatusBar);

    var _this2 = _possibleConstructorReturn(this, (StatusBar.__proto__ || Object.getPrototypeOf(StatusBar)).call(this, props));

    _this2.state = {
      conusers: 0,
      conusersList: []
    };
    return _this2;
  }

  _createClass(StatusBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      socket.on("conusers", function (data) {
        _this3.setState({
          conusers: data.usercount,
          conusersList: data.userlist
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var conusersList = this.state.conusersList;

      var userlist = conusersList.map(function (item, idx) {
        return React.createElement(
          "div",
          { className: "userlistItem" },
          item.username,
          React.createElement("div", { className: "online" })
        );
      });
      return React.createElement(
        "div",
        { className: "statusBar" },
        React.createElement(
          "div",
          { className: "currentUsers" },
          React.createElement(
            "p",
            null,
            "\uD604\uC7AC \uC720\uC800 \uC218 : ",
            this.state.conusers
          )
        ),
        React.createElement(
          "div",
          { className: "currentUsersList" },
          userlist
        )
      );
    }
  }]);

  return StatusBar;
}(React.Component);

// Chat Log Component


var Chat = function Chat(props) {
  return React.createElement(
    "div",
    null,
    props.my != null && props.my && React.createElement(
      "div",
      { className: "myChat" },
      React.createElement(
        "p",
        null,
        props.username,
        " : ",
        props.message
      )
    ),
    props.my != null && !props.my && React.createElement(
      "div",
      { className: "otherChat" },
      React.createElement(
        "p",
        null,
        props.username,
        " : ",
        props.message
      )
    ),
    props.system && React.createElement(
      "div",
      { className: "systemChat" },
      React.createElement(
        "p",
        null,
        props.username,
        " : ",
        props.message
      )
    )
  );
};

var ImageChat = function ImageChat(props) {
  return React.createElement(
    "div",
    null,
    props.my && React.createElement(
      "div",
      { className: "myImageChat" },
      React.createElement(
        "p",
        null,
        "- ",
        props.username,
        " -"
      ),
      React.createElement(
        "p",
        null,
        React.createElement("img", { src: props.url, width: "400", height: "auto" })
      )
    ),
    !props.my && React.createElement(
      "div",
      { className: "otherImageChat" },
      React.createElement(
        "p",
        null,
        "- ",
        props.username,
        " -"
      ),
      React.createElement(
        "p",
        null,
        React.createElement(
          "a",
          { href: props.url, download: true },
          React.createElement("img", { src: props.url, width: "400", height: "auto" })
        )
      )
    )
  );
};

var WhisperChat = function WhisperChat(props) {
  return React.createElement(
    "div",
    null,
    props.my && React.createElement(
      "div",
      { className: "myWhisperChat" },
      React.createElement(
        "p",
        { style: { color: "white" } },
        props.username,
        " \uB2D8\uC5D0\uAC8C \uADD3\uC18D\uB9D0 : ",
        props.message
      )
    ),
    !props.my && React.createElement(
      "div",
      { className: "otherWhisperChat" },
      React.createElement(
        "p",
        { style: { color: "white" } },
        props.username,
        " \uB2D8\uC73C\uB85C \uBD80\uD130 \uADD3\uC18D\uB9D0 : ",
        props.message
      )
    )
  );
};

// ChatBox Component
// props - channel, username

var ChatBox = function (_React$Component3) {
  _inherits(ChatBox, _React$Component3);

  function ChatBox(props) {
    _classCallCheck(this, ChatBox);

    var _this4 = _possibleConstructorReturn(this, (ChatBox.__proto__ || Object.getPrototypeOf(ChatBox)).call(this, props));

    _this4.state = {
      chatLog: [],
      currentScroll: 0
    };
    _this4.myChatBox = React.createRef();
    _this4.whoChat = React.createRef();
    return _this4;
  }

  _createClass(ChatBox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this5 = this;

      socket.on("receiveChat", function (data) {
        var ismy = _this5.props.username == data.username;
        _this5.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: data.username, message: data.message, my: ismy, system: false }])
          };
        });
        if (!currentWindow.isFocused()) {
          var obj = _this5.state.chatLog[_this5.state.chatLog.length - 1];
          notifier.notify('새 채팅이 왔습니다', {
            message: obj.username + " : " + obj.message
          });
          return;
        }
        if (_this5.myChatBox.current.scrollTop < _this5.state.currentScroll) {
          return;
        } else {
          _this5.myChatBox.current.scrollTop = _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight;
        }
        _this5.setState({
          currentScroll: _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight
        });
      });

      socket.on("chatStart", function (data) {
        _this5.whoChat.current.style.display = "flex";
      });

      socket.on("chatEnd", function (data) {
        _this5.whoChat.current.style.display = "none";
      });

      socket.on("system:join", function (data) {
        _this5.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: "System", message: data.message, my: null, system: true }])
          };
        });
        if (_this5.myChatBox.current.scrollTop < _this5.state.currentScroll) {
          return;
        } else {
          _this5.myChatBox.current.scrollTop = _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight;
        }
        _this5.setState({
          currentScroll: _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight
        });
      });

      socket.on("system:leave", function (data) {
        _this5.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: "System", message: data.message, my: null, system: true }])
          };
        });
        if (_this5.myChatBox.current.scrollTop < _this5.state.currentScroll) {
          return;
        } else {
          _this5.myChatBox.current.scrollTop = _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight;
        }
        _this5.setState({
          currentScroll: _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight
        });
      });

      socket.on("receiveImage", function (data) {
        var ismy = _this5.props.username == data.username;
        _this5.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: data.username, message: null, url: data.url, my: ismy }])
          };
        });
        if (_this5.myChatBox.current.scrollTop < _this5.state.currentScroll) {
          return;
        } else {
          _this5.myChatBox.current.scrollTop = _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight;
        }
        _this5.setState({
          currentScroll: _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight
        });
      });

      socket.on("receiveWhisper", function (data) {
        var ismy = data.username == _this5.props.username;
        console.log(data);
        _this5.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: data.username, message: data.message, whisper: true, my: ismy }])
          };
        });
        if (_this5.myChatBox.current.scrollTop < _this5.state.currentScroll) {
          return;
        } else {
          _this5.myChatBox.current.scrollTop = _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight;
        }
        _this5.setState({
          currentScroll: _this5.myChatBox.current.scrollHeight - _this5.myChatBox.current.offsetHeight
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var chatLog = this.state.chatLog;

      var chat = chatLog.map(function (item, idx) {
        if (!item.whisper && !item.url) return React.createElement(Chat, {
          username: item.username,
          message: item.message,
          my: item.my,
          system: item.system,
          key: idx
        });else if (item.url) return React.createElement(ImageChat, {
          username: item.username,
          my: item.my,
          url: item.url,
          key: idx
        });else if (item.whisper) return React.createElement(WhisperChat, {
          username: item.username,
          message: item.message,
          my: item.my,
          key: idx
        });
      });
      return React.createElement(
        "div",
        { className: "chatBox", ref: this.myChatBox },
        chat,
        React.createElement(
          "div",
          { ref: this.whoChat, className: "whoChat" },
          "\uB204\uAD70\uAC00 \uD560 \uB9D0\uC744 \uC785\uB825\uC911\uC785\uB2C8\uB2E4"
        )
      );
    }
  }]);

  return ChatBox;
}(React.Component);

// ChatInput Component
// props - username , channel


var ChatInput = function (_React$Component4) {
  _inherits(ChatInput, _React$Component4);

  function ChatInput(props) {
    _classCallCheck(this, ChatInput);

    var _this6 = _possibleConstructorReturn(this, (ChatInput.__proto__ || Object.getPrototypeOf(ChatInput)).call(this, props));

    _this6.onChange = function (e) {
      var value = e.target.value;

      _this6.setState(function (prevState, props) {
        return { input: value };
      });
    };

    _this6.buttonClick = function () {
      if (_this6.state.whisperUser) {
        socket.emit("sendWhisper", { username: _this6.props.username, message: _this6.state.input, whisper: _this6.state.whisperUser });
        _this6.setState(function (prevState, props) {
          return { input: "" };
        });
      } else {
        socket.emit("sendChat", { username: _this6.props.username, message: _this6.state.input, channel: _this6.props.channel });
        _this6.setState(function (prevState, props) {
          return { input: "" };
        });
      }
    };

    _this6.onFocus = function () {
      if (_this6.state.whisperUser) return;
      socket.emit("startChat", { channel: _this6.props.channel });
    };

    _this6.onBlur = function () {
      if (_this6.state.whisperUser) return;
      socket.emit("endChat", { channel: _this6.props.channel });
    };

    _this6.onKeyPress = function (e) {
      if (e.key == "Enter") {
        _this6.buttonClick();
      } else {
        return;
      }
    };

    _this6.fileChange = function (e) {
      var file = _this6.fileInput.current.files;
      _this6.fileLabel.current.innerText = file[0].name;
    };

    _this6.fileSend = function (e) {
      if (_this6.state.whisper) {
        return;
      }
      var exArray = ["jpg", "png", "jpeg", "gif"];
      var file = _this6.fileInput.current.files;
      if (!file[0]) {
        notifier.notify('파일이 없습니다', {
          message: "\uD30C\uC77C\uC744 \uCD94\uAC00\uD574 \uC8FC\uC2E0 \uD6C4 \uB20C\uB7EC\uC8FC\uC138\uC694"
        });
        return;
      }
      var type = file[0].type.split("/")[1];
      if (exArray.indexOf(type) < 0) {
        e.target.value = "";
        notifier.notify('이미지 파일만 가능합니다!', {
          message: "\uB2F9\uC2E0\uC774 \uC62C\uB9B0 \uD30C\uC77C\uC758 \uD615\uC2DD\uC740 \uD604\uC7AC \uBD88\uAC00\uB2A5\uD569\uB2C8\uB2E4"
        });
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        socket.emit("sendImage", { username: _this6.props.username, url: reader.result, channel: _this6.props.channel });
        e.target.value = "";
      };
      reader.readAsDataURL(file[0]);
      _this6.fileLabel.current.innerText = "이미지 선택";
    };

    _this6.selectChange = function (e) {
      var value = e.target.value;

      console.log(value);
      _this6.setState({ whisperUser: value });
    };

    _this6.state = {
      input: "",
      whisperUser: "",
      conuserList: []
    };
    _this6.fileInput = React.createRef();
    _this6.fileLabel = React.createRef();
    return _this6;
  }

  _createClass(ChatInput, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (JSON.stringify(this.props.channel) !== JSON.stringify(nextProps.channel)) // Check if it's a new user, you can also use some unique, like the ID
        {
          this.setState({
            whisperUser: ""
          });
        }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this7 = this;

      socket.on("conusers", function (data) {
        _this7.setState({
          conuserList: data.userlist
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var conuserList = this.state.conuserList;

      var list = conuserList.map(function (item, key) {
        if (item.username == _this8.props.username) {
          return React.createElement(
            "option",
            { value: "" },
            "\uC5C6\uC74C"
          );
        }
        return React.createElement(
          "option",
          { value: item.id },
          item.username
        );
      });
      return React.createElement(
        "div",
        { className: "functionBox" },
        React.createElement(
          "div",
          { className: "inputBox" },
          React.createElement(
            "select",
            { onChange: this.selectChange, value: this.state.whisperUser },
            list
          ),
          React.createElement("input", { type: "text", value: this.state.input, onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur, onKeyPress: this.onKeyPress }),
          React.createElement(
            "button",
            { onClick: this.buttonClick, className: "btnSend" },
            "Send"
          )
        ),
        React.createElement(
          "div",
          { className: "filebox" },
          React.createElement(
            "label",
            { "for": "fileupload", ref: this.fileLabel },
            "\uC774\uBBF8\uC9C0 \uC120\uD0DD"
          ),
          React.createElement("input", { type: "file", id: "fileupload", ref: this.fileInput, onChange: this.fileChange }),
          React.createElement(
            "button",
            { className: "btn", onClick: this.fileSend },
            "\uC774\uBBF8\uC9C0 \uC804\uC1A1"
          )
        )
      );
    }
  }]);

  return ChatInput;
}(React.Component);

// Main Ui Component


var App = function (_React$Component5) {
  _inherits(App, _React$Component5);

  function App(props) {
    _classCallCheck(this, App);

    var _this9 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this9.askNick = function () {
      if (_this9.state.username) {
        return;
      }
      prompt({
        title: '이름을 입력하세요',
        label: '당신이 채팅앱에서 쓸 이름을 입력해주세요',
        value: '',
        inputAttrs: { // attrs to be set if using 'input'
          type: 'text'
        },
        type: 'input' // 'select' or 'input, defaults to 'input'
      }).then(function (r) {
        if (!r) {
          _this9.askNick();
          return;
        }
        _this9.setState({
          username: r
        });
        socket.emit("initUser", { username: r });
        socket.on("overlap", function (data) {
          _this9.setState({
            username: ""
          });
          _this9.askNick();
          return;
        });
        return;
      }).catch(console.error);
    };

    _this9.state = {
      username: "",
      channel: "1"
    };
    return _this9;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this10 = this;

      axios.get("http://download.gyeongtae.com/chatver?version=0.1").then(function (data) {
        if (!data.data.result) {
          var obj = {
            title: '새로운 버전이 있습니다',
            body: '채팅앱을 업데이트 하려면 클릭하세요'
          };
          var update = new window.Notification(obj.title, obj);
          update.onclick = function () {
            shell.openExternal("http://download.gyeongtae.com/chat");
          };
        }
        _this10.askNick();
      }).catch(function (err) {
        console.log(err);
      });
      socket.on("newUser", function (data) {
        notifier.notify('WelCome New User!', {
          message: "WelCome! " + data.username + "!"
        });
      });
      socket.on("changeChannel", function (data) {
        _this10.setState({
          channel: data.channel
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "wrap" },
        React.createElement(
          "div",
          { className: "leftBox" },
          React.createElement(Title, { channel: this.state.channel }),
          React.createElement(ChatBox, { username: this.state.username }),
          React.createElement(ChatInput, { username: this.state.username, channel: this.state.channel })
        ),
        React.createElement(
          "div",
          { className: "rightBox" },
          React.createElement(StatusBar, null)
        )
      );
    }
  }]);

  return App;
}(React.Component);

window.onload = function () {
  var root = document.getElementById("root");
  ReactDOM.render(React.createElement(App, null), root);
};

// 휴 힘들었ㅅ다
