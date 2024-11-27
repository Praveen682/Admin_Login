import './App.css';
import Admin_Login from './Components/Admin_Login';
import Admin_Signup from './Components/Admin_Signup'


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin_Login />} />
        <Route path="/signup" element={<Admin_Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
