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

  return (
    <div>
      <StoreProvider>
        <GoogleFonts href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <Header />
        <Navbar ISstudent={isstudent} />
        <Component ISstudent={isstudent} SetIsStudent={setisstudent} {...pageProps} />
      </StoreProvider>
    </div>

  )
};

