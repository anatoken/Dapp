import React, { Fragment, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import useForm from "./useForm";
import validate from "./validation";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Person, School, Business } from '@material-ui/icons';
import Loader from "../../components/Loader";
import Web3Context from "../../utils/Web3Context";
import history from "../../utils/history";
import RBACExtendABI from "../../contracts/RBACExtend.json";
import { useGlobal } from "reactn";


const roles = [
  {
    value: 'sp',
    label: 'Service Provider',
  },
  {
    value: 'cl',
    label: 'Collector',
  },
  {
    value: 'rp',
    label: 'Recycle plant',
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  paper: {
    height: 100,
    width: 120,
    textAlign: 'center',
  },
  marginAutoContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
  },
  marginAutoItem: {
    margin: 'auto',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    }
  },
  button: {
    marginTop: 20
  }
}));

const Register = props => {
  const classes = useStyles();
  const web3 = React.useContext(Web3Context);
  const [isLoading, setLoading] = React.useState(true);
  const [contract, setContract] = React.useState("");
  const [global, setGlobal] = useGlobal();

  const loadContract = async (web3) => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedContract = RBACExtendABI.networks[networkId];
      const instance = new web3.eth.Contract(
        RBACExtendABI.abi,
        deployedContract && deployedContract.address,
      );

      setContract(instance);

      await checkRole(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load contract. Check console for details.`,
      );

      console.error(error);
    }
  }

  const checkRole = async (instance) => {
    if (await instance.methods.userHasRole("collector").call()) {
      // redirect to collector
      console.log("is collector");
      setGlobal({ role: "collector" });
      return history.push("/role");
    }

    if (await instance.methods.userHasRole("university").call()) {
      // redirect to University
      console.log("is University");
      setGlobal({ role: "university" });
      return history.push("/role");
    }

    if (await instance.methods.userHasRole("recyclePlant").call()) {
      // redirect to recylceplant
      console.log("is recycle plant");
      setGlobal({ role: "recyclePlant" });
      console.log(`ROLE: ${global.role}`);
      return history.push("/role");
    }

    console.log(`ROLE: ${global.role}`);
    setLoading(false);
  }

  useEffect(() => {
    setGlobal({
      role: ""
    })
    if (Object.entries(web3).length != 0 && contract == "") {
      loadContract(web3);
    }
  });

  const setRole = async (role) => {
    setLoading(true);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0])
    const hasRole = await contract.methods.addUserToRole(accounts[0], role).send({ from: accounts[0] });

    if (hasRole) {
      return history.push(`/${role}`);
    }
  }

  if (isLoading) {
    return <Loader position="absolute" />;
  }

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom className={classes.text}>
              What's your role?
            </Typography>
            <div className={classes.root}>
              <Grid container justify="center" spacing={3}>
                <Grid item>
                  <Paper className={classes.paper} onClick={() => setRole("collector")}>
                    <Person />
                    Collector
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.paper} onClick={() => setRole("recyclePlant")}>
                    <Business />
                    Recycler
                  </Paper>
                </Grid>
                <Grid item>
                  <Paper className={classes.paper} onClick={() => setRole("university")}>
                    <School />
                    University
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Register;