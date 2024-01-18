import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import { useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {

  const username = useRef(null);
  const password = useRef(null);

  const handleSubmit = () => {
    const data = {
      username: username.current.value,
      password: password.current.value
    };

    axios.post('https://symfony-instawish.formaterz.fr/api/login_check', data)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      window.location.href = "/home";
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <div className='container text-center d-flex justify-content-center mt-4'>
      <div className='col-md-auto col-md-8'>
        <div className="login-page">
          <div className="form">
            <form className="login-form">
              <input type="text" ref={username} placeholder="Identifiant" />
              <input type="password" ref={password} placeholder="Mot de passe" />
              <button type='button' onClick={handleSubmit}>Se connecter</button>
              <p className="message">Pas de compte ? <a href="register">S'inscrire !</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
