import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  text:{
    textAlign: 'center'
  }
});

function WelcomeTitel(props) {
  const classes = useStyles();

  return (
    <Fragment>
      <Typography variant="h2" gutterBottom className={classes.text}>
        {props.title}
      </Typography>
    </Fragment>
  );
}

export default WelcomeTitel;