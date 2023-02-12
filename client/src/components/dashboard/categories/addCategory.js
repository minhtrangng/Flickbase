import { useDispatch } from "react-redux";
import { errorHelper } from "../../../utils/tools";
import { addCategories } from "../../../store/actions/articles";

import { useFormik } from "formik"; 
import * as Yup from 'yup';

import {
    TextField,
    Button,
} from '@mui/material'
import { Form } from "react-router-dom";

const AddCategory = () => {
    const dispatch = useDispatch();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues:  {name: ''},
        validationSchema: Yup.object({
            name: Yup.string()
            .required('The name is required!!')
        }),
        onSubmit: (values, { resetForm }) => {
            // console.log(values)
            dispatch(addCategories(values))
            resetForm()
        }
    });

    return(
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className='form-group'>
                    <TextField 
                        style={{width: '100%'}}
                        name= "name"
                        lable = "Enter a name"
                        variant="outlined"
                        {...formik.getFieldProps('name')}
                        {...errorHelper(formik, 'name')}
                    />
                </div>

                <Button
                    className="mt-3"
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    Add Category
                </Button>
            </form>
        </>
    )
}

export default AddCategory;