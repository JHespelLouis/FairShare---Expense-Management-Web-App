import React from 'react';
import {AppBar, Box, Toolbar, Button, IconButton} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {Link, Outlet} from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import {useAuth} from '../AuthContext';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});

export default function Nav() {
    const user = useAuth();

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <AppBar position="fixed">
                    <Toolbar style={{width: "auto", justifyContent: "space-between", alignItems: 'center'}}>
                        <Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>
                            <IconButton>
                                FairShare
                            </IconButton>
                        </Link>
                        {user && user.uid ? (
                            <Link to="/myAccount" className="Button">
                                <Button variant="outlined" endIcon={<AccountCircleIcon/>}>
                                    My Profile
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/login" className="Button">
                                <Button variant="outlined" endIcon={<LoginIcon/>}>
                                    Sign In/Register
                                </Button>
                            </Link>
                        )}
                    </Toolbar>
                </AppBar>
                <Box style={{height: 100}}/> {/* Adjust as necessary to compensate for total AppBar heights */}
            </ThemeProvider>
            <Outlet/>
        </>
    );
}
