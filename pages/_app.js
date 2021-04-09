import './styles.css'
import React, { useState, useEffect } from 'react';
import Header from '../components/header'
import Navbar from '../components/navbar'
import GoogleFonts from "next-google-fonts";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Styles from './toggle.module.css'
import { StoreProvider } from "../components/store";
import Cookies from 'js-cookie';

import utilities from '../global_styles/utilities.scss';

export default function MyApp({ Component, pageProps }) {
  const [isstudent, setisstudent] = useState(true);
  useEffect(() => {
    if (Cookies.get('userData')) {
      const userData = JSON.parse(Cookies.get('userData'));
      // console.log('appjs user data: ', userData);
      if (userData.ta || userData.instructor) {
        setisstudent(false);
      }
    }
  }, [])

  // console.log(pageProps);
  const handleUser = (event, view) => {
    
    if (view === 'prof/ta') {
      setisstudent(false)
    }
    else {
      setisstudent(true)
    }
  };

  function UserView(){
    return(
      <StoreProvider>
      <ToggleButtonGroup exclusive onChange={handleUser} aria-label="State" className={Styles.tog}>
        <ToggleButton value="student" aria-label="student">
          Student
        </ToggleButton>
        <ToggleButton value="prof/ta" aria-label="prof/ta">
          Prof/TA
        </ToggleButton>
      </ToggleButtonGroup>
      </StoreProvider>
    )
  }

  return (
    <div>
      <StoreProvider>
        <GoogleFonts href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        {/* <div style={userId == 10 ? {border:"5px solid red", width: "100%", height: "95vh"} : null}> */}
        <Header />
        <UserView/>
        <Navbar ISstudent={isstudent} />
        <Component ISstudent={isstudent} SetIsStudent={setisstudent} {...pageProps} />
        {/* </div> */}
      </StoreProvider>
    </div>

  )
};

