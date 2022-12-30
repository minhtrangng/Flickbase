import { useState } from "react";
import { useSelector } from "react-redux";
import Modal from 'react-bootstrap/Modal';

import  Grid  from "@mui/material/Grid";
import TextField  from "@mui/material/TextField";
import { Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import EmailStepper from "./stepper/email";

const AuthProfile = () => {
    const [emailModal, setEmailModal]= useState(false);
    const users = useSelector(state => state.users);

    const closeModal = () => setEmailModal(false)
    const openModal = () => setEmailModal(true)

    return(
        <div>
            <div className="mb-3 auth_grid">
                {/* E-MAIL */}
                <Grid container spacing={1} alignItems='flex-end'>
                    <Grid item>
                        <TextField
                            value={users.data.email}
                            disabled
                            variant="standard"
                        />
                    </Grid>

                    <Grid item>
                        <EditIcon color="primary" onClick={openModal}/>
                    </Grid>
                </Grid>

                {/* PASSWORD */}
                <Grid container spacing={1} alignItems='flex-end' className="mt-2">
                    <Grid item>
                        <TextField
                            value="**********"
                            disabled
                            variant="standard"
                        />
                    </Grid>

                    <Grid item>
                        <EditIcon color="primary" />
                    </Grid>
                </Grid>
            </div>
            <Divider/>

            <Modal size='lg' centered show={emailModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Your E-Mail</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <EmailStepper
                        user={users}
                        closeModal={closeModal}
                    />
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default AuthProfile;