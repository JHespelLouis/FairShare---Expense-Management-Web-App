import '../styles/GameList.css'
import React, { useEffect, useState } from 'react';
import { redirect } from "react-router-dom";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Group_Creation from "./Group_Creation";

const GroupList = (props) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [groups, setGroups] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [gameDetails, setGameDetails] = useState(null);
    const [creatingNewGroup, setCreatingNewGroup] = useState(false);

    const handleCreateGroup = () => {
        setCreatingNewGroup(true);
    };

    const handleDetails = () => {
        setGameDetails(true)
        console.log(`Details for game ${groups[selectedRow].groupId}`);
    };
    const fetchGroups = (uid) => {
        fetch(`${apiUrl}api/group/${uid}`)
            .then(response => response.ok ? response.json() : Promise.reject("Error fetching groups"))
            .then(data => {
                setGroups(data);
                console.log(data);
                setIsLoaded(true);
            })
            .catch(error => console.log('error: ' + error));
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchGroups(user.uid);
            } else {
                redirect('/login');
            }
        });
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (creatingNewGroup) {
        return <Group_Creation onCancel={() => setCreatingNewGroup(false)} groupId={groups.groupId}/>;
    } else if(gameDetails) {
        //return <Group_Details onCancel={() => setGameDetails(false)} groupId={groups.groupId}/>;
    }
    return (
        <div>
            <div className="header">
                <span>Groups :</span>
            </div>
            <div className="groups-container">
                <ListeDesGroupes
                    data={groups}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                />
                <button className="create-button" onClick={handleCreateGroup}>
                    Create a new Group
                </button>
                <DialogActions>
                    <Button onClick={handleDetails} disabled={!selectedRow}>
                        View Details
                    </Button>
                </DialogActions>
            </div>
        </div>
    );
};

const ListeDesGroupes = (props) => {
    return (
        <div>
            {Object.keys(props.data).length === 0 ? (
                <p className="no-groups-message">You have no groups.</p>
            ) : (
                <ul>
                    {Object.keys(props.data).map(id => (
                        <li key={id} onClick={() => props.setSelectedRow(id)} className={id === props.selectedRow ? 'selected-row' : ''}>
                            <div className="group-name">{props.data[id].title}</div>
                            <div className="group-description">{props.data[id].description}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GroupList;
