import React, {useEffect, useState} from 'react';
import '../styles/NewGame.css';
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import {doc, getDoc, getFirestore} from "firebase/firestore";

const NewGame = (props) => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [members, setMembers] = useState(['', '']);
        const [userId, setUserId] = useState('');
        const [userName, setUserName] = useState('');

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
                            setUserName(userName);
                            // Initialize members here to include the userName
                            setMembers([userName, '']);
                        } else {
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                }
            });
        }, []);

        const resetForm = () => {
            setDescription('');
            setTitle('');
            setMembers([userName, '']);
        };

        const addMember = () => {
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
            if (!description) {
                emptyFields.push("Date");
            }
            if (!members.every(member => member.trim() !== '')) {
                console.log(members)
                emptyFields.push("Members");
            }
            if (emptyFields.length > 0) {
                errorDisplay([`Veuillez compléter le(s) champ(s) : ${emptyFields.join(', ')}`]);
                return false;
            }
            document.getElementsByClassName("errors")[0].style.display = "none";
            return true
        }

        const submitForm = () => {
            console.log(members)
            if (!dataVerificaiton()) {
                return;
            }
            const formData = {
                userId: userId,
                title: title,
                description: description,
                members: members.map((member, index) => ({
                    name: member.trim(),
                    id: index === 0 ? userId : "",
                }))
            };
            console.log(formData)
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
                    successDisplay();
                } else {
                    errorDisplay([res.errors]);
                }
            });
        }

        const successDisplay = () => {
            document.getElementById("success-message").innerText = "The group \"" + title + "\" has been created successfully.";
            document.getElementsByClassName("errors")[0].style.display = "none";
            document.getElementsByClassName("success")[0].style.display = "block";
            resetForm();
        };

        const errorDisplay = (errors) => {
            document.getElementsByClassName("success")[0].style.display = "none";
            let html = "";
            for (let i of errors) {
                html += "<li>" + i + "</li>";
            }
            document.getElementById("errors").innerHTML = html;
            document.getElementsByClassName("errors")[0].style.display = "block";
        }

        return (<div>
                <Button type="button" onClick={props.onCancel} className={"back-button"}>
                    Retour
                </Button>
                <div className="header">
                    <span>New Group :</span>
                </div>
                <div className="new-game-container">
                    <label htmlFor={"title"}>Title:</label>
                    <input
                        id={"title"}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                    />

                    <label htmlFor={"description"}>Description:</label>
                    <input
                        id={"description"}
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        required
                    />

                    <label>Members:</label>
                    {members.map((member, index) => (
                        <div key={index} className="member-container" data-testid="member-container">
                            <input
                                type="text"
                                value={index === 0 ? userName : member}
                                onChange={(e) => updateMemberName(index, e.target.value)}
                                placeholder={`Name of member n°${index + 1}`}
                                required
                                disabled={index === 0}
                            />
                            <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className={`remove-button ${members.length <= 2 ? 'disabled' : ''}`}
                                disabled={members.length <= 2}
                            >
                                <DeleteIcon/>
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addMember} className={"addMemberButton"} name={"addMemberButton"}>
                        Add Member
                    </button>
                    <div className={"errors"}>
                        <label>Erreur(s): </label>
                        <ul id={'errors'}></ul>
                    </div>
                    <div className={"success"}>
                        <label>Succès: </label>
                        <p id="success-message"></p>
                    </div>

                    <DialogActions>
                        <Button onClick={submitForm}>
                            Submit
                        </Button>
                    </DialogActions>
                </div>
            </div>
        );
    }
;

export default NewGame;
