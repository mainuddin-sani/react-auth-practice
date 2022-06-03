import "./App.css";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
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
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
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

  const passwordHandler = (e)=>{
    setPassword(e.target.value);
  }
  console.log(email);
  const onSubmitHandler = (e)=> {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }
  return (
    <div className="App">
      {user.uid ? (
        <button onClick={googleSignOut}>Google sign Out</button>
      ) : (
        <button onClick={googleSignInHandler}>Google sign In</button>
      )}

      <div className="card">
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
      </div>
      <Container>
        <Row>
          <Col lg={4} className="mx-auto">
            <Form onClick={onSubmitHandler}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  onBlur={emailHandler}
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" onBlur={passwordHandler} placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
