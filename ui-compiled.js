"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var socket = io.connect("http://localhost:3000");
// Title Component
var Title = function Title() {
  return React.createElement(
    "div",
    { style: { width: "100%", height: "50px", backgroundColor: "#FF9800", display: "flex", justifyContent: 'center', alignItems: "center" } },
    React.createElement(
      "h2",
      { style: { color: "white" } },
      "Electron Chat App Title"
    )
  );
};

// Chatting Style For Your Own Chat
var myStyle = {
  padding: "5px",
  float: "right",
  clear: "both",
  backgroundColor: "#FFB74D",
  borderRadius: "3px",
  height: "30px",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"

  // Chatting Style For Others
};var otherStyle = {
  padding: "5px",
  float: "left",
  clear: "both",
  backgroundColor: "#4CAF50",
  borderRadius: "3px",
  height: "30px",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"

  // Chat Log Component
};var Chat = function Chat(props) {
  return React.createElement(
    "div",
    null,
    props.my && React.createElement(
      "div",
      { style: myStyle },
      props.username,
      " : ",
      props.message
    ),
    !props.my && React.createElement(
      "div",
      { style: otherStyle },
      props.username,
      " : ",
      props.message
    )
  );
};

// ChatBox Component

var ChatBox = function (_React$Component) {
  _inherits(ChatBox, _React$Component);

  function ChatBox(props) {
    _classCallCheck(this, ChatBox);

    var _this = _possibleConstructorReturn(this, (ChatBox.__proto__ || Object.getPrototypeOf(ChatBox)).call(this, props));

    _this.state = {
      chatLog: []
    };
    _this.myChatBox = React.createRef();
    _this.whoChat = React.createRef();
    return _this;
  }

  _createClass(ChatBox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      socket.on("receiveChat", function (data) {
        var newStateArray = _this2.state.chatLog.slice();
        var ismy = _this2.props.username == data.username;
        newStateArray.push({ username: data.username, message: data.message, my: ismy });
        _this2.setState({
          chatLog: newStateArray
        });
        _this2.myChatBox.current.scrollTop = _this2.myChatBox.current.scrollHeight;
      });

      socket.on("chatStart", function (data) {
        _this2.whoChat.current.style.display = "flex";
      });

      socket.on("chatEnd", function (data) {
        _this2.whoChat.current.style.display = "none";
      });
    }
  }, {
    key: "render",
    value: function render() {
      var chatLog = this.state.chatLog;

      var chat = chatLog.map(function (item, idx) {
        return React.createElement(Chat, {
          username: item.username,
          message: item.message,
          my: item.my,
          key: idx
        });
      });
      return React.createElement(
        "div",
        { style: { width: "100%", height: "500px", overflowY: "scroll", marginTop: "10px", position: "relative" }, ref: this.myChatBox },
        chat,
        React.createElement(
          "div",
          { ref: this.whoChat, style: { display: "none", width: "50%", height: "30px", position: "fixed", backgroundColor: "#F44336", top: "470px", left: "25%", color: "white", justifyContent: "center", alignItems: "center", borderRadius: "5px" } },
          "\uB204\uAD70\uAC00 \uD560 \uB9D0\uC744 \uC785\uB825\uC911\uC785\uB2C8\uB2E4"
        )
      );
    }
  }]);

  return ChatBox;
}(React.Component);

// ChatInput Component


var ChatInput = function (_React$Component2) {
  _inherits(ChatInput, _React$Component2);

  function ChatInput(props) {
    _classCallCheck(this, ChatInput);

    var _this3 = _possibleConstructorReturn(this, (ChatInput.__proto__ || Object.getPrototypeOf(ChatInput)).call(this, props));

    _this3.onChange = function (e) {
      var value = e.target.value;

      _this3.setState(function (prevState, props) {
        return { input: value };
      });
    };

    _this3.buttonClick = function () {
      socket.emit("sendChat", { username: _this3.props.username, message: _this3.state.input });
    };

    _this3.onFocus = function () {
      socket.emit("startChat");
    };

    _this3.onBlur = function () {
      socket.emit("endChat");
    };

    _this3.state = {
      input: "",
      usercon: false
    };
    return _this3;
  }

  _createClass(ChatInput, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { style: { width: "100%", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" } },
        React.createElement("input", { type: "text", onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur }),
        React.createElement(
          "button",
          { onClick: this.buttonClick },
          "Send"
        )
      );
    }
  }]);

  return ChatInput;
}(React.Component);

// Main Ui Component


var App = function (_React$Component3) {
  _inherits(App, _React$Component3);

  function App(props) {
    _classCallCheck(this, App);

    var _this4 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this4.askNick = function () {
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
          _this4.askNick();
          return;
        }
        _this4.setState({
          username: r
        });

        socket.emit("initUser", { username: _this4.state.username });
        socket.on("overlap", function (data) {
          _this4.askNick();
        });
      }).catch(console.error);
    };

    _this4.state = {
      username: ""
    };
    return _this4;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.askNick();
      socket.on("newUser", function (data) {
        notifier.notify('WelCome New User!', {
          message: "WelCome! " + data.username + "!"
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Title, null),
        React.createElement(ChatBox, { username: this.state.username }),
        React.createElement(ChatInput, { username: this.state.username })
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
