"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var socket = io.connect("http://localhost:3000");
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
      socket.emit("sendChannel", { currentChannel: _this.props.channel, nextChannel: _this.state.nextchannel });
    };

    _this.state = {
      conusers: "",
      nextchannel: "1"
    };
    return _this;
  }

  _createClass(Title, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      socket.on("conusers", function (data) {
        _this2.setState({
          conusers: data.usercount
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "title" },
        React.createElement(
          "h2",
          { style: { color: "white" } },
          "\uD604\uC7AC \uCC44\uB110 (",
          this.props.channel,
          "\uCC44\uB110) - \uC811\uC18D\uC911\uC778 \uC720\uC800 (",
          this.state.conusers,
          ")"
        ),
        React.createElement(
          "select",
          { className: "selectChannel", onChange: this.selectChange },
          React.createElement(
            "option",
            { value: "1" },
            "1\uCC44\uB110"
          ),
          React.createElement(
            "option",
            { value: "2" },
            "2\uCC44\uB110"
          )
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

// Chat Log Component


var Chat = function Chat(props) {
  return React.createElement(
    "div",
    null,
    props.my != null && props.my && React.createElement(
      "div",
      { className: "myChat" },
      props.username,
      " : ",
      props.message
    ),
    props.my != null && !props.my && React.createElement(
      "div",
      { className: "otherChat" },
      props.username,
      " : ",
      props.message
    ),
    props.system && React.createElement(
      "div",
      { className: "systemChat" },
      props.username,
      " : ",
      props.message
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
        React.createElement("img", { src: props.url, width: "400", height: "auto" })
      )
    )
  );
};

// ChatBox Component

var ChatBox = function (_React$Component2) {
  _inherits(ChatBox, _React$Component2);

  function ChatBox(props) {
    _classCallCheck(this, ChatBox);

    var _this3 = _possibleConstructorReturn(this, (ChatBox.__proto__ || Object.getPrototypeOf(ChatBox)).call(this, props));

    _this3.state = {
      chatLog: []
    };
    _this3.myChatBox = React.createRef();
    _this3.whoChat = React.createRef();
    return _this3;
  }

  _createClass(ChatBox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this4 = this;

      socket.on("receiveChat", function (data) {
        var ismy = _this4.props.username == data.username;
        _this4.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: data.username, message: data.message, my: ismy, system: false }])
          };
        });
        _this4.myChatBox.current.scrollTop = _this4.myChatBox.current.scrollHeight;
      });

      socket.on("chatStart", function (data) {
        _this4.whoChat.current.style.display = "flex";
      });

      socket.on("chatEnd", function (data) {
        _this4.whoChat.current.style.display = "none";
      });

      socket.on("system:join", function (data) {
        _this4.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: "System", message: data.message, my: null, system: true }])
          };
        });
        _this4.myChatBox.current.scrollTop = _this4.myChatBox.current.scrollHeight;
      });

      socket.on("system:leave", function (data) {
        _this4.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: "System", message: data.message, my: null, system: true }])
          };
        });
        _this4.myChatBox.current.scrollTop = _this4.myChatBox.current.scrollHeight;
      });

      socket.on("receiveImage", function (data) {
        var ismy = _this4.props.username == data.username;
        _this4.setState(function (prevState) {
          return {
            chatLog: [].concat(_toConsumableArray(prevState.chatLog), [{ username: data.username, message: null, url: data.url, my: ismy }])
          };
        });
        _this4.myChatBox.current.scrollTop = _this4.myChatBox.current.scrollHeight;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var chatLog = this.state.chatLog;

      var chat = chatLog.map(function (item, idx) {
        if (item.message != null) return React.createElement(Chat, {
          username: item.username,
          message: item.message,
          my: item.my,
          system: item.system,
          key: idx
        });else return React.createElement(ImageChat, {
          username: item.username,
          my: item.my,
          url: item.url,
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


var ChatInput = function (_React$Component3) {
  _inherits(ChatInput, _React$Component3);

  function ChatInput(props) {
    _classCallCheck(this, ChatInput);

    var _this5 = _possibleConstructorReturn(this, (ChatInput.__proto__ || Object.getPrototypeOf(ChatInput)).call(this, props));

    _this5.onChange = function (e) {
      var value = e.target.value;

      _this5.setState(function (prevState, props) {
        return { input: value };
      });
    };

    _this5.buttonClick = function () {
      socket.emit("sendChat", { username: _this5.props.username, message: _this5.state.input, channel: _this5.props.channel });
      _this5.setState(function (prevState, props) {
        return { input: "" };
      });
    };

    _this5.onFocus = function () {
      socket.emit("startChat", { channel: _this5.props.channel });
    };

    _this5.onBlur = function () {
      socket.emit("endChat", { channel: _this5.props.channel });
    };

    _this5.onKeyPress = function (e) {
      if (e.key == "Enter") {
        _this5.buttonClick();
      } else {
        return;
      }
    };

    _this5.fileChange = function (e) {
      e.persist();
      var exArray = ["jpg", "png", "jpeg", "gif"];
      var file = e.target.files;
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
        _this5.fileSend(reader.result);
        e.target.value = "";
      };
      reader.readAsDataURL(file[0]);
    };

    _this5.fileSend = function (result) {
      socket.emit("sendImage", { username: _this5.props.username, url: result, channel: _this5.props.channel });
    };

    _this5.state = {
      input: ""
    };
    return _this5;
  }

  _createClass(ChatInput, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "inputBox" },
          React.createElement("input", { type: "text", style: { width: "90%", height: "30px", float: "left" }, value: this.state.input, onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur, onKeyPress: this.onKeyPress }),
          React.createElement(
            "button",
            { onClick: this.buttonClick, className: "btnSend" },
            "Send"
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement("input", { type: "file", onChange: this.fileChange }),
          React.createElement(
            "button",
            { className: "btnSend", onClick: this.fileSend },
            "Upload"
          )
        )
      );
    }
  }]);

  return ChatInput;
}(React.Component);

// Main Ui Component


var App = function (_React$Component4) {
  _inherits(App, _React$Component4);

  function App(props) {
    _classCallCheck(this, App);

    var _this6 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this6.askNick = function () {
      if (_this6.state.username) {
        return;
      }
      prompt({
        title: 'Insert Your Name',
        label: 'Insert Your NickName In ChatApp Plz',
        value: '',
        inputAttrs: { // attrs to be set if using 'input'
          type: 'text'
        },
        type: 'input' // 'select' or 'input, defaults to 'input'
      }).then(function (r) {
        if (!r) {
          _this6.askNick();
          return;
        }
        _this6.setState({
          username: r
        });
        socket.emit("initUser", { username: r });
        socket.on("overlap", function (data) {
          _this6.setState({
            username: ""
          });
          _this6.askNick();
          return;
        });
        return;
      }).catch(console.error);
    };

    _this6.state = {
      username: "",
      channel: "1"
    };
    return _this6;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this7 = this;

      this.askNick();
      socket.on("newUser", function (data) {
        notifier.notify('WelCome New User!', {
          message: "WelCome! " + data.username + "!"
        });
      });
      socket.on("changeChannel", function (data) {
        _this7.setState({
          channel: data.channel
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Title, { channel: this.state.channel }),
        React.createElement(ChatBox, { username: this.state.username }),
        React.createElement(ChatInput, { username: this.state.username, channel: this.state.channel })
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
