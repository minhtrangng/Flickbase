import { useEffect } from 'react';

// MUI
import Grid from '@mui/material/Grid';
import { Button }  from '@mui/material';

// redux
import { useSelector, useDispatch } from 'react-redux';

import { homeLoadMore } from '../../store/actions/articles';
import ArticleCard from '../../utils/articleCard';


const Home = () => {

    const articles = useSelector(state => state.articles);
    const dispatch = useDispatch();

    // LOAD ARTICLE
    useEffect(() => {
        // The if statement is to prevent the load more executing when the user exit the home page and go back again
        // E.g., there are 4 posts on the home, the user goes to dashboard and goes back to home => the number of displayed post is still 4 (and not 8)
        // The number of displayed posts should only be increment when the load more button is clicked
        if(articles.articles.length <= 0){
            dispatch(homeLoadMore(articles.homeSort))
        }
    }, [dispatch])

    // LOAD MORE ARTICLES
    const getNextArticles= () => {
        let skip = articles.homeSort.skip + articles.homeSort.limit;
        dispatch(homeLoadMore({...articles.homeSort, skip : skip})) 
    }

    return(
        <>
            <Grid container spacing={2} className="article_card">
                { articles && articles.articles ? 
                    articles.articles.map(item => (
                        <Grid key = {item._id} item xs={12} sm={6} lg={3}>
                            {/* {item.title} */}
                            <ArticleCard article={item}/>
                            
                        </Grid>
                    ))
                : null
                }
            </Grid>

            <hr/>
            <Button
                variant='outlined'
                onClick={getNextArticles}
            >
                LOAD MORE
            </Button>
        </>
    )
}

export default Home;