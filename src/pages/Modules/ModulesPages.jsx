
import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  useLocation,
} from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { PageContainer } from "../../components/ui";
import { getModules, getEnrollments } from "../../api/modules";

import "./ModulesPage.css";

function ModulesPage() {
  const location = useLocation();
 
  const isMyModules = location.pathname.startsWith("/user/modules");

  const basePath = isMyModules ? "/user/modules" : "/modules";

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  
  useEffect(() => {
    let active = true;

    const loadModules = async () => {
      setLoading(true);
      setError("");

      try {
        const allModules = await getModules();

        let visibleModules = allModules;


        if (isMyModules) {
          const enrollments = await getEnrollments();

          const enrolledIds = new Set(
            enrollments.map((enrollment) =>
              Number(enrollment.module)
            )
          );

          visibleModules = allModules.filter((module) =>
            enrolledIds.has(Number(module.id))
          );
        }

        if (active) {
          setModules(visibleModules);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load modules");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadModules();

    return () => {
      active = false;
    };
  }, [isMyModules]);

  return (
    <Box className="modules-page">
      <PageContainer maxWidth="lg">

        <Button classname="back-button" component={RouterLink} to="/" startIcon={<ArrowBackIcon />}> 
          Back to Homepage
        </Button>

        <Box className="modules-banner">
          <Typography variant="h1">
            {isMyModules ? "My Modules" : "Browse Modules"}
          </Typography>

          <Typography variant="body1"> {isMyModules
              ? "Continue your enrolled cybersecurity training modules."
              : "Explore available cybersecurity training modules."}
          </Typography>
        </Box>

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (<Alert severity="error">
            {error}
          </Alert>
        )}

        {!loading && !error && modules.length === 0 && (
          <Alert severity="info">
            {isMyModules
              ? "You are not enrolled in any available modules yet."
              : "No training modules are currently available."}
          </Alert>
        )} {!loading && !error && modules.length > 0 && (
          <Box className="modules-grid">

            {modules.map((module) => (
              <Paper
                key={module.id}
                component={RouterLink}
                to={`${basePath}/${module.id}`}
                className="module-overview-card"
                elevation={0}>

                <Box className="module-card-top">
                  <Box className="module-overview-icon">
                    <SchoolIcon />
                  </Box>

                  <Chip
                    label={`${module.sections?.length ?? 0} Sections`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={600}>
                  {module.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="module-description">
                  {module.summary || module.description || "Explore this cybersecurity training module."}
                </Typography>


                <Box className="module-view-link">
                  <Typography variant="body2" fontWeight={600}>
                    View Module
                  </Typography>
                  <ArrowForwardIcon fontSize="small" />
                </Box>

              </Paper>
            ))}

          </Box>
        )}

      </PageContainer>
    </Box>
  );
}

export default ModulesPage;
