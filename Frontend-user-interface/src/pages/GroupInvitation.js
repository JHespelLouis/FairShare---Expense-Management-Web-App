import {useState} from "react";
import {IconButton, Snackbar, Box, Fab} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

const GroupInvitation = (props) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(window.location.origin.toString() + "/invite/" + props.groupId.toString());
    };

    return (
        <>
            <Box sx={{position: 'fixed', bottom: 16, left: 16, zIndex: 1000}}>
                <Fab color="primary" aria-label="add" onClick={handleClick}>
                    <ShareIcon/>
                </Fab>
            </Box>
            <Snackbar
                message="Invitation link copied to clibboard"
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
            />
        </>
    );
};

export default GroupInvitation;
