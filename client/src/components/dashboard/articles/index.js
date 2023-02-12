import { useEffect, useRef, useState } from "react";

import { AdminTitle } from "../../../utils/tools";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getPaginateArticles, changeStatusArticle, removeArticle, getExportArticle } from "../../../store/actions/articles";
import PaginateComponent from "./paginate";



import  {
    Button,
    Modal,
    ButtonToolbar,
    InputGroup,
    FormControl,
    ButtonGroup
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap'

const AdminArticles = () => {

    const user = useSelector(state => state.users.data);

    const articles = useSelector(state => state.articles);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [removeAlert, setRemoveAlert] = useState(false);
    const [toRemove, setToRemove] = useState(null);

    const JSONdata = [
        {
            name: "Person1",
            age: 12
        },
        {
            name: "Person2",
            age: 23
        },
        {
            name: "Person3",
            age: 20
        }
    ]

    const handleClose = () => {
        setRemoveAlert(false);
    }

    const handleShow = (id=null) => {
        setToRemove(id);
        setRemoveAlert(true);
    }

    // GET DATA TO BE EXPORTED
    const exportData = () => {
        

        if(articles && articles.exportingArticles) {
            console.log(articles.exportingArticles);
            const filename = "data.json";
            const data = new Blob([JSON.stringify(articles.exportingArticles)], {type: "text/json"});
            const jsonURL = window.URL.createObjectURL(data);
            const link = document.createElement("a");
            document.body.appendChild(link);
            link.href =jsonURL;
            link.setAttribute("download", filename);
            link.click();
            document.body.removeChild(link)
        }
    }
        
        
        
        

        // THIS CODE SNIPET WORKS
        // const filename = "data.json";
        // const data = new Blob([JSON.stringify(JSONdata)], {type: "text/json"});
        // const jsonURL = window.URL.createObjectURL(data);
        // const link = document.createElement("a");
        // document.body.appendChild(link);
        // link.href =jsonURL;
        // link.setAttribute("download", filename);
        // link.click();
        // document.body.removeChild(link)

 

    // PAGINATION COMMANDS
    const goToPrevPage = (page) => {
        dispatch(getPaginateArticles({page}))
    }

    const goToNextPage = (page) => {
        dispatch(getPaginateArticles({page}))
    }

    const goToEdit = (articleID) => {
        navigate(`/dashboard/articles/edit/${articleID}`, )
    }

    const handleStatusChange = (status, articleID) => {
        let newStatus = status === 'draft' ? 'public' : 'draft';
        dispatch(changeStatusArticle({newStatus, articleID}))
    }

    const handleDelete = () => {
        // console.log('Delete has been handled!')
        // console.log(toRemove)
        dispatch(removeArticle(toRemove))
        .unwrap()
        // The things inside finally() will be the very last things that are executed
        // and will be always executed
        // Using then(): After then(), we can have catch() to handle error(s)
        // If there is an error => the things inside then() will never be executed
        .finally(() => {
            setRemoveAlert(false)
            setToRemove(null);  
        })
    }

    

    // END PAGINATION COMMANDS


    useEffect(()=> {
        // DISPATCH
        dispatch(getPaginateArticles({}))
        dispatch(getExportArticle({}))
    }, [])

    

    return(
        <>
            <AdminTitle title="Admin Articles"/>
            {/* ADMIN ARTICLES */}
            <div className="articles_table">
                <ButtonToolbar className="mb-3">
                    <ButtonGroup className="me-2">
                        <LinkContainer to="/dashboard/articles/add">
                            <Button variant="secondary"> Add Articles </Button>
                        </LinkContainer>
                    </ButtonGroup>

                    <form>
                        <InputGroup>
                            <InputGroup.Text id="btngrp1">@</InputGroup.Text>
                            <FormControl
                                type="text"
                                placeholder="Search"
                            />
                        </InputGroup>
                    </form>

                </ButtonToolbar>

                

                <Button
                    className="mb-3"
                    color='secondary'
                    onClick={exportData}
                >
                    Export Articles
                </Button>
        
                {/* PAGINATION */}
                <>  
                    <PaginateComponent
                        articles={articles.adminArticles}
                        goToPrevPage={(page) => goToPrevPage(page)}
                        goToNextPage={(page) => goToNextPage(page)}
                        goToEdit={(articleID)=> goToEdit(articleID)}
                        handleStatusChange={(status, articleID)=>handleStatusChange(status, articleID)}
                        handleShow={(id) => handleShow(id)}
                    />
                </>

                <Modal
                    show={removeAlert}
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Are you really sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        There is no going back.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    )
}

export default AdminArticles;