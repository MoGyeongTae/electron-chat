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

// Chat Log Component
var Chat = function Chat(props) {
  return React.createElement(
    "p",
    null,
    props.username,
    " : ",
    props.message
  );
};

var ChatBox = function (_React$Component) {
  _inherits(ChatBox, _React$Component);

  function ChatBox(props) {
    _classCallCheck(this, ChatBox);

    var _this = _possibleConstructorReturn(this, (ChatBox.__proto__ || Object.getPrototypeOf(ChatBox)).call(this, props));

    _this.state = {
      chatLog: []
    };
    return _this;
  }

  _createClass(ChatBox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      socket.on("receiveChat", function (data) {
        var newStateArray = _this2.state.chatLog.slice();
        newStateArray.push({ username: data.username, message: data.message });
        _this2.setState({
          chatLog: newStateArray
        });
        console.log(_this2.state.chatLog);
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
          key: idx
        });
      });
      return React.createElement(
        "div",
        { style: { width: "100%", height: "500px", overflowY: "scroll" } },
        chat
      );
    }
  }]);

  return ChatBox;
}(React.Component);

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

    _this3.state = {
      input: ""
    };
    return _this3;
  }

  _createClass(ChatInput, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { style: { width: "100%", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" } },
        React.createElement("input", { type: "text", onChange: this.onChange }),
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


var App = function (_React$PureComponent) {
  _inherits(App, _React$PureComponent);

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
        React.createElement(ChatBox, null),
        React.createElement(ChatInput, { username: this.state.username })
      );
    }
  }]);

  return App;
}(React.PureComponent);

window.onload = function () {
  var root = document.getElementById("root");
  ReactDOM.render(React.createElement(App, null), root);
};
