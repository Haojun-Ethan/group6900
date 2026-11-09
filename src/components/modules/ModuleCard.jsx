import { Box, Paper, Stack, Typography,Chip , Icon } from "@mui/material";

import { useNavigate } from "react-router-dom";

function ModuleCard({ module }) {

    const navigate = useNavigate();

const statusColor = module.status === 'PUBLISHED' ? 'success' : module.status === 'DRAFT' ? 'warning' : 'default';

return (
      <Paper
          elevation={0}
          onClick = { () => navigate(`/modules/${module.id}`)}
          sx={{
              p: { xs:2.5, sm:3},
              height: '100%',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',    //Correct the layout direction
              transition: 'all 0.2s',
              overflow: 'hidden', 
              '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)',
              },
          }}
      >
      {/* Top Row, status & category */} 
        <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label={module.status}
            color={statusColor}
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
          />
          {module.category && (
            <Chip
              label={module.category}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Stack>

      {/* Title */} 
      <Typography variant="h3" sx={{ mb:1.5, fontWeight:600, lineHeight:1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-all' }}> {module.title} </Typography>

      {/* Summary */} 
      <Typography variant="body2" color="text.secondary" sx={{mb:2, flexGrow:1, display: '-webkit-box', WebkitLineClamp:3, webkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight:1.6}}>        
        {module.summary}
      </Typography>

      {/* Meta   */} 
      <Stack direction="row" spacing={2} sx={{ mt: 'auto',  pt:2, borderTop: '1px solid #eee' }}>
          {module.estimated_minutes && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap:0.5}}>
                  <Icon.School fontSize="small" sx={{ color: 'text.disabled', fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                      {module.estimated_minutes} min
                  </Typography>
              </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap:0.5}}>
              <Typography variant="caption" color="text.secondary">
                  Pass: {module.pass_mark != null ? `${module.pass_mark}%` : 'N/A'}
              </Typography>
          </Box>
      </Stack>
      </Paper>
    );
  }

export default ModuleCard;
        

