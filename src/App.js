import SignUp from './Component/SignUp';
import logo from './logo.svg';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './Component/SignIn';
import Dashboard from './Component/Dashboard';
import Header from './Component/Header';



import About from './Component/About';
import Contact from './Component/Contact';
import Home from './Component/Home';
import TaskView from './Component/TaskView';

function App() {
  return (
    <div className="App">
           <BrowserRouter>
         <Header/>
          <Routes>
                 
                  <Route path="//" element={<SignUp />} />
                  <Route path="/home/:userId" element={<Home />} />
                  <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/view/:eventid" element={<TaskView />} />
           
                  <Route path="/about" element={<About/>} />
                  <Route path="/contact" element={<Contact/>} />
                  
                 
                  
                  
          </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
