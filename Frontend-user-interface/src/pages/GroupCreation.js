import React, {useEffect, useState} from 'react';
import '../styles/GroupCreation.css';
import {Button, TextField, Box, Toolbar, AppBar, IconButton} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {useAuth} from "../AuthContext";
import {ArrowBack} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";


const GroupCreation = (props) => {
        const navigate = useNavigate();
        const user = useAuth();
        const apiUrl = process.env.REACT_APP_API_URL;
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [members, setMembers] = useState(['']);
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
            if (user && user.uid) {
                setMembers([user.userName, '']);
                setIsLoaded(true);
            }
        }, [user]);

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

        const submitForm = () => {
            const nonEmptyMembers = members.filter(member => member.trim() !== '');
            const formData = {
                userId: user.uid,
                title: title,
                description: description.trim().length === 0 ? '' : description,
                members: nonEmptyMembers.map((member, index) => ({
                    name: member.trim(),
                    id: index === 0 ? user.uid : "",
                    guid: index
                }))
            };
            fetch(`${apiUrl}api/group/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => {
                if (response.ok) {
                    navigate(-1);
                } else {
                    throw new Error('Failed to create group. Status: ' + response.status);
                }
            }).catch(error => {
                console.error('There was an error processing your request:', error);
            });
        }

        if (!isLoaded) {
            return (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <CircularProgress/>
                </Box>
            );
        }
        return (<Box style={{margin: '5%'}}>
                <AppBar position="fixed" color="primary" style={{marginTop: 55, backgroundColor: "#595656", height: 45}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
                            <ArrowBack style={{marginBottom: '0.5em'}}/>
                        </IconButton>
                        <Typography variant="h6" style={{marginLeft: '0.5em', marginBottom: '0.5em'}}>New Group</Typography>
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
                        <div key={index} className="member-container" data-testid="member-container"
                             style={{display: 'flex', alignItems: 'center'}}>
                            <TextField
                                fullWidth
                                label={index === 0 ? "My name" : "Other member"}
                                value={member}
                                onChange={(event) => updateMemberName(index, event.target.value)}
                                variant="standard"
                                style={{flex: 1}}
                            />
                            {index < members.length - 1 && index !== 0 && (
                                <Button onClick={() => removeMember(index)} variant="outlined" style={{marginLeft: '10px'}}><DeleteIcon/></Button>
                            )}
                            {index === members.length - 1 && (
                                <Button onClick={addMember} className={"addMemberButton"} name={"addMemberButton"}
                                        variant="contained" style={{marginLeft: '10px'}}>
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
            </Box>
        );
    }
;

export default GroupCreation;
