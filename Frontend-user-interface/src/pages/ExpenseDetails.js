import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import ExpenseForm from './ExpenseForm';
import {useAuth} from '../AuthContext';

const ExpenseDetails = () => {
    const user = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const expenseDetails = location.state.expense;
    const groupData = location.state.group;
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = (formData) => {
        fetch(`${apiUrl}api/expense/${groupData.groupId}/${expenseDetails.expenseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.status === 200) {
                navigate(-1);
            } else {
                console.log("Failed to update expense");
            }
        });
    };

    const handleDelete = () => {
        fetch(`${apiUrl}api/expense/${groupData.groupId}/${expenseDetails.expenseId}`, {
            method: 'DELETE'
        }).then(response => {
            if (response.status === 200) {
                navigate(-1);
            } else {
                console.log("Failed to delete expense");
            }
        });
    };

    return (
        <ExpenseForm
            initialData={expenseDetails}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isEditMode={true}
            groupData={groupData}
            navigate={navigate}
        />
    );
};

export default ExpenseDetails;
