import * as postsAPI from '../api/posts';
import { reducerUtils, createPromiseThunk, handleAsyncActions } from '../lib/asyncUtils';

const GET_POSTS = 'GET_POSTS';
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS';
const GET_POSTS_ERROR = 'GET_POSTS_ERROR';

const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

const CLEAR_POST = 'CLEAR_POST'

//thunk 생성함수
export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
export const getPost = id => async dispatch =>{
    dispatch({ type: GET_POST, meta: id });
    try{
        const payload = await postsAPI.getPostById(id);
        dispatch({ type: GET_POST_SUCCESS, payload, meta: id })
    } catch (e) {
        dispatch({
            type: GET_POST_ERROR,
            payload: e,
            error: true,
            meta: id
        });
    }
}
export const clearPost = () => ({ type: CLEAR_POST });

const initialState = {
    posts: reducerUtils.initial(),
    post: {}
}

const getPostsReducer = handleAsyncActions(GET_POSTS, 'posts', true);
const getPostReducer = (state, action) => {
    const id = action.meta;
    switch (action.type) {
        case GET_POST:
            return {
                ...state,
                post: {
                    ...state.post,
                    [id]: reducerUtils.loading(state.post[id] && state.post[id].data)   // state.post[id]가 undefined면 전체가 undefined loading중에는 undefined이고
                                                                                        // 객체가 존재한다면 데이터를 읽어와서 로딩중에 사용할 데이터 상태로 쓰겠다는뜻 즉 로딩중에도 기존 데이터를 초기화 하지 않겠다.
                }
            }
        case GET_POST_SUCCESS:
            return {
                ...state,
                post: {
                    ...state.post,
                    [id]: reducerUtils.success(action.payload)
                }
            }
        case GET_POST_ERROR:
            return {
                ...state,
                post: {
                    ...state.post,
                    [id]: reducerUtils.error(action.payload)
                }
            }
        default:
            break;
    }
}

//reducer
export default function posts(state = initialState, action){
    switch (action.type){
        case GET_POSTS:
        case GET_POSTS_SUCCESS:
        case GET_POSTS_ERROR:
            return getPostsReducer(state, action);
        case GET_POST:
        case GET_POST_SUCCESS:
        case GET_POST_ERROR:
            return getPostReducer(state, action);
        case CLEAR_POST:
            return {
                ...state,
                post: reducerUtils.initial()
            }
        default:
            return state;
    }
}