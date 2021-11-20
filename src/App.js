import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link-social"
          href="https://linkedin.com/in/saractavares"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sara Tavares - Linkedin 🌐
        </a>
        <a
          className="App-link-social"
          href="http://api.whatsapp.com/send?1=pt_BR&phone=5519992867677"
          target="_blank"
          rel="noopener noreferrer"
        >
          Whatsapp 📱
        </a>
        <a
          className="App-link-social"
          href="https://github.com/saractavares/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub 💻
        </a>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
