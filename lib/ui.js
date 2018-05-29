const socket = io.connect("http://localhost:3000")
// Title Component
const Title = () => (
  <div style={{width : "100%", height : "50px" , backgroundColor : "#FF9800" , display : "flex" , justifyContent : 'center', alignItems : "center"}}>
    <h2 style={{color : "white"}}>Electron Chat App Title</h2>
  </div>
)

// Chat Log Component
const Chat = (props) => (
  <div>

  </div>
)

class ChatBox extends React.Component {

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
  onClick = () => {

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
  componentDidMount() {
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
})
.then((r) => {
    console.log('result', r); // null if window was closed, or user clicked Cancel
})
.catch(console.error);
  }

  render() {
    return (
      <div>
        <Title />
        <div style={{width : "100%", height : "500px"}}></div>
        <ChatInput />
      </div>
    )
  }
}

window.onload = function() {
  var root = document.getElementById("root");
  ReactDOM.render(<App />,root);
}
