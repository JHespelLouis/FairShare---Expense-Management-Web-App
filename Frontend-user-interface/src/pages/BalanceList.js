import React from 'react';
import {
    Box,
    List,
    ListItem,
    Typography,
    Divider
} from '@mui/material';

const BalanceList = ({expenses, groupData}) => {
    const calculateBalances = (expenses, groupData) => {
        const balances = {};
        groupData.members.forEach(member => {
            balances[member.guid] = {balance: 0, name: member.name};
        });

        expenses.forEach(expense => {
            const amountPerPerson = parseFloat((expense.amount / expense.forWho.length).toFixed(2));
            expense.forWho.forEach(person => {
                balances[person.guid].balance -= amountPerPerson;
            });
            balances[expense.paidBy.guid].balance += parseFloat(expense.amount);
        });

        Object.keys(balances).forEach(guid => {
            balances[guid].balance = parseFloat(balances[guid].balance.toFixed(2));
        });

        console.log("Final Balances:", balances);
        return balances;
    };

    const calculateSettlements = (balances) => {
        const settlements = [];
        const debtors = Object.entries(balances).filter(([, {balance}]) => balance < 0);
        const creditors = Object.entries(balances).filter(([, {balance}]) => balance > 0);

        while (debtors.length > 0 && creditors.length > 0) {
            const [debtorGuid, debtorData] = debtors[0];
            const [creditorGuid, creditorData] = creditors[0];

            const amountToSettle = Math.min(Math.abs(debtorData.balance), creditorData.balance);
            settlements.push({
                from: debtorData.name,
                to: creditorData.name,
                amount: amountToSettle.toFixed(2)
            });

            if (amountToSettle === Math.abs(debtorData.balance)) {
                debtors.shift();
            } else {
                debtors[0][1].balance += amountToSettle;
            }

            if (amountToSettle === creditorData.balance) {
                creditors.shift();
            } else {
                creditors[0][1].balance -= amountToSettle;
            }
        }
        console.log(settlements);
        return settlements;
    };

    const balances = calculateBalances(expenses, groupData);
    const settlements = calculateSettlements(balances);
    const maxBalance = Math.max(...Object.values(balances).map(balance => Math.abs(balance.balance))); // Find max balance for scaling

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <List component="nav" style={{width: '100%'}}>
                {Object.entries(balances).map(([guid, {balance, name}]) => (
                    <ListItem key={guid} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 20px',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'black',
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: balance > 0 ? '50%' : `calc(50% - ${(Math.abs(balance) / maxBalance) * 50}%)`,
                            bottom: 0,
                            width: `${(Math.abs(balance) / maxBalance) * 50}%`,
                            backgroundColor: balance > 0 ? 'rgba(76,175,80,0.5)' : 'rgba(244,67,54,0.5)',
                            zIndex: 1,
                            transform: balance > 0 ? 'translateX(0)' : 'translateX(0)',
                        }}/>
                        <Box sx={{
                            position: 'relative',
                            zIndex: 2,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography component="span" sx={{
                                marginRight: '10px',
                                textAlign: 'right',
                                width: '50%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {name}
                            </Typography>
                            <Typography component="span" sx={{
                                marginLeft: '10px',
                                textAlign: 'left',
                                width: '50%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {balance.toFixed(2)}€
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <Typography variant="h6" sx={{marginTop: '1em'}}>Reimbursement Proposals</Typography>
            <List component="nav" style={{width: '100%'}}>
                {settlements.map((settlement, index) => (
                    <ListItem key={index} sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'black',
                        marginBottom: '10px'
                    }}>
                        <Typography component="span" sx={{flexGrow: 1}}>
                            {settlement.from} owes {settlement.to}
                        </Typography>
                        <Typography component="span" sx={{flexGrow: 1, textAlign: 'right'}}>
                            {settlement.amount}€
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default BalanceList;
