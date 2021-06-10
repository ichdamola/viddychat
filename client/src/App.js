import React from 'react';
import { AppBar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

import Notifications from './Notifications';
import VideoPlayer from './VideoPlayer';
import Options from './Options';

const useStyles = makeStyles((theme) => ({
    appBar: {
      borderRadius: 15,
      margin: '30px 100px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '600px',
      border: '2px solid black',
  
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }));

const App = function(){
    const classes = useStyles();

    return(
        <div className={classes.wrapper}>
            <AppBar className={classes.appBar} position="static" color="inherit">
                <Typography variant="h2" align="center">Viddy Chat</Typography>
            </AppBar>
            <VideoPlayer />
            <Options>
                <Notifications />
            </Options>
           
        </div>
    )
};

export default App;