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
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useAuth } from '../AuthContext';
import { ArrowBack } from "@mui/icons-material";

const GroupList = () => {
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
                .then(response => response.ok ? response.json() : Promise.reject("Error fetching groups"))
                .then(data => {
                    setGroupData(data);
                    setExpenses(data.expenses || []);
                    setIsLoaded(true);
                })
                .catch(error => console.log('error: ' + error));
        }
    }, [user, location.state, apiUrl]);

    function calculateBalances(expenses, groupData) {
        const balances = {};
        groupData.members.forEach(member => {
            balances[member.name] = 0;
        });

        expenses.forEach(expense => {
            const amountPerPerson = parseFloat((expense.amount / expense.forWho.length).toFixed(2));
            expense.forWho.forEach(person => {
                balances[person.name] = (balances[person.name] || 0) - amountPerPerson;
            });
            balances[expense.paidBy.name] = (balances[expense.paidBy.name] || 0) + parseFloat(expense.amount);
        });

        Object.keys(balances).forEach(name => {
            balances[name] = parseFloat(balances[name].toFixed(2));
        });

        console.log("Final Balances:", balances);
        return balances;
    }

    function renderExpensesList(expenses, user) {
        return (
            <List component="nav" style={{ paddingTop: '0em' }}>
                {expenses.map(expense => (
                    <React.Fragment key={expense.expenseId}>
                        <ListItemButton
                            onClick={() => navigate('/expense-details', { state: expense.expenseId })}
                        >
                            <ListItemText
                                primary={<span><span>{expense.title}</span><span style={{ float: 'right' }}>${expense.amount}</span></span>}
                                secondary={
                                    <span>
                                        <span>
                                            {expense.paidBy.uid === user.uid ? (
                                                <span>paid by <strong>me</strong></span>
                                            ) : (
                                                <span>paid by <strong>{expense.paidBy.name}</strong></span>
                                            )}
                                        </span>
                                        <span style={{ float: 'right' }}>{new Date(expense.date).toLocaleDateString()}</span>
                                    </span>
                                }
                            />
                        </ListItemButton>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        );
    }

    function renderBalancesList(expenses, user) {
        const balances = calculateBalances(expenses, groupData);
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <List component="nav" style={{ width: '100%' }}>
                    {Object.entries(balances).map(([name, balance]) => (
                        <ListItemButton key={name} sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: balance > 0 ? 'rgba(76,175,80,0.89)' : (balance < 0 ? 'rgba(244,67,54,0.85)' : 'rgba(158,158,158,0.85)'),
                            color: 'white',
                            padding: '10px 20px'
                        }}>
                            <Typography component="span" sx={{ marginRight: '10px', textAlign: 'right', width: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {name}
                            </Typography>
                            <Typography component="span" sx={{ marginLeft: '10px', textAlign: 'left', width: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {balance.toFixed(2)}€
                            </Typography>
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        );
    }

    if (!isLoaded || !user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <AppBar position="fixed" color="primary" style={{ marginTop: 55, backgroundColor: "#595656", height: 45 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
                        <ArrowBack style={{ marginBottom: '0.5em' }} />
                    </IconButton>
                    <Typography variant="h6" style={{ marginLeft: '0.5em', marginBottom: '0.5em' }}>{groupData.title}</Typography>
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
                <BottomNavigationAction label="Expenses" icon={<FormatListBulletedIcon />} />
                <BottomNavigationAction label="Balances" icon={<CompareArrowsIcon />} />
            </BottomNavigation>
            <Divider />
            {value === 1 ? renderBalancesList(expenses, user) : renderExpensesList(expenses, user)}
            <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
                <Fab color="primary" aria-label="add" onClick={() => navigate('/exc', { state: groupData })}>
                    <AddIcon />
                </Fab>
            </Box>
        </Box>
    );
};

export default GroupList;
