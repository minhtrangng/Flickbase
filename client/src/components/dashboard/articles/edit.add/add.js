// libs
import { useState, useRef } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";

// components
import { AdminTitle } from "../../../../utils/tools";
import { errorHelper, Loader } from "../../../../utils/tools";
import { validation, formValues } from './validationSchema';
import WYSIWYG from "../../../../utils/form/wysiwyg";

// redux
import { useDispatch, useSelector } from "react-redux";
import { addArticle } from "../../../../store/actions/articles";

// MUI
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button' 
import Divider from '@mui/material/Divider' 
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
 
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';


const AddArticles =() => {
    const [editorBlur, setEditorBlur] = useState(false);

    // Redux
    const articles = useSelector(state => state.articles);
    const dispatch = useDispatch();

    const actorsValue = useRef('');

    const navigate = useNavigate();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: formValues,
        validationSchema: validation,
        onSubmit: (values) => {
            // console.log(values);
            dispatch(addArticle(values))
            .unwrap()
            .then(() => {
                navigate('/dashboard/articles')
            })
        } 
    });

    // HANDLE ENTERED DATA FROM EDITOR BLOCK
    const handleEditorState = (state) => {
        // console.log(state);
        formik.setFieldValue('content', state, true);
    }

    const handleEditorBlur = (blur) => {
        setEditorBlur(true)
    }

    return (
        <>
            <AdminTitle title="Add New Articles"></AdminTitle>
            {/* ADD ARTICLES */}
            <form className="mt-3 article_form" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <TextField
                        style={{width: '100%'}}
                        name='title'
                        label='Enter a title'
                        variant='outlined'
                        {...formik.getFieldProps('title')}
                        {...errorHelper(formik, 'title')}
                    />
                </div>

                <div className="form-group">
                     <WYSIWYG
                        setEditorState={(state) => handleEditorState(state)}
                        setEditorBlur={(blur) => handleEditorBlur(blur)}
                        onError={formik.errors.content}
                        editorBlur={editorBlur}
                     />
                </div>
                { formik.errors.content || (formik.errors.content && editorBlur) ?
                    <FormHelperText error={true}>
                        {formik.errors.content}
                    </FormHelperText>

                    : null
                }

                <div className="form-group">
                    <FormikProvider value={formik}>
                        <FieldArray 
                            name="actors"
                            render={arrayHelpers => (
                                <div>
                                    <Paper className="actors_form">
                                        <InputBase
                                            inputRef={actorsValue}
                                            className="input"
                                            placeholder="Add Actor Name Here"
                                        />
                                        <IconButton
                                            onClick={()=> {
                                                if(actorsValue.current.value !== ''){
                                                    arrayHelpers.push(actorsValue.current.value);
                                                }
                                                actorsValue.current.value = '';
                                            }}
                                        >
                                            <AddIcon/>
                                        </IconButton>
                                    </Paper>
                                    
                                    { formik.errors.actors && formik.touched.actors ?
                                        <FormHelperText error={true}>
                                            { formik.errors.actors }
                                        </FormHelperText>
                                        : null
                                    }

                                    <div className="chip_container">
                                        { formik.values.actors.map((actor, index)=>(
                                            <div key={index}>
                                                <Chip
                                                    label={`${actor}`}
                                                    color="primary"
                                                    onDelete={() => arrayHelpers.remove(index)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}
                        />
                    </FormikProvider>
                </div>

                <div className="form-group">
                    <TextField
                        style={{width: '100%'}}
                        name='except'
                        label='Enter a short description'
                        variant='outlined'
                        {...formik.getFieldProps('excerpt')}
                        {...errorHelper(formik, 'excerpt')}
                        multiline
                        rows={4}
                    />
                </div>

                <Divider className="mt-3 mb-3"/>

                <div className="form-group">
                    <TextField
                        style={{width: '100%'}}
                        name='score'
                        label='Enter a score'
                        variant='outlined'
                        {...formik.getFieldProps('score')}
                        {...errorHelper(formik, 'score')}
                    />
                </div>

                <div className="form-group">
                     ACTORS - WYSIWYG
                </div>

                <div className="form-group">
                    <TextField
                        style={{width: '100%'}}
                        name='director'
                        label='Enter a director'
                        variant='outlined'
                        {...formik.getFieldProps('director')}
                        {...errorHelper(formik, 'director')}
                    />
                </div>

                <Divider className="mt-3 mb-3"/>

                <FormControl fullWidth>
                    <InputLabel>Select a Status</InputLabel>
                    <Select
                        name="status"
                        label="Select a Status"
                        {...formik.getFieldProps('status')}
                        error= { formik.errors.status && formik.touched.status ? true: false}    
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="draft"><em>Draft</em></MenuItem>
                        <MenuItem value="public"><em>Public</em></MenuItem>

                    </Select>

                    { formik.errors.status && formik.touched.status ?
                        <FormHelperText error="true">
                            { formik.errors.status }
                        </FormHelperText>
                        : null
                    }
                </FormControl>

                <Divider className="mt-3 mb-3"/>

                { articles.loading ? 
                    <Loader/>
                : <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    ADD ARTICLE
                  </Button>
                }    

            

            </form>
        </>
    )
}
export default AddArticles;