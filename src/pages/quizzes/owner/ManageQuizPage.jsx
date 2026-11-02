import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Paper, Stack, Box, Typography, IconButton, Button, Radio, Checkbox, Alert, Chip } from '@mui/material';
import * as modulesApi from '../../../api/modules';
import apiClient from '../../../api/client';
import { PageContainer, ActionButton, Icon, FormField } from '../../../components/ui';

const generateId = () => Math.random().toString(36).substring(2, 10);

function ManageQuizPage() {
  const { id: moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const moduleData = await modulesApi.getModule(moduleId);
        
        let existingQuestions = [];
        try {
          const res = await apiClient.get(`/modules/${moduleId}/questions/`);
          existingQuestions = res || [];
        } catch {
          console.log('There is no question data yet for this module, starting fresh.');
        }

        if (!ignore) {
          setModule(moduleData);
          const formattedQs = existingQuestions.map((q) => ({
            ...q,
            choices: q.choices || [],
          }));
          setQuestions(formattedQs);
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load module or questions');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [moduleId]);


  const handleAddQuestion = () => {
    const newQ = {
      id: generateId(),
      text: '',
      question_type: 'SINGLE',
      points: 1,
      order: questions.length + 1,
      explanation: '',
      choices: [
        { id: generateId(), text: '', is_correct: true, order: 1 },
        { id: generateId(), text: '', is_correct: false, order: 2 },
      ],
    };
    setQuestions([...questions, newQ]);
  };


  const handleRemoveQuestion = async (qIndex) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    const targetQ = questions[qIndex];

    if (targetQ && typeof targetQ.id === 'number') {
      try {
        await apiClient.delete(`/questions/${targetQ.id}/`);
      } catch (err) {
        setError(err.message || 'Failed to delete question from server');
        return;
      }
    }

    const newQs = [...questions];
    newQs.splice(qIndex, 1);
    setQuestions(newQs);
  };


  const updateQuestion = (qIndex, field, value) => {
    const newQs = [...questions];
    newQs[qIndex] = { ...newQs[qIndex], [field]: value };
    setQuestions(newQs);
  };


  const handleAddChoice = (qIndex) => {
    const newQs = [...questions];
    newQs[qIndex].choices.push({
      id: generateId(),
      text: '',
      is_correct: false,
      order: newQs[qIndex].choices.length + 1,
    });
    setQuestions(newQs);
  };


  const handleRemoveChoice = async (qIndex, cIndex) => {
    const targetChoice = questions[qIndex]?.choices?.[cIndex];

    if (targetChoice && typeof targetChoice.id === 'number') {
      try {
        await apiClient.delete(`/choices/${targetChoice.id}/`);
      } catch (err) {
        setError(err.message || 'Failed to delete option from server');
        return;
      }
    }

    const newQs = [...questions];
    newQs[qIndex].choices.splice(cIndex, 1);
    setQuestions(newQs);
  };


  const updateChoice = (qIndex, cIndex, field, value) => {
    const newQs = [...questions];
    const isSingle = newQs[qIndex].question_type === 'SINGLE';

    const newChoices = newQs[qIndex].choices.map((choice, index) => {
      if (field === 'is_correct' && isSingle) {
        return { ...choice, is_correct: index === cIndex };
      }
      if (index === cIndex) {
        return { ...choice, [field]: value };
      }
      return choice;
    });

    newQs[qIndex].choices = newChoices;
    setQuestions(newQs);
  };

  const handleSaveAll = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.text.trim()) throw new Error(`Question ${i + 1} is missing question text.`);
        if (!q.choices || q.choices.length === 0) throw new Error(`Question ${i + 1} must contain options.`);
        if (!q.choices.some((c) => c.is_correct)) throw new Error(`Question ${i + 1} does not have a correct answer selected.`);
        if (q.choices.some((c) => !c.text.trim())) throw new Error(`Question ${i + 1} has an empty option description.`);
      }


      const existingRemoteQuestions = await apiClient.get(`/modules/${moduleId}/questions/`);
      if (Array.isArray(existingRemoteQuestions)) {
        for (const eq of existingRemoteQuestions) {
          await apiClient.delete(`/questions/${eq.id}/`);
        }
      }


      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qPayload = {
          module: Number(moduleId),
          text: q.text,
          question_type: q.question_type,
          explanation: q.explanation || '',
          points: Number(q.points) || 1,
          order: i + 1,
          is_active: true, 
        };

        const createdQ = await apiClient.post('/questions/', qPayload);
        const questionId = createdQ?.id;

        if (!questionId) {
          throw new Error('Failed to obtain Question ID from server.');
        }


        for (let j = 0; j < q.choices.length; j++) {
          const c = q.choices[j];
          await apiClient.post('/choices/', {
            question: questionId,
            text: c.text,
            is_correct: Boolean(c.is_correct),
            order: j + 1,
          });
        }
      }

      setSuccess('The quiz questions have been saved successfully!');
      setTimeout(() => navigate(`/owner/modules/${moduleId}/edit`), 1200);
    } catch (err) {
      const errorMsg = err.message || err.detail || 'Failed to save the quiz.';
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="md">
        <Typography>Loading...</Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={3}>

        <Box sx={{ mb: 1 }}>
          <Button
            component={RouterLink}
            to={`/owner/modules/${moduleId}/edit`}
            startIcon={<Icon.ArrowBack fontSize="small" />}
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              fontWeight: 500,
              p: 0,
              mb: 1.5,
              minHeight: 'auto',
              '&:hover': { color: 'primary.main', backgroundColor: 'transparent' },
              textTransform: 'none',
            }}
          >
            Back to {module?.title || 'Module'}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h1" sx={{ fontSize: '1.75rem', fontWeight: 700 }}>
              Manage Quiz
            </Typography>
            {module?.title && (
              <Chip
                label={module.title}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500, borderColor: 'divider', color: 'text.secondary' }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Add, edit, or remove quiz questions for this training module.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}


        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3">Questions ({questions.length})</Typography>
          <ActionButton fullWidth={false} onClick={handleAddQuestion}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon.Add fontSize="small" /> Add Question
            </Box>
          </ActionButton>
        </Box>

        <Stack spacing={3}>
          {questions.map((q, qIndex) => (
            <Paper key={q.id} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Q{qIndex + 1}
                  </Typography>


                  <select
                    value={q.question_type}
                    onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="SINGLE">Single Choice</option>
                    <option value="MULTIPLE">Multiple Choice</option>
                  </select>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Points:</Typography>
                    <input
                      type="number"
                      value={q.points}
                      onChange={(e) => updateQuestion(qIndex, 'points', e.target.value)}
                      style={{ width: '60px', padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                      min="1"
                    />
                  </Box>

                  <Box sx={{ flexGrow: 1 }} />

                  <IconButton color="error" onClick={() => handleRemoveQuestion(qIndex)}>
                    <Icon.Delete fontSize="small" />
                  </IconButton>
                </Stack>

                <FormField
                  label="Question Text"
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  inputProps={{ multiline: true, rows: 2 }}
                />


                <Box sx={{ pl: 2, borderLeft: '3px solid #e0e0e0' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Select the correct answer(s):
                  </Typography>
                  <Stack spacing={1}>
                    {q.choices.map((c, cIndex) => (
                      <Stack key={c.id} direction="row" spacing={1} alignItems="center">
                        {q.question_type === 'SINGLE' ? (
                          <Radio
                            checked={c.is_correct}
                            onChange={() => updateChoice(qIndex, cIndex, 'is_correct', true)}
                            size="small"
                          />
                        ) : (
                          <Checkbox
                            checked={c.is_correct}
                            onChange={(e) => updateChoice(qIndex, cIndex, 'is_correct', e.target.checked)}
                            size="small"
                          />
                        )}
                        <FormField
                          label={`Option ${cIndex + 1}`}
                          value={c.text}
                          onChange={(e) => updateChoice(qIndex, cIndex, 'text', e.target.value)}
                          sx={{ flexGrow: 1 }}
                        />
                        <IconButton size="small" color="error" onClick={() => handleRemoveChoice(qIndex, cIndex)}>
                          <Icon.Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    size="small"
                    startIcon={<Icon.Add />}
                    onClick={() => handleAddChoice(qIndex)}
                    sx={{ mt: 1 }}
                  >
                    Add Option
                  </Button>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>


        {questions.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, pt: 2 }}>
            <Stack direction="row" spacing={1}>
              <ActionButton
                fullWidth={false}
                variant="ghost"
                onClick={() => navigate(`/owner/modules/${moduleId}/edit`)}
              >
                Back to Edit Module
              </ActionButton>
              <ActionButton
                fullWidth={false}
                variant="ghost"
                onClick={() => navigate(`/user/modules/${moduleId}/quiz`)}
              >
                Test Take Quiz
              </ActionButton>
            </Stack>

            <ActionButton
              fullWidth={false}
              onClick={handleSaveAll}
              loading={isSaving}
              loadingText="Saving..."
            >
              Save All Questions
            </ActionButton>
          </Box>
        )}
      </Stack>
    </PageContainer>
  );
}

export default ManageQuizPage;