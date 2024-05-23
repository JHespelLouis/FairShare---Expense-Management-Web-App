import './styles/App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './AuthContext';  // Adjust this path to where your AuthProvider is defined

import Nav from "./pages/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import GroupList from "./pages/GroupList";
import GroupCreation from "./pages/GroupCreation";
import ExpenseCreation from "./pages/ExpenseCreation";
import ExpenseList from "./pages/ExpenseList";
import JoinGroup from './pages/JoinGroup';
import ExpenseDetails from './pages/ExpenseDetails';

function App() {
    return (
        <div className="app-container">
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Nav/>}>
                        <Route index element={<GroupList/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register/>}/>
                        <Route path="myAccount" element={<MyAccount/>}/>
                        <Route path="grpc" element={<GroupCreation/>}/>
                        <Route path="ex" element={<ExpenseList/>}/>
                        <Route path="exc" element={<ExpenseCreation/>}/>
                        <Route path="invite/:groupId" element={<JoinGroup />} />
                        <Route path="exd" element={<ExpenseDetails />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </div>
    );
}

export default App;
