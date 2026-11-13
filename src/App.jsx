// src/App.jsx

import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import AppRouter from "./routes/AppRouter";


function App () {
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {

    const handleWakingUp = () => setIsWakingUp(true);
    
    window.addEventListener('server-waking-up', handleWakingUp);
    
    return () => {
      window.removeEventListener('server-waking-up', handleWakingUp);
    };
  }, []);

  return (
    <> 
      <AppRouter />
      <Snackbar  open={isWakingUp}  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setIsWakingUp(false)} >

        <Alert  severity="info"  variant="filled" onClose={ ( ) => setIsWakingUp(false)} sx={{ width: '100%', boxShadow: 3 }}  color='#c9f01b'>
          Server is waking up (onrender, free tier, 30~60 seconds ). Please wait...
        </Alert>
      </Snackbar>
    </>
  );

}


export default App;