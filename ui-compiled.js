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
  return React.createElement("div", null);
};

var ChatBox = function (_React$Component) {
  _inherits(ChatBox, _React$Component);

  function ChatBox() {
    _classCallCheck(this, ChatBox);

    return _possibleConstructorReturn(this, (ChatBox.__proto__ || Object.getPrototypeOf(ChatBox)).apply(this, arguments));
  }

  return ChatBox;
}(React.Component);

var ChatInput = function (_React$Component2) {
  _inherits(ChatInput, _React$Component2);

  function ChatInput(props) {
    _classCallCheck(this, ChatInput);

    var _this2 = _possibleConstructorReturn(this, (ChatInput.__proto__ || Object.getPrototypeOf(ChatInput)).call(this, props));

    _this2.onChange = function (e) {
      var value = e.target.value;

      _this2.setState(function (prevState, props) {
        return { input: value };
      });
    };

    _this2.onClick = function () {};

    _this2.state = {
      input: ""
    };
    return _this2;
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

    var _this3 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this3.state = {
      username: ""
    };
    return _this3;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      prompt({
        title: 'Prompt example',
        label: 'URL:',
        value: 'http://example.org',
        inputAttrs: { // attrs to be set if using 'input'
          type: 'url'
        },
        type: 'select', // 'select' or 'input, defaults to 'input'
        selectOptions: { // select options if using 'select' type
          'value 1': 'Display Option 1',
          'value 2': 'Display Option 2',
          'value 3': 'Display Option 3'
        }
      }).then(function (r) {
        console.log('result', r); // null if window was closed, or user clicked Cancel
      }).catch(console.error);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Title, null),
        React.createElement("div", { style: { width: "100%", height: "500px" } }),
        React.createElement(ChatInput, null)
      );
    }
  }]);

  return App;
}(React.PureComponent);

window.onload = function () {
  var root = document.getElementById("root");
  ReactDOM.render(React.createElement(App, null), root);
};
