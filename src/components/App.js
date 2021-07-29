import React, {useEffect, useState} from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        if (user.displayName == null) {
          await user.updateProfile({
            displayName: user.email.split("@")[0],
            photoURL: "",
          })
        }
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Dowitter</footer>
    </>
  );
}

export default App;
