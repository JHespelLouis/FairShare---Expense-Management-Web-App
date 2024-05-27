import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import ExpenseForm from './ExpenseForm';

const ExpenseCreation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const groupData = location.state;
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = (formData) => {
        fetch(`${apiUrl}api/expense/${groupData.groupId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.status === 201) {
                navigate(-1);
            } else {
                console.log("Failed to add expense");
            }
        });
    };

    return (
        <ExpenseForm
            initialData={{}}
            onSubmit={handleSubmit}
            isEditMode={false}
            groupData={groupData}
            navigate={navigate}
        />
    );
};

export default ExpenseCreation;
