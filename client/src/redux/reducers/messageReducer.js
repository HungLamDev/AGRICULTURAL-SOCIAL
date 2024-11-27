import { MESS_TYPES } from '../actions/messageAction';
import { EditData, DeleteData } from '../actions/globalTypes';

const initialState = {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false,
    newMessages: {},
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESS_TYPES.ADD_USER:
            if (state.users.every((item) => item._id !== action.payload._id)) {
                return {
                    ...state,
                    users: [action.payload, ...state.users]
                };
            }
            return state;
        case MESS_TYPES.ADD_MESSAGE:
            const updatedUsers = state.users.map((user) =>
            user._id === action.payload.recipient || user._id === action.payload.sender
                ? {
                    ...user,
                    text: action.payload.text,
                    media: action.payload.media,
                    call: action.payload.call,
                    lastMessageTime: action.payload.lastMessageTime, // Cập nhật thời gian cuối cùng
                }
                : user
            );
        
            // Sắp xếp người dùng theo thời gian nhắn tin gần nhất
            const sortedUsers = updatedUsers.sort((a, b) => {
            const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
            const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
            return timeB - timeA; // Sắp xếp giảm dần
            });
            return {
                ...state,
                data: state.data.map(item => 
                    item._id === action.payload.recipient || item._id === action.payload.sender
                    ? {...item, 
                    messages: [...item.messages, action.payload],
                    result :  item.result + 1}
                    : item
                ),
                users: sortedUsers,
                newMessages: {
                    ...state.newMessages,
                    [action.payload.sender]: true, // Đánh dấu có tin nhắn mới
                },
            };
        case MESS_TYPES.GET_CONVERSATIONS:
            return {
                ...state,
                users: action.payload.newArr,
                resultUsers: action.payload.result,
                firstLoad: true
            };
        case MESS_TYPES.GET_MESSAGES:
            return {
                ...state,
                data: [...state.data, action.payload],
            };
        case MESS_TYPES.UPDATE_MESSAGES:
            return {
                ...state,
                data: EditData(state.data, action.payload._id, action.payload)
            };
        case MESS_TYPES.DELETE_MESSAGES:
            return {
                ...state,
                data: state.data.map(item => 
                    item._id === action.payload._id
                    ? {...item, messages: action.payload.newData}
                    : item
                )
            };
            case MESS_TYPES.DELETE_CONVERSATION:
                return {
                  ...state,
                  users: DeleteData(state.users, action.payload),
                  data: DeleteData(state.data, action.payload),
                };
            case MESS_TYPES.CHECK_ONLINE:
                return {
                    ...state,
                    users: state.users.map((user) =>
                    action.payload.includes(user._id)
                        ? { ...user, online: true }
                        : { ...user, online: false }
                    ),
                };
            case MESS_TYPES.MARK_MESSAGE_READ: 
                return {
                    ...state,
                    newMessages: {
                    ...state.newMessages,
                    [action.payload]: false,
                    },
                }
        default:
            return state;
    }
};

export default messageReducer;