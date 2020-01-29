import React, { Fragment } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import useForm from "./useForm";
import validate from "./validation";
import Button from '@material-ui/core/Button';

import AnatokenABI from "../../contracts/AnaToken.json";

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
  const [role, setRoles] = React.useState('sp');
  const {
    values,
    handleChange,
    handleSubmit,
    errors
  } = useForm(submit, validate, role);

  useEffect(() => {
    // Check if address exists in contract

    
  });

  const selectChange = event => {
    setRoles(event.target.value);
  };

  function submit() {

  }

  function renderRightView() {
    switch (role) {
      case "sp": return (
        <TextField 
          id="outlined-basic" 
          label="Service name" 
          variant="outlined" 
          error={errors.serviceNameError}
          value={values.serviceName || ""}
          name="serviceName"
          onChange={handleChange}
        />
      );
      default: return <p>Error</p>
    }
  }

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={classes.root}>
              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                value={role}
                onChange={selectChange}
                helperText="Please select your role"
                variant="outlined"
              >
              {roles.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              </TextField>
              {renderRightView()}
              <br />
              <Button variant="contained" color="primary" onClick={() => handleSubmit()} className={classes.button}>
                Register
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Register;