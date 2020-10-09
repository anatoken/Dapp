import React, { Fragment, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useGlobal } from "reactn";
import Balance from '../../components/Balance';
import Modal from "../../components/transferModal";
import Web3Context from "../../utils/Web3Context";

const useStyles = makeStyles(theme => ({
  button: {
    borderRadius: 30,
    margin: 5
  }
}));

const RecyclePlant = () => {
  const [global, setGlobal] = useGlobal();
  const web3 = React.useContext(Web3Context);
  const [open, setOpen] = React.useState(false);
  const [soort, setSoort] = React.useState(false);
  const [imgAddress, setImgAddress] = React.useState("");
  const setUserAddress = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    setImgAddress(`https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${accounts[0]}&choe=UTF-8`);
  }
  const handleOpen = soort => {
    setSoort(soort);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   if (!global.role) {
  //     history.push("/register");
  //   }
  // }, []);

  useEffect(() => {
    if (Object.entries(web3).length != 0) {
      setUserAddress(web3);
    }
  }, [open, web3]);



  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center">
          <p>Role: {global.role}</p>
          <Balance />
          <div className={classes.buttons}>
            <Button variant="contained" color="primary" onClick={() => handleOpen("transfer")} className={classes.button}>
              Transfer
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleOpen("QR")} className={classes.button}>
              Receive
            </Button>
          </div>
          <Modal open={open} handleClose={handleClose} soort={soort} imgAddress={imgAddress} />
        </Grid>
      </Container>
    </Fragment>
  );
}
export default RecyclePlant;