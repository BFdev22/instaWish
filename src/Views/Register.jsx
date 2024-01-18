import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import '../App.css';
import { useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {

  const username = useRef(null);
  const password = useRef(null);
  const email = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = () => {
    console.log(selectedImage);
    const formData = new FormData();

    formData.append('username', username.current.value);
    formData.append('email', email.current.value);
    formData.append('password', password.current.value);
    formData.append('profilePicture', selectedImage);

    axios.post('https://symfony-instawish.formaterz.fr/api/register', formData)
    .then((response) => {
      window.location.href = '/login';
    })
    .catch((error) => {
      console.log(error.response.data);
    })
  }

  return (
    <div className='container text-center d-flex justify-content-center mt-4'>
      <div className='col-md-auto col-md-8'>
        <div className="login-page">
          <div className="form">
            <form className="login-form">
              <input type="text" ref={username} placeholder="Identifiant" />
              <input type="email" ref={email} placeholder="Email" />
              <input type="password" ref={password} placeholder="Mot de passe" />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button type='button' onClick={handleSubmit}>S'inscrire'</button>
              <p className="message">Déjà un compte ? <Link to="/login">Se connecter !</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
