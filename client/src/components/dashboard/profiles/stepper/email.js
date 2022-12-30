import { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { errorHelper, Loader } from "../../../../utils/tools";

import { changeEmail } from "../../../../store/actions/users";

import {
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel
} from '@mui/material'

const EmailStepper = ({user, closeModal}) => {
    const [ activeStep, setActiveStep] =  useState(0);
    const steps = ['Enter old e-mail',
                    'Enter new e-mail',
                    'Are you sure?'];
    const dispatch = useDispatch();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { email: '', newemail:''},
        validationSchema: Yup.object({
            // E-MAIL
            email: Yup.string()
            .required('The email is required')
            .email('The entered email is not valid')
            .test('match', 'Please check your email', (email) => {
                return email === user.data.email
            }),

            // NEW E-MAIL
            newemail: Yup.string()
            .required('The email is required')
            .email('The entered email is not valid')
            .test('equal', 'The new email is the same as the old one', (newemail) => {
                return newemail !== user.data.email
            })
        }),
        onSubmit: (values) => {
            dispatch(changeEmail(values))
            .unwrap()
            .then(() => {
                closeModal();
            })
        }
    })

    // GO TO THE NEXT STEP
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    // GO BACK TO THE PREV STEP
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    // NEXT BUTTON TO CHANGE TO THE NEXT STEP
    const nextBtn = () => {
        return(
            <Button className="mt-3" variant="contained" color="primary" 
                onClick={handleNext}>
                NEXT
            </Button>
        )
        
    }

    // BACK BUTTON
    const backBtn = () => {
        return (
            <Button className="mt-3 me-2" variant="contained" color="primary"
                onClick={handleBack}>
                BACK
            </Button>
        )
        
    }

    return (

        <>
            { user.loading ? 
                <Loader/>
            :
                <>
                    <Stepper activeStep={activeStep}>
                        { steps.map(label => {
                            return (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>

                    <form className="mt-3 stepper_form" onSubmit={formik.handleSubmit}>
                        {/* STEP 1 APPEARANCE */}
                        { activeStep === 0 ?
                            <div className="form-group">
                                <TextField
                                    style={{width: '100%'}}
                                    name='email'
                                    label='Enter your old e-mail'
                                    variant="outlined"
                                    {...formik.getFieldProps('email')}
                                    {...errorHelper(formik, 'email')}
                                />
                                { formik.values.email && !formik.errors.email ? 
                                    nextBtn()
                                : null
                                }
                            </div>

                        : null
                        }

                        { activeStep === 1 ?
                            <div className="form-group">
                                <TextField
                                    style={{width: '100%'}}
                                    name='newemail'
                                    label='Enter your new e-mail'
                                    variant="outlined"
                                    {...formik.getFieldProps('newemail')}
                                    {...errorHelper(formik, 'newemail')}
                            />
                            { backBtn() }
                            { formik.values.newemail && !formik.errors.newemail ? 
                                nextBtn()
                            : null
                            }
                            </div>

                        : null
                        }

                        { activeStep === 2 ?
                            <div className="form-group">
                                <Button className="mt-3 me-2" variant="contained" color="primary"
                                    onClick={formik.submitForm}>
                                    Yes, I want to change my e-mail
                                </Button>
                                { backBtn() }
                            </div>

                        : null
                        }
                        

                    </form>
                </>
            }
        </>
    )
}
export default EmailStepper;