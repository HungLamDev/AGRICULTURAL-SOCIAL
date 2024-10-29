import React, { useState } from 'react';
import UserCard from '../UserCard';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../redux/actions/messageAction';

const LeftSide = () => {
    const { auth, message } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchUsers, setSearchUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loadData, setLoadData] = useState(false); 

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!search.trim()) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { err: "Vui lòng nhập từ khóa tìm kiếm!" },
            });
            return;
        }

        try {
            setLoadData(true);
            const res = await getDataAPI(`search?search=${search}`, auth);
            const result = res.data;

            if (result.users.length === 0 && result.posts.length === 0) {
                dispatch({
                    type: GLOBALTYPES.ALERT,
                    payload: { err: "Không tìm thấy!" },
                });
            } else {
                setSearchUsers(result.users);
            }
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { err: err.response?.statusText || "Đã xảy ra lỗi!" },
            });
        } finally {
            setLoadData(false);
        }
    };

    const handleAddUser = (user) => {
        setSearch('');
        setSearchUsers([]);
        dispatch(addUser({ user, message })); 
        return navigate(`/message/${user._id}`)
    };

    return (
        <>
            <form className="message_header_search" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={search}
                    placeholder="Tìm kiếm ..."
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" style={{ display: 'none' }}>
                    Tìm
                </button>
            </form>
            <div className='message_list'>
                {searchUsers.length != 0 ? 
                searchUsers.map(user => (
                    <div key={user._id} className='message_user' onClick={() => handleAddUser(user)}>
                        <UserCard user={user} />
                    </div>
                ))
                : <>
                {
                    message.users.map(user => (
                        <div key={user._id} className='message_user' onClick={() => handleAddUser(user)}>
                            <UserCard user={user} >
                                <i className="fa-solid fa-user-group text-success active" style={{ marginLeft: "auto", paddingRight: "10px", opacity: "0.5" }}></i>
                            </UserCard>
                        </div>
                    ))
                    
                }
                </>
            }
            </div>
        </>
    );
};

export default LeftSide;