import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import '@fortawesome/fontawesome-free/css/all.css';
import API_URL from "../config";


function User() {
    const token = localStorage.getItem('token');

    tokenExpired(token);

    const idUser = useParams();

    const [userId, setUserId] = useState("");
    const [data, setData] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [textFollow, setTextFollow] = useState("");
    const [cart, setCart] = useState([]);
    const [heart, setHeart] = useState("");

    const comments = useRef(null);

    useEffect(() => {
        axios.get(`${API_URL}/api/home/${idUser.id}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then((response) => {
                const res = Object.values(response.data);
                setData(res);

                const fetch = async () => {
                    try {
                        const Me = await getMe(token);
                        const followersData = await getFollowers(token, idUser.id);
                        const followingData = await getFollowing(token, idUser.id);

                        setUserId(Me.id);
                        setFollowers(followersData);
                        setFollowing(followingData);

                        const isUserFollowed = followersData != null ? followersData.find((follower) => follower.id === Me.id) : null;
                        isUserFollowed ? setTextFollow("Suivi") : setTextFollow("Suivre");
                    } catch (error) {
                        console.error('Erreur lors de la récupération des followers :', error.response.data);
                    }
                };

                fetch();
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleClick = async (text) => {
        if (text == "Suivi") {
            const setUnfollow = await setUnfollows(token, idUser.id);
            setTextFollow("Suivre");
        } else {
            const setFollow = await setFollows(token, idUser.id);
            setTextFollow("Suivi");
        }
    }

    const handleLikeOrDislike = async (idPost) => {
        const like = await setLikeOrDislike(token, idPost);
        window.location.reload();
    }

    const handleSubmitComment = async (idPost, content) => {
        const data = {
            content: comments.current.value
        }
        
        axios.post(`${API_URL}/api/comment/add/${idPost}`, data, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            window.location.reload();
        })
        .catch((error) => {
            console.log(error.response.data);
        })
    }

    return (
        <div>
            <div className='container d-flex justify-content-center mt-4'>
                {data != null && data[0] != null ?
                    <div className='col-md-auto col-md-6'>
                        <header>
                            <div className="container">
                                <h1 className="col">{data[0].createdBy.username}</h1>
                            </div>
                            <hr />
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <img src={`${API_URL}/${data[0].createdBy.imageUrl}`} alt="profile" height={95} width={100} className="rounded-circle" />
                                    </div>
                                    <div className="col d-flex justify-content-between mt-3">
                                        <div className="">
                                            <div className="column text-center">
                                                <span className="h2">{data.length}</span>
                                                <p>posts</p>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="column text-center">
                                                <span className="h2">{followers.length}</span>
                                                <p>Followers</p>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="column text-center">
                                                <span className="h2">{following.length}</span>
                                                <p>Following</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-end justify-content-end">
                                        <button type="button" className="btn btn-primary col-6" onClick={() => { handleClick(textFollow) }}>{textFollow}</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <hr />
                            </div>
                        </header>
                        <main>
                            <div className="container mt-5">
                                <div className="gallery">
                                    {data.map((e, i) => (
                                        <div className="gallery-item" tabIndex="0" key={i}>
                                            <img src={`${API_URL}/${e.imageUrl}`} className="gallery-image" alt="" height={480} width={550} />
                                            <div className="row">
                                                <div className="col-2">
                                                    {e.likeds.find((element) => element.user.id == userId) != undefined ?
                                                        <div className="d-flex align-items-center">
                                                            <button type="button" className="btn" onClick={() => { handleLikeOrDislike(e.id) }}>
                                                                <i className="fa-solid fa-heart"></i>
                                                                {/* {heart} */}
                                                            </button>
                                                            <span>{e.likeds.length}</span>
                                                        </div>
                                                        :
                                                        <div className="d-flex align-items-center">
                                                            <button type="button" className="btn pr-3" onClick={() => { handleLikeOrDislike(e.id) }}>
                                                                <i className="fa-regular fa-heart"></i>
                                                                {/* {heart} */}
                                                            </button>
                                                            <span>{e.likeds.length}</span>
                                                        </div>
                                                    }
                                                </div>
                                                <div className="col-4">
                                                    <div className="d-flex align-items-center pl-10">
                                                        <button type="button" className="btn" data-bs-toggle="collapse" data-bs-target="#commentSpace" aria-expanded="false" aria-controls="collapseExample">
                                                            <i className="fa-regular fa-comment"></i>
                                                        </button>
                                                        <span>{e.comments.length}</span>
                                                    </div>
                                                </div>
                                                <div className="cart">
                                                    <ul>
                                                        {cart.map(item => <li key={item}>{item}</li>)}
                                                    </ul>
                                                </div>    
                                                <div className="collapse" id="commentSpace">
                                                    <div className="form-floating">
                                                        <div class="input-group">
                                                            <textarea className="form-control custom-control" ref={comments}></textarea>
                                                            <span className="input-group-addon btn btn-primary d-flex justify-content-center align-items-center" onClick={() => { handleSubmitComment(e.id) }}><i className="fa-solid fa-arrow-right"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </main>
                    </div>
                    :
                    <div className='col-md-auto col-md-6'>
                        <header>
                            <div className="container">
                                <div className="profile">
                                    <div className="profile-image">
                                        <img src="" alt="profile" height={95} width={100} className="rounded-circle" />
                                    </div>
                                    <div className="profile-user-settings">
                                        <h1 className="profile-user-name">{ }</h1>
                                        <button className="btn profile-edit-btn">Edit Profile</button>
                                        <button className="btn profile-settings-btn" aria-label="profile settings"><i className="fas fa-cog" aria-hidden="true"></i></button>
                                    </div>
                                    <div className="profile-stats">
                                        <ul>
                                            <li><span className="profile-stat-count"></span> posts</li>
                                            <li><span className="profile-stat-count"></span> followers</li>
                                            <li><span className="profile-stat-count"></span> following</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <main>
                            <div className="container">
                                <div className="gallery">
                                    Aucune publication
                                </div>
                            </div>
                        </main>
                    </div>
                }
            </div>
        </div>
    )

}

const tokenExpired = (token) => {
    const { exp } = jwtDecode(token);
    const expirationTime = (exp * 1000) - 60000;
    if (Date.now() >= expirationTime) {
        localStorage.clear();
        window.location.href = '/login';
    }
};

const getFollowers = async (token, idUser) => {
    try {
        const response = await axios.get(`${API_URL}/api/follow/followers/${idUser}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête API pour les followers :', error.response.data);
        throw error;
    }
};

const getFollowing = async (token, idUser) => {
    try {
        const response = await axios.get(`${API_URL}/api/follow/followings/${idUser}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête API pour les followers :', error.response.data);
        throw error;
    }
}

const getMe = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/me`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête API pour les followers :', error.response.data);
        throw error;
    }
}

const setFollows = async (token, userId) => {
    try {
        const response = await axios.post(`${API_URL}/api/follow/add/${userId} `, null, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête API pour les followers :', error.response.data);
        throw error;
    }
}

const setUnfollows = async (token, userId) => {
    try {
        const response = await axios.post(`${API_URL}/api/follow/remove/${userId} `, null, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête API pour les followers :', error.response.data);
        throw error;
    }
}

const setLikeOrDislike = async (token, idPost) => {
    try {
        const response = await axios.post(`${API_URL}/api/liked/${idPost}`, null, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête API pour les followers :', error.response.data);
        throw error;
    }
}

export default User;