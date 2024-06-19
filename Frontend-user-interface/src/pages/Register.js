import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Avatar, Button, CssBaseline, TextField, Box, Typography, Container} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {auth} from '../firebase';
import {createUserWithEmailAndPassword} from "firebase/auth";

import {getFirestore, doc, setDoc} from "firebase/firestore";


import {useSpring, animated} from 'react-spring';

const defaultTheme = createTheme();

export default function Register() {

    const navigate = useNavigate();

    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [accountExistsError, setAccountExistsError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    function isValidName(name) {
        // Format du nom : uniquement des lettres avec une longueur minimale de 2 caractères
        const nameRegex = /^[A-Za-z]{2,}$/;
        return nameRegex.test(name);
    }

    function isValidEmail(email) {
        // Format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        // Format du mot de passe
        // Au moins 8 caractères avec au moins une lettre majuscule, une lettre minuscule et un chiffre
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9!@#$%^&*()_]{8,}$/;
        return passwordRegex.test(password);
    }

    const confirmationAnimation = useSpring({
        opacity: showConfirmation ? 1 : 0,
        transform: showConfirmation ? 'translateY(0)' : 'translateY(-100%)',
        color: showConfirmation ? '#00C853' : 'transparent', // Ajoutez cette ligne
    });

    const handleSubmit = (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const firstname = data.get('firstname');
        const lastname = data.get('lastname');
        const email = data.get('email');
        const password = data.get('password');

        if (!isValidName(firstname)) {
            setFirstnameError('The format of the firstname is incorrect');
            return;
        }

        if (!isValidName(lastname)) {
            setLastnameError('The format of the lastname is incorrect');
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError('The format of the email is incorrect');
            return;
        }

        if (!isValidPassword(password)) {
            setPasswordError('The format of the password is incorrect. At least 8 characters with at least one uppercase letter, one lowercase letter and one digit');
            return;
        }

        createUserWithEmailAndPassword(auth, data.get('email'), data.get('password'))
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                // Ajout des données dans Firestore
                const db = getFirestore();
                const docRef = doc(db, "users", user.uid)
                const data = {
                    uid: user.uid,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                };

                setDoc(docRef, data)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });

                setShowConfirmation(true); // Déclenche l'animation de confirmation
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    setAccountExistsError('An account already exists with this email');
                } else {
                    console.log(errorCode);
                    console.log(errorMessage);
                }
            });

    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: '#3F72AF'}}>
                        <AccountCircleIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <animated.div style={confirmationAnimation}>
                        <Typography variant="body1" style={{color: confirmationAnimation.color}}>Account Created with
                            success !</Typography>
                    </animated.div>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstname"
                            label="Firstname"
                            name="firstname"
                            autoComplete="firstname"
                            autoFocus
                            error={!!firstnameError}
                            helperText={firstnameError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastname"
                            label="Lastname"
                            name="lastname"
                            autoComplete="lastname"
                            error={!!lastnameError}
                            helperText={lastnameError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email address"
                            name="email"
                            autoComplete="email"
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                        <Typography color="error">{accountExistsError}</Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}