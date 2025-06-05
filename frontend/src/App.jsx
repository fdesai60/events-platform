import './App.css'


function App() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div>
      <h1>EVENTS PLATFORM</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  )
}

export default App
