import React, { useState, useEffect } from 'react';
import {
    TextField,
    Box,
    Toolbar,
    AppBar,
    InputLabel,
    Select,
    FormControl,
    MenuItem,
    ListItemText,
    List,
    ListItem,
    ListItemIcon,
    Divider,
    Checkbox,
    IconButton,
    Paper,
    styled,
    InputAdornment,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@mui/material";
import Typography from '@mui/material/Typography';
import { ArrowBack, Check, Delete } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ExpenseForm = ({ initialData, onSubmit, onDelete, isEditMode, groupData, navigate }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [selectedMember, setSelectedMember] = useState(initialData.paidBy ? initialData.paidBy.guid : 0);
    const [selectedMembers, setSelectedMembers] = useState(initialData.forWho ? initialData.forWho.map(member => member.guid) : []);
    const [amount, setAmount] = useState(initialData.amount || '');
    const [date, setDate] = useState(dayjs(initialData.date || new Date()));
    const isSubmitDisabled = !title || !amount || selectedMembers.length === 0;

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDelete = () => {
        onDelete();
        handleClose();
    };

    useEffect(() => {
        if (!initialData.forWho && groupData && groupData.members) {
            setSelectedMembers(groupData.members.map((_, index) => index));
        }
    }, [initialData, groupData]);

    const handleCheckboxChange = (index) => {
        const currentIndex = selectedMembers.indexOf(index);
        const newChecked = [...selectedMembers];

        if (currentIndex === -1) {
            newChecked.push(index);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedMembers(newChecked);
    };

    const handleToggleAll = () => {
        if (selectedMembers.length === groupData.members.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(groupData.members.map((_, index) => index));
        }
    };

    const getDividedAmount = () => {
        const numMembers = selectedMembers.length;
        const totalAmount = parseFloat(amount) || 0;
        return numMembers > 0 ? (totalAmount / numMembers).toFixed(2) : '0.00';
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: "#595656",
        padding: theme.spacing(1),
        color: "white",
    }));

    const handleSubmit = () => {
        const formData = {
            title,
            amount,
            date: date.format('YYYY-MM-DD'),
            paidBy: {
                uid: groupData.members[selectedMember].id,
                name: groupData.members[selectedMember].name,
                guid: groupData.members[selectedMember].guid
            },
            forWho: selectedMembers.map((index) => ({
                uid: groupData.members[index].id,
                name: groupData.members[index].name,
                guid: groupData.members[index].guid
            })),
        };
        onSubmit(formData);
    };

    return (
        <Box>
            <AppBar position="fixed" color="primary" style={{ marginTop: 55, backgroundColor: "#595656", height: 45 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back" style={{ marginBottom: '0.5em' }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" style={{ marginLeft: '20px', marginBottom: '0.5em' }}>
                        {isEditMode ? 'Edit Expense' : 'New Expense'}
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="submit"
                        style={{ marginLeft: 'auto', marginBottom: '0.5em' }}
                        disabled={isSubmitDisabled}
                        onClick={handleSubmit}
                    >
                        <Check />
                    </IconButton>
                    {isEditMode && (
                        <IconButton
                            color="inherit"
                            aria-label="delete"
                            style={{ marginBottom: '0.5em' }}
                            onClick={handleClickOpen}
                        >
                            <Delete />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <Box style={{ margin: '0.8em' }}>
                <TextField fullWidth id="Title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                           style={{ marginTop: '0em', marginBottom: '0.5em' }}
                           variant="standard" />
                <TextField type="number" fullWidth id="Amount" label="Amount $" value={amount}
                           onChange={(e) => setAmount(e.target.value)} style={{ marginBottom: '1em' }}
                           variant="standard" />
                <Box style={{ marginTop: '0.5em', marginBottom: '0em' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Date" value={date} onChange={(newValue) => setDate(newValue)} format="LL" />
                    </LocalizationProvider>
                </Box>
                <FormControl fullWidth variant="standard" style={{ marginTop: '0.6em', marginBottom: '0em' }}>
                    <InputLabel id="demo-simple-select-standard-label">Paid by</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={selectedMember}
                        onChange={(event) => setSelectedMember(event.target.value)}
                        renderValue={(selected) => groupData.members[selected].name}
                    >
                        {groupData.members.map((member, index) => (
                            <MenuItem key={index} value={index}>
                                <ListItemText primary={member.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Divider />
            <Box>
                <Item>
                    <Checkbox
                        edge="start"
                        checked={selectedMembers.length === groupData.members.length}
                        tabIndex={-1}
                        disableRipple
                        onChange={handleToggleAll}
                        style={{ marginLeft: "0em" }}
                    /> For Who</Item>
                <List>
                    {groupData.members.map((member, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedMembers.indexOf(index) > -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': `checkbox-list-label-${index}` }}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </ListItemIcon>
                                <ListItemText id={`checkbox-list-label-${index}`} primary={member.name} />
                                <TextField
                                    type="number"
                                    variant="standard"
                                    value={selectedMembers.indexOf(index) > -1 ? getDividedAmount() : '0.00'}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    disabled={selectedMembers.indexOf(index) === -1}
                                    style={{ width: '30%', textAlign: 'right' }}
                                />
                            </ListItem>
                            {index < groupData.members.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this expense?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExpenseForm;
