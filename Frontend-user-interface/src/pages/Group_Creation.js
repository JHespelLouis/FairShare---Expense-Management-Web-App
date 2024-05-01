import React, {useEffect, useState} from 'react';
import '../styles/GroupCreation.css';
import {Button, TextField, Box, Toolbar, AppBar} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import {doc, getDoc, getFirestore} from "firebase/firestore";
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const GroupCreation = (props) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [members, setMembers] = useState(['']);
        const [userId, setUserId] = useState('');
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.uid;
                    setUserId(uid);
                    const db = getFirestore();
                    const docRef = doc(db, "users", uid);
                    getDoc(docRef).then((docSnapshot) => {
                        if (docSnapshot.exists()) {
                            const userName = docSnapshot.data().firstname;
                            setMembers([userName, '']);
                            setMembers([userName, '']);
                            setIsLoaded(true);
                        } else {
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                }
            });
        }, []);

        const addMember = () => {
            if (members[members.length - 1].trim() === '') {
                return;
            }
            setMembers([...members, '']);
        };

        const removeMember = (index) => {
            if (members.length > 2) {
                const updatedMembers = [...members];
                updatedMembers.splice(index, 1);
                setMembers(updatedMembers);
            }
        };

        const updateMemberName = (index, memberName) => {
            const updatedMembers = [...members];
            updatedMembers[index] = memberName;
            setMembers(updatedMembers);
        };

        const dataVerificaiton = () => {
            const emptyFields = [];
            if (!title) {
                emptyFields.push("Nom du match");
            }
            if (!members.every(member => member.trim() !== '')) {
                emptyFields.push("Members");
            }
            if (emptyFields.length > 0) {
                return false;
            }
            return true
        }

        const submitForm = () => {
            if (!dataVerificaiton()) {
                return;
            }
            const nonEmptyMembers = members.filter(member => member.trim() !== '');
            const formData = {
                userId: userId,
                title: title,
                description: description.trim().length === 0 ? '' : description,
                members: nonEmptyMembers.map((member, index) => ({
                    name: member.trim(),
                    id: index === 0 ? userId : "",
                }))
            };
            fetch(`${apiUrl}api/group/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => {
                return response.json();
            }).then(res => {
                if (res === 201) {
                } else {
                }
            });
        }

        console.log(title, description, members)

        if (!isLoaded) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <CircularProgress/>
                </Box>
            );
        }
        return (<div className="groupForm">
                <AppBar position="fixed" color="primary" style={{marginTop: 55, backgroundColor: "grey", height: 45}}>
                    <Toolbar>
                        <Typography variant="h6">Groups</Typography>
                    </Toolbar>
                </AppBar>
                <Box>
                    <TextField fullWidth id="Title" label="Title" value={title}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   setTitle(event.target.value);
                               }} variant="standard"/>
                    <TextField fullWidth id="Description" label="Description" value={description}
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                   setDescription(event.target.value);
                               }} variant="standard"/>
                </Box>
                <Divider/>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Members
                    </Typography>
                    {members.map((member, index) => (
                        <div key={index} className="member-container" data-testid="member-container">
                            <TextField
                                fullWidth
                                label={index === 0 ? "My name" : "Other member"}
                                value={member}
                                onChange={(event) => updateMemberName(index, event.target.value)}
                                variant="standard"
                            />
                            {index < members.length - 1 && index != 0 && (
                                <Button onClick={() => removeMember(index)} variant="outlined"><DeleteIcon/></Button>
                            )}
                            {index === members.length - 1 && (
                                <Button onClick={addMember} className={"addMemberButton"} name={"addMemberButton"}
                                        variant="contained">
                                    Add
                                </Button>
                            )}
                        </div>
                    ))}
                    <DialogActions>
                        <Button onClick={submitForm}>
                            Submit
                        </Button>
                    </DialogActions>
                </Box>
            </div>
        );
    }
;

export default GroupCreation;
