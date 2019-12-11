import * as postsAPI from '..//api/posts';
import { reducerUtils } from '../lib/asyncUtils';

const GET_POSTS = 'GET_POSTS';
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';
const GET_POSTS_ERROR = 'GET_POSTS_ERROR';

const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

//thunk 생성함수
export const getPosts = () => async dispatch => {
    // 요청이 시작됨
    dispatch({ type : GET_POSTS });
    // API를 호출
    try{
        const posts = await postsAPI.getPosts();
        // 성공했을 때
        dispatch({
            type: GET_POSTS_SUCCESS,
            posts
        });
    } catch(e) {
        // 실패했을 때
        dispatch({
            type: GET_POSTS_ERROR,
            error: e
        });
    }
};

export const getPost = id => async dispatch => {
    // 요청이 시작됨
    dispatch({ type : GET_POST });
    // API를 호출
    try{
        const post = await postsAPI.getPost(id);
        // 성공했을 때
        dispatch({
            type: GET_POST_SUCCESS,
            posts
        });
    } catch(e) {
        // 실패했을 때
        dispatch({
            type: GET_POST_ERROR,
            error: e
        });
    }
};

const initialState = {
    posts: reducerUtils.initial(),
    post: reducerUtils.initial()
}

//reducer
export default function posts(state = initialState, action){
    switch (action.type){
        case GET_POSTS:
            return {
                ...state,
                posts: {
                    loading: true,
                    data: null,
                    error: null,
                }
            };
        case GET_POSTS_SUCCESS:
            return{
                ...state,
                posts: {
                    loading: false,
                    data: action.posts,
                    error: null
                }
            }
        case GET_POSTS_ERROR:
            return {
                ...state,
                posts: {
                    loading: false,
                    data : null,
                    error : action.error
                }
            }
        case GET_POST:
            return {
                ...state,
                post: {
                    loading: true,
                    data: null,
                    error: null,
                }
            };
        case GET_POST_SUCCESS:
            return{
                ...state,
                post: {
                    loading: false,
                    data: action.posts,
                    error: null
                }
            }
        case GET_POST_ERROR:
            return {
                ...state,
                post: {
                    loading: false,
                    data : null,
                    error : action.error
                }
            }
        default:
            return state;
    }
}