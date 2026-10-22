
import { useEffect, useState } from "react";

import {
  useParams,
  useLocation,
  Link as RouterLink,
} from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { PageContainer } from "../../components/ui";
import { getModule } from "../../api/modules";

import "./ModulesPage.css";

function ModuleDetailsPage() {
  const { moduleId } = useParams();
  const location = useLocation();

  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Determine where Back to Modules should lead
  const basePath = location.pathname.startsWith("/user/modules")
    ? "/user/modules"
    : "/modules";

  // Fetch the selected module from Django
  useEffect(() => {
    let active = true;

    const loadModule = async () => {
      setLoading(true);
      setError("");
      setSelectedModule(null);

      try {
        const data = await getModule(moduleId);

        if (active) {
          setSelectedModule(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load module");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadModule();

    return () => {
      active = false;
    };
  }, [moduleId]);

  // Loading screen
  if (loading) {
    return (
      <Box className="modules-page">
        <PageContainer maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        </PageContainer>
      </Box>
    );
  }

  // Error or missing module
  if (error || !selectedModule) {
    return (
      <Box className="modules-page">
        <PageContainer maxWidth="lg">

          <Stack spacing={3}>
            <Alert severity="error">
              {error || "Module not found"}
            </Alert>

            <Button
              component={RouterLink}
              to={basePath}
              startIcon={<ArrowBackIcon />}
            >
              Back to Modules
            </Button>
          </Stack>

        </PageContainer>
      </Box>
    );
  }

  // Sort backend sections by their order
  const sections = Array.isArray(selectedModule.sections)
    ? [...selectedModule.sections].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      )
    : [];

  return (
    <Box className="modules-page">
      <PageContainer maxWidth="lg">

        {/* Back to module grid */}
        <Button
          component={RouterLink}
          to={basePath}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 3,
            textTransform: "none",
          }}
        >
          Back to Modules
        </Button>

        {/* Module header */}
        <Box className="modules-banner">
          <Typography variant="h1">
            {selectedModule.title}
          </Typography>

          <Typography variant="body1">
            {selectedModule.summary ||
              selectedModule.description ||
              "Cybersecurity training module"}
          </Typography>
        </Box>

        {/* Section heading */}
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          Learning Sections
        </Typography>

        {/* Section container */}
        <Paper
          className="module-detail-card"
          elevation={0}
        >

          {sections.length === 0 ? (
            <Typography color="text.secondary">
              No sections are currently available
              for this module.
            </Typography>
          ) : (
            <Stack spacing={2}>

              {sections.map((section, index) => (
                <Accordion
                  key={section.id}
                  className="module-detail-layer"
                  elevation={0}
                  disableGutters
                >

                  {/* Section title */}
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        Section {index + 1}: {section.title}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  {/* Section learning content */}
                  <AccordionDetails>
                    <Box className="module-lesson-row">
                      <MenuBookIcon
                        fontSize="small"
                        color="primary"
                        sx={{
                          flexShrink: 0,
                          alignSelf: "flex-start",
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.8,
                        }}
                      >
                        {section.body ||
                          "No content has been added to this section yet."}
                      </Typography>
                    </Box>
                  </AccordionDetails>

                </Accordion>
              ))}

            </Stack>
          )}

        </Paper>

      </PageContainer>
    </Box>
  );
}

export default ModuleDetailsPage;
