import "./App.css";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import app from "./firebase.init";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
function App() {
  const [registred, setRegistred] = useState(false);
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // google sign in click event handler
  const googleSignInHandler = () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      setUser(user);
    });
  };

  const googleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser("");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  // email
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  const checkedLogin = (event) => {
    setRegistred(event.target.checked);
  };

  const onSubmitHandler = (event) => {
    console.log('test');
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    if(registred){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    }else {
      
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setEmail("");
        setPassword("");
        verifyEmail();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    }
    
  };
  const resetPasswordHandler = ()=>{
    sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('Password reset email sent!');
    })
  }

  const verifyEmail = ()=> {
    console.log('gese email')
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('email sent');
      })
  }

  return (
    <div className="App">
      {user.uid ? (
        <button onClick={googleSignOut}>Google sign Out</button>
      ) : (
        <button onClick={googleSignInHandler}>Google sign In</button>
      )}

      {/* <div className="card">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" />
        ) : (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
            alt=""
          />
        )}

        <div>
          <h4>Name : {user.displayName}</h4>
          <p>Email : {user.email}</p>
        </div>
      </div> */}
      <Container>
        <Row>
          <Col lg={4} className="mx-auto">
            <h2>Please {registred ? "login" : "registrer"} !!</h2>
            <Form noValidate validated={validated} onSubmit={onSubmitHandler}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  onBlur={emailHandler}
                  placeholder="Enter email"
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="off"
                  onBlur={passwordHandler}
                  placeholder="Password"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Invalid password
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" onChange={checkedLogin} label="Check me out" />
              </Form.Group>
              <Button onClick={resetPasswordHandler} variant="link">Forgot password ?</Button>
              <Button variant="primary" type="submit">
                {
                  registred ? "login" : "registrer"
                }
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
