import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import {useAuth} from '../AuthContext';

const JoinGroup = () => {
    const user = useAuth();
    const {groupId} = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [groupData, setGroupData] = useState({});
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        if (user && user.uid) {
            fetch(`${apiUrl}api/group/${groupId}`)
                .then(response => response.ok ? response.json() : Promise.reject("Error fetching group"))
                .then(data => {
                    setGroupData(data);
                    setMessage(`You have been invited to join the group with ID: ${groupData.title}`);
                    setIsLoaded(true);
                    checkIfUserInGroup(data.members, user.uid);
                })
                .catch(error => console.log('error: ' + error));
        }
        if (!groupId) {
            setMessage('Invalid invitation link.');
        }
    }, [groupId, user, apiUrl]);

    const checkIfUserInGroup = (members, userId) => {
        const isMember = members.some(member => member.id === userId);
        if (isMember) {
            setMessage('You are already a member of this group.');
        } else {
            setMessage('Please select who you are in the group to join.');
        }
    };

    const handleMemberSelect = (guid) => {
        setSelectedMember(guid);
    };

    const handleJoinGroup = () => {
        if (selectedMember !== null) {
            const updatedMembers = groupData.members.map(member =>
                member.guid === selectedMember ? {...member, id: user.uid} : member
            );
            fetch(`${apiUrl}api/user/${user.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...groupData, members: updatedMembers})
            }).then(response => response.ok ? navigate('/ex', {state: groupId}) : Promise.reject("Error updating group"))
                .catch(error => console.log('error: ' + error));
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            {isLoaded ? (
                <>
                    <Typography variant="h6">{message}</Typography>
                    {!message.includes('already a member') && (
                        <FormControl component="fieldset" sx={{mt: 2}}>
                            <FormLabel component="legend">Select Your Name</FormLabel>
                            <FormGroup>
                                {groupData.members && groupData.members.map(member => (
                                    <FormControlLabel
                                        key={member.guid}
                                        control={
                                            <Checkbox
                                                checked={selectedMember === member.guid}
                                                onChange={() => handleMemberSelect(member.guid)}
                                                name={member.name}
                                            />
                                        }
                                        label={member.name}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleJoinGroup}
                        sx={{mt: 2}}
                        disabled={selectedMember === null || message.includes('already a member')}
                    >
                        Confirm and Join Group
                    </Button>
                </>
            ) : (
                <CircularProgress/>
            )}
            <Button variant="contained" onClick={() => navigate('/')} sx={{mt: 2}}>
                Go to Home
            </Button>
        </Box>
    );
};

export default JoinGroup;
