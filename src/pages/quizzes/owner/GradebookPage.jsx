import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Paper, Stack, Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Alert, Skeleton, TextField, MenuItem, Chip, Button,
} from '@mui/material';

import * as quizzesApi from '../../../api/quizzes';
import { PageContainer, PageTitle, EmptyState } from '../../../components/ui';
import ComplianceChip from '../../../components/modules/ComplianceChip';
import { COMPLIANCE_STATUS } from '../../../config/complianceStatus';

const formatScore = (score) => (score == null ? '—' : `${Math.round(Number(score))}%`);
const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '—');

/** Quote a value for CSV. */
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;


function GradebookPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const moduleFilter = searchParams.get('module') || 'all';
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const data = await quizzesApi.getGradebook();
        if (!ignore) setRows(data || []);
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load the gradebook');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    load();
    return () => { ignore = true; };
  }, []);

  const modules = useMemo(() => {
    const byId = new Map(rows.map((r) => [String(r.module), r.moduleTitle]));
    return [...byId].map(([id, title]) => ({ id, title })).sort((a, b) => a.title.localeCompare(b.title));
  }, [rows]);

  const inModule = rows.filter((r) => moduleFilter === 'all' || String(r.module) === moduleFilter);

  const visible = inModule.filter((r) =>
    (statusFilter === 'all' || r.status === statusFilter)
    && (!search.trim() || r.user.username.toLowerCase().includes(search.trim().toLowerCase()))
  );

  const counts = Object.fromEntries(
    Object.keys(COMPLIANCE_STATUS).map((s) => [s, inModule.filter((r) => r.status === s).length])
  );

  const setModuleFilter = (value) => {
    setSearchParams(value === 'all' ? {} : { module: value }, { replace: true });
  };

  const handleExport = () => {
    const header = ['Learner', 'Module', 'Status', 'Sections completed', 'Sections total', 'Attempts',
      'Best score', 'Latest score', 'Latest passed', 'Last passed', 'Due'];
    const lines = visible.map((r) => [
      r.user.username, r.moduleTitle, r.status, r.progress?.completed, r.progress?.total, r.attemptsCount,
      r.bestScore, r.latestScore, r.latestPassed == null ? '' : r.latestPassed ? 'yes' : 'no',
      r.lastPassedAt || '', r.dueAt || '',
    ].map(csvCell).join(','));

    const blob = new Blob([[header.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gradebook-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="lg">
        <PageTitle title="Gradebook" />
        <Skeleton variant="rounded" height={320} />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg">
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <PageTitle title="Gradebook" subtitle="Compliance and quiz results for learners in the modules you manage." />
          {visible.length > 0 && <Button variant="outlined" onClick={handleExport}>Export CSV</Button>}
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {!error && rows.length === 0 ? (
          <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <EmptyState
              title="No learners yet"
              subtitle="Learners appear here once they're enrolled in one of your modules."
            />
          </Paper>
        ) : (
          <>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(COMPLIANCE_STATUS).map(([status, { label, color }]) => (
                <Chip
                  key={status}
                  label={`${label}: ${counts[status]}`}
                  color={statusFilter === status ? color : 'default'}
                  variant={statusFilter === status ? 'filled' : 'outlined'}
                  onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                />
              ))}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select size="small" label="Module" value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)} sx={{ minWidth: 240 }}
              >
                <MenuItem value="all">All modules</MenuItem>
                {modules.map((m) => <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>)}
              </TextField>

              <TextField
                size="small" label="Search learner" value={search}
                onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 220 }}
              />
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Learner</TableCell>
                    <TableCell>Module</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Sections</TableCell>
                    <TableCell align="right">Attempts</TableCell>
                    <TableCell align="right">Best</TableCell>
                    <TableCell>Latest</TableCell>
                    <TableCell>Due</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visible.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.user.username}</TableCell>
                      <TableCell>{r.moduleTitle}</TableCell>
                      <TableCell><ComplianceChip status={r.status} /></TableCell>
                      <TableCell align="right">{r.progress ? `${r.progress.completed}/${r.progress.total}` : '—'}</TableCell>
                      <TableCell align="right">{r.attemptsCount}</TableCell>
                      <TableCell align="right">{formatScore(r.bestScore)}</TableCell>
                      <TableCell>
                        {r.latestAttemptId ? (
                          <Typography variant="body2" component="span" color={r.latestPassed ? 'success.main' : 'error.main'}>
                            {formatScore(r.latestScore)} {r.latestPassed ? 'pass' : 'fail'}
                          </Typography>
                        ) : '—'}
                      </TableCell>
                      <TableCell>{formatDate(r.dueAt)}</TableCell>
                      <TableCell align="right">
                        {r.latestAttemptId && (
                          <Button size="small" onClick={() => navigate(`/owner/attempts/${r.latestAttemptId}`)}>
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {visible.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No learners match these filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Stack>
    </PageContainer>
  );
}

export default GradebookPage;
