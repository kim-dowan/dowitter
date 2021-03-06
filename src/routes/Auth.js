import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";


const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
      const {
        target: { name, value },
      } = event;
      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    };
    const onSubmit = async (event) => {
      event.preventDefault();
      try {
        if (newAccount) {
          await authService.createUserWithEmailAndPassword(email, password);
        } else {
          await authService.signInWithEmailAndPassword(email, password);
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
    const toggleAccount = () => setNewAccount((prev) => !prev);
    
    const onGoogleLogin = async ()=> {
      const provider = new firebaseInstance.auth.GoogleAuthProvider();
      const data = await authService.signInWithPopup(provider);
      console.log(data);
    }
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
          <input
            type="submit"
            value={newAccount ? "Create Account" : "Sign In"}
          />
          {error}
        </form>
        <span onClick={toggleAccount}>
          {newAccount ? "Sign In" : "Create Account"}
        </span>
        <div>
          <button onClick={onGoogleLogin}>Continue with Google</button>
        </div>
      </div>
    );
  };
  export default Auth;