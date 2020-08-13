import './styles.css'
import Header from '../components/header'
import Navbar from '../components/navbar'
import WorkingNav from '../components/workingnav'
import GoogleFonts from "next-google-fonts";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";


export default function MyApp({ Component, pageProps }) {
  var isstudent = true

  // const handleUser = (event, view) => {
  //   if (view === 'prof/ta') {
  //     isstudent = false
  //   }
  //   else {
  //     isstudent = true
  //   }
  //   console.log(isstudent);
  // };

  return (
    <div>
      <GoogleFonts href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <Header />
      {/* <ToggleButtonGroup exclusive onChange={handleUser} aria-label="State">
        <ToggleButton value="student" aria-label="student">
          Student
        </ToggleButton>
        <ToggleButton value="prof/ta" aria-label="prof/ta">
          Prof/TA
        </ToggleButton>
      </ToggleButtonGroup> */}
      <Navbar ISstudent={isstudent} />
      <Component ISstudent={isstudent} {...pageProps} />
      <WorkingNav ISstudent={isstudent} />
    </div>

  )
};

