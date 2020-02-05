import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Transfer from "./Transfer";

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${50}%`,
        left: `${45}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 300,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 4),
        outline: 'none',
    },
    img:{
        margin:'auto',
        display:'block'
    }
}));

export default function SimpleModal(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);

    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={props.open}
            onClose={props.handleClose}
            elevation={24}
        >
            <div style={modalStyle} className={classes.paper}>
                {props.soort === "transfer" ? <Transfer /> : 
                <img 
                src={props.imgAddress}
                className={classes.img}
                />}
                <SimpleModal />
            </div>
        </Modal>
    );
}