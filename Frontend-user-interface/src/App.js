import './styles/App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './AuthContext';  // Adjust this path to where your AuthProvider is defined

import Nav from "./pages/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import Group_List from "./pages/Group_List";
import Group_Creation from "./pages/Group_Creation";
import Expense_List from "./pages/Expense_List";
import Expense_Creation from "./pages/Expense_Creation";

function App() {
    return (
        <div className="app-container">
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Nav/>}>
                        <Route index element={<Group_List/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="register" element={<Register/>}/>
                        <Route path="myAccount" element={<MyAccount/>}/>
                        <Route path="grpc" element={<Group_Creation/>}/>
                        <Route path="ex" element={<Expense_List/>}/>
                        <Route path="exc" element={<Expense_Creation/>}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </div>
    );
}

export default App;
