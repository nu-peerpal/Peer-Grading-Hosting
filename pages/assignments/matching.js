import React from "react";
import styles from "./matching.module.css";
import Container from "../../components/container";
import Tree from "../../components/tree";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { Field, Formik, Form } from "formik";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Pray from "../../components/autocomplete";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class Matching extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const ds = {
      114: [11, 12, 15, 2],
      120: [11, 18],
      118: [12, 16],
      115: [13, 17, 18, 19, 1],
      119: [13, 17],
      113: [14],
      117: [14, 16, 20, 3],
      111: [15],
      116: [19],
      112: [20],
    };
    //const ds = {114: [11, 12, 15, 2], 120: [11, 18], 118: [12, 16], 115: [13, 17, 18, 19, 1], 119: [13, 17], 113: [14], 117: [14, 16, 20, 3], 111: [15], 116: [19], 112: [20]}
    return (
      <div className="Content">
        <Container>
          <Accordion className={styles.matching}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Settings
            </AccordionSummary>
            <AccordionDetails>
              <Settings />
            </AccordionDetails>
          </Accordion>
          <Tree response={ds} />
        </Container>
      </div>
    );
  }
}

export default Matching;

function Settings() {
  return (
    <Formik
      initialValues={{ PeerLoad: "", GraderLoad: "", TA: [] }}
      onSubmit={(data, { setSubmitting }) => {
        setSubmitting(true);
        console.log(data);
        setSubmitting(false);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <Field
            name="PeerLoad"
            type="input"
            value={values.PeerLoad}
            id="outlined-basic"
            label="Peer Load"
            variant="outlined"
            required={true}
            as={TextField}
            className={styles.pms}
          />
          <Field
            name="GraderLoad"
            type="input"
            value={values.GraderLoad}
            id="outlined-basic"
            label="Grader Load"
            variant="outlined"
            required={true}
            as={TextField}
            className={styles.pms}
          />
          <Field
            name="TA"
            className={styles.pms}
            component={Pray}
            // as={Autocomplete}
            required={true}
            // value={values.TA}
            label="TA"
          />
          <Button disabled={isSubmitting} type="submit">
            Save
          </Button>
          <Button>Recompute Matching</Button>
          <Button>Clear</Button>
        </Form>
      )}
    </Formik>
  );
}

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  { title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];
