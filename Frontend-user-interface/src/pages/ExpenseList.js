import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    ListItemButton,
    ListItemText,
    Divider,
    List,
    Fab,
    Toolbar,
    Typography,
    AppBar,
    IconButton,
    BottomNavigation,
    BottomNavigationAction,
    CircularProgress,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useAuth } from '../AuthContext';
import { ArrowBack } from "@mui/icons-material";
import BalanceList from './BalanceList';
import GroupInvitation from './GroupInvitation';

const ExpenseList = () => {
    const user = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [groupData, setGroupData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (user && user.uid) {
            fetch(`${apiUrl}api/group/${location.state}`)
                .then(response => response.ok ? response.json() : Promise.reject("Error fetching group"))
                .then(data => {
                    setGroupData(data);
                    setExpenses(data.expenses || []);
                    setIsLoaded(true);
                })
                .catch(error => console.log('error: ' + error));
        }
    }, [user, location.state, apiUrl]);

    function renderExpensesList(expenses, user) {
        return (
            <List component="nav" style={{paddingTop: '0em'}}>
                {expenses.map(expense => (
                    <React.Fragment key={expense.expenseId}>
                        <ListItemButton
                            onClick={() => navigate('/exd', {state: {expense: expense, group: groupData}})}
                        >
                            <ListItemText
                                primary={<span><span>{expense.title}</span><span
                                    style={{float: 'right'}}>${expense.amount}</span></span>}
                                secondary={
                                    <span>
                                        <span>
                                            {expense.paidBy.uid === user.uid ? (
                                                <span>paid by <strong>me</strong></span>
                                            ) : (
                                                <span>paid by <strong>{expense.paidBy.name}</strong></span>
                                            )}
                                        </span>
                                        <span
                                            style={{float: 'right'}}>{new Date(expense.date).toLocaleDateString()}</span>
                                    </span>
                                }
                            />
                        </ListItemButton>
                        <Divider/>
                    </React.Fragment>
                ))}
            </List>
        );
    }

    if (!isLoaded || !user) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </Box>
        );
    }
    console.log(groupData)
    return (
        <Box>
            <AppBar position="fixed" color="primary" style={{marginTop: 55, backgroundColor: "#595656", height: 45}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
                        <ArrowBack style={{marginBottom: '0.5em'}}/>
                    </IconButton>
                    <Typography variant="h6" style={{marginLeft: '0.5em', marginBottom: '0.5em'}}>{groupData.title}</Typography>
                    <Button
                        color="inherit"
                        onClick={() => navigate('/mg', {state: {groupId: groupData.groupId}})}
                        style={{marginLeft: 'auto'}}
                    >
                        Manage Group
                    </Button>
                </Toolbar>
            </AppBar>
            <BottomNavigation
                showLabels
                value={value}
                defaultValue={0}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Expenses" icon={<FormatListBulletedIcon/>}/>
                <BottomNavigationAction label="Balances" icon={<CompareArrowsIcon/>}/>
            </BottomNavigation>
            <Divider/>
            {value === 1 ?
                <BalanceList groupData={groupData}/> : renderExpensesList(expenses, user)}
            <Box sx={{position: 'fixed', bottom: 16, right: 16, zIndex: 1000}}>
                <Fab color="primary" aria-label="add" onClick={() => navigate('/exc', {state: groupData, gid: groupData.groupId})}>
                    <AddIcon/>
                </Fab>
            </Box>
            <GroupInvitation groupId={groupData.groupId} />
        </Box>
    );
};

export default ExpenseList;
