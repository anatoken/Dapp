import React, { Fragment, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
  button: {
    height: 80,
    width: 90,
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#3f51b5',
    color: '#fff'
  },
  label: {
    display: 'block',
    fontSize: 11,
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
        <Typography variant="h4" gutterBottom className={classes.text}>
          What's your role?
        </Typography>
        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={2}
          style={{
            height: '90vh'
          }}>

          <Grid item sm={4}>
            <Button variant="contained" color="primary" classes={{ root: classes.button, label: classes.label }} onClick={() => setRole("collector")}>
              <Person style={{ width: '100%', fontSize: 40, color: '#fff' }} />
              Collector
            </Button>
          </Grid>
          <Grid item sm={4}>
            <Button variant="contained" color="primary" classes={{ root: classes.button, label: classes.label }} onClick={() => setRole("recyclePlant")}>
              <Business style={{ width: '100%', fontSize: 40, color: '#fff' }} />
              Recycler
            </Button>
          </Grid>
          <Grid item sm={4}>
            <Button variant="contained" color="primary" classes={{ root: classes.button, label: classes.label }} onClick={() => setRole("university")}>
              <School style={{ width: '100%', fontSize: 40, color: '#fff' }} />
              University
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Fragment >
  );
};

export default Register;