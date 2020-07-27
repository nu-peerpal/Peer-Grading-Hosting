import './styles.css'
import Header from '../components/header'
import Navbar from '../components/navbar'
import WorkingNav from '../components/workingnav'
import GoogleFonts from "next-google-fonts";

export default function MyApp({ Component, pageProps }) {
  const student = true
  return (
    <div>
      <GoogleFonts href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
      <Header />
      <Navbar ISstudent={student}/>
      <Component ISstudent={student} {...pageProps} />
      <WorkingNav ISstudent={student}/>
    </div>

  )
}
