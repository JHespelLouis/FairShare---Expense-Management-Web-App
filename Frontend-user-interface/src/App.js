import './styles/App.css';
import {
    Routes,
    Route,
} from "react-router-dom";
import MapList from "./pages/MapList";
import Home from "./pages/Home";
import Nav from "./pages/Nav";
import Login from "./pages/Login";
import Map from "./pages/Map";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import MapEditor from './pages/MapEditor';
import Zoomzoom from "./pages/Zoomzoom";
import Group_Creation from "./pages/Group_Creation";
import Group_List from "./pages/Group_List";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Nav/>}>
                <Route index element={<Home/>}/>
                <Route path="/maplist" element={<MapList/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/myAccount" element={<MyAccount/>}/>
                <Route path="/mapEditor" element={<MapEditor/>}/>
                <Route path="/groupCreation" element={<Group_Creation/>}/>
                <Route path="/groupList" element={<Group_List/>}/>
            </Route>
            <Route path="/map" element={<Zoomzoom/>}/>
        </Routes>
    );
}

export default App;