import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../utils/tools";
import { useDispatch, useSelector } from "react-redux";
import { getArticleContent } from "../../store/actions/articles";
import { htmlDecode } from "../../utils/tools";
import ScoreCard from '../../utils/scoreCard';

const Article = () => {
    const article = useSelector(state=>state.articles);
    const dispatch = useDispatch();
    const { articleID } = useParams();

    useEffect(()=>{
        dispatch(getArticleContent(articleID))
    }, [articleID, dispatch])

    return (
        <>
            { !article || !article.current ? 
                <Loader/>

                :

                <div className="article_container">
                    <div
                        style={{
                            background: `url(https://picsum.photos/1920/1080)`
                        }}
                        className="image"
                    >
                    </div>
                        {/* TITLE */}
                        <h1>{article.current.title}</h1>

                        {/* CONTENT */}
                        <div className="mt-3 content">
                            <div dangerouslySetInnerHTML={
                                {__html: htmlDecode(article.current.content)}
                            }></div>
                        </div>

                        {/* SCORE CARD */}
                        <ScoreCard current= {article.current}/>

                </div>
            }
        </>
    )
}

export default Article;