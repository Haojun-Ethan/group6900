import {useState, useEffect} from 'react';
import { Grid, Box, Typography, Alert, Skeleton } from "@mui/material";

import * as modulesApi from '../../api/modules';
//import { PageContainer, PageTitle } from '../../components/common/PageLayout';
import { PageContainer,PageTitle } from '../../components/ui';
   
import ModuleCard from '../../components/modules/ModuleCard';


function ModuleListPage() {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  //  TODO:  API ---Switch to a real API call

  useEffect(() => {

    let ignore = false;

    const load = async () => {
      setIsLoading(true);
      setError('');

      try {



        const data = await modulesApi.listModules();
        if(!ignore){
          setModules(Array.isArray(data) ? data:[]);
        }
      } catch (err) {
        if(!ignore){
        setError(err.message || 'Failed to load modules');
        }
      } finally {
        if (!ignore) {
         setIsLoading(false);
          }
      }
    };
    load();

    return() => {
      ignore=true;
    }
  }, []);

  // ======Load the skeleton screen status=====

  if (isLoading) {
    return (
      <PageContainer maxWidth='lg'>
        <PageTitle title='Modules' subtitle='Browse available training modules.' />
        <Grid container spacing={{xs:2, md:3}}>
          {[1, 2, 3, 4, 5, 6].map((n)=> (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
              <Skeleton variant='rounded' height={220} sx={{borderRadius:2}} />
            </Grid>
          ))}
        </Grid>
      </PageContainer>
    );
  }



  // ===== Render  =====


  if (error) { // PageContainer is a custom component that wraps the content and provides consistent padding and maxWidth
    return (
      <PageContainer maxWidth="lg"> 
        <PageTitle title="Modules" />
        <Alert severity="error">{error}</Alert>
      </PageContainer>
    );
  }

  if (modules.length === 0) { // PageContainer is a custom component that wraps the content and provides consistent padding and maxWidth
    return (
      <PageContainer maxWidth="lg"> 
        <PageTitle title="Modules" />
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <Typography variant="h3" gutterBottom>
            No modules yet
          </Typography>
          <Typography variant="body2">
            There are no published modules at the moment.
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg">
      <PageTitle
        title="Modules"
        subtitle={`${modules.length} available module${modules.length === 1 ? '' : 's'}`}
      />
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {modules.map((m) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.id}>
            <ModuleCard module={m} />
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}

export default ModuleListPage;