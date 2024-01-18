import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Home() {

  const [users, setUsers] = useState([]);

  const token = localStorage.getItem('token');

  tokenExpired(token);

  useEffect(() => {
    axios.get('https://symfony-instawish.formaterz.fr/api/users', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then((response) => {

      const res = Object.values(response.data);
      // console.log(res);
      setUsers(res);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  getPostFollow(token)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  })

  return (
    <div className='container d-flex justify-content-center mt-4'>
      <div className='col-md-auto col-md-6'>
        <div className='d-flex align-items-center justify-content-between mt-2 overflow-auto'>
          <div className="">
            <img src="img/profile.jpg" alt="profile" className="rounded-circle" />
            <div className="add">+</div>
          </div>
          {users.map((user, i) => (
            <div key={i} className="d-flex align-items-center justify-content-center">
              <a href={`user/${user.id}`}>
                <img src={"https://symfony-instawish.formaterz.fr" + user.imageUrl} alt={`Profil de ${user.username}`} className="rounded-circle" height={95} width={100} />
              </a>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <h3>marquee B</h3>
          <img src="img/post1.jpg" alt="post" />
            <div className="post-info">
              <div className="post-profile">
                <div className="post-img">
                  <img src="img/profile2.jpg" alt="profile" />
                </div>
                
              </div>
              <div className="likes">
                <i className="ri-heart-line"></i>
                <span>84.4k</span>
                <i className="ri-chat-3-line"></i>
                <span>88</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

const getPostFollow = async (token) => {
  try {
    const response = await axios.get('https://symfony-instawish.formaterz.fr/api/home', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    return response;
  } catch (error) {
    console.log(error.response.data);
  }
}

const tokenExpired = (token) => {
  const { exp } = jwtDecode(token);
  const expirationTime = (exp * 1000) - 60000;
  if (Date.now() >= expirationTime) {
      localStorage.clear();
      window.location.href = '/login';
  }
};

export default Home;