
import { useEffect, useState } from "react";
import {
  Link as RouterLink,
  useLocation,
} from "react-router-dom";

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

  // Check whether user selected Browse Modules or My Modules
  const isMyModules = location.pathname.startsWith("/user/modules");

  const basePath = isMyModules
    ? "/user/modules"
    : "/modules";

  // Backend module data
  const [modules, setModules] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch modules when page loads
  useEffect(() => {
    let active = true;

    const loadModules = async () => {
      setLoading(true);
      setError("");

      try {
        const allModules = await getModules();

        let visibleModules = allModules;

        // My Modules displays only enrolled modules
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

        {/* Main header */}
        <Box className="modules-banner">
          <Typography variant="h1">
            {isMyModules ? "My Modules" : "Browse Modules"}
          </Typography>

          <Typography variant="body1">
            {isMyModules
              ? "Continue your enrolled cybersecurity training modules."
              : "Explore available cybersecurity training modules."}
          </Typography>
        </Box>

        {/* Loading state */}
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

        {/* Error state */}
        {!loading && error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/* No modules available */}
        {!loading && !error && modules.length === 0 && (
          <Alert severity="info">
            {isMyModules
              ? "You are not enrolled in any available modules yet."
              : "No training modules are currently available."}
          </Alert>
        )}

        {/* Module grid */}
        {!loading && !error && modules.length > 0 && (
          <Box className="modules-grid">

            {modules.map((module) => (
              <Paper
                key={module.id}
                component={RouterLink}
                to={`${basePath}/${module.id}`}
                className="module-overview-card"
                elevation={0}
              >

                {/* Icon and section count */}
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

                {/* Module name */}
                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  {module.title}
                </Typography>

                {/* Module description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="module-description"
                >
                  {module.summary ||
                    module.description ||
                    "Explore this cybersecurity training module."}
                </Typography>

                {/* View module */}
                <Box className="module-view-link">
                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
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
