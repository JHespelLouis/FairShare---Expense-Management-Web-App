import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const db = getFirestore();
                const docRef = doc(db, "users", firebaseUser.uid);

                getDoc(docRef).then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = {
                            uid: firebaseUser.uid,
                            userName: docSnapshot.data().firstname, // Assuming 'firstname' is the field for username
                        };
                        setUser(userData);
                    } else {
                        console.error("No such document!");
                        setUser(null); // Handle cases where the user is authenticated but the additional data is missing
                    }
                }).catch((error) => {
                    console.error("Error getting document:", error);
                    setUser(null);
                });
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
