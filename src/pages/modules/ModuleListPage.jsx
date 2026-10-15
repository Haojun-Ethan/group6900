import {useState, useEffect} from 'react';
import { Grid, Box, Typography, Alert, Skeleton } from "@mui/material";

//import * as modulesApi from '../../api/modules';
//import { PageContainer, PageTitle } from '../../components/common/PageLayout';
import { PageContainer,PageTitle } from '../../components/ui';
   
import ModuleCard from '../../components/modules/ModuleCard';
import { MOCK_QUIZ_QUESTIONS } from '../quizzes/_mockQuizData';
//import { MOCK_MODULES } from './mockData';
import { MOCK_MODULES } from './_mockData';


/**
 * Demo state. Delete this when API is ready.
 */

const DEMO_STATE = 'loading'; // 'normal' | 'loading' | 'empty' | 'error'

function ModuleListPage() {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ★ TODO:  API ---Switch to a real API call

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');

      try {

        // future：const data = await modulesApi.listModules();
        const data = await new Promise((resolve) => {
          setTimeout(() => resolve(MOCK_QUIZ_QUESTIONS) , 400); // simulate network delay
        });

        setModules(data);
      } catch (err) {
        setError(err.message || 'Failed to load modules');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ★ DEMO_STATE 
  const effectiveLoading = DEMO_STATE === 'loading' ? true : isLoading;
  const effectiveError = DEMO_STATE === 'error' ? 'Failed to load modules (demo)' : error;
  const effectiveModules = DEMO_STATE === 'empty' ? [] : modules;

  // ===== Render  =====

  if (effectiveLoading) {
    return (
      <PageContainer maxWidth="lg">
        <PageTitle title="Modules" subtitle="Browse available training modules." />
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {[1, 2, 3].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              {/*  Skeleton */}
              {/*  MUI handbook - Skeleton */}
              {/* https://mui.com/material-ui/react-skeleton/ */}
              <Skeleton variant="rounded" height={200} />
            </Grid>
          ))}
        </Grid>
      </PageContainer>
    );
  }

  if (effectiveError) {
    return (
      <PageContainer maxWidth="lg"> // PageContainer is a custom component that wraps the content and provides consistent padding and maxWidth
        <PageTitle title="Modules" />
        <Alert severity="error">{effectiveError}</Alert>
      </PageContainer>
    );
  }

  if (effectiveModules.length === 0) {
    return (
      <PageContainer maxWidth="lg"> // PageContainer is a custom component that wraps the content and provides consistent padding and maxWidth
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
        subtitle={`${effectiveModules.length} available module${effectiveModules.length === 1 ? '' : 's'}`}
      />
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {effectiveModules.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <ModuleCard module={m} />
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}

export default ModuleListPage;