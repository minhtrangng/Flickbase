import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useSelector } from 'react-redux';

// Because this class will wrap other components => it will need props as
// parameter so that the inside components to be shown
const MainLayout = (props) => {
    const site = useSelector(state => state.site);

    return(
        <Container className={`app_container mb-5 ${site.layout}`}>
            {props.children}
            <ToastContainer/>
        </Container>
    )
}

export default MainLayout;