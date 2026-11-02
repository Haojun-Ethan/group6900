import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Stack, Box, Typography, IconButton, Button, Radio, Checkbox, Alert } from '@mui/material';
import * as modulesApi from '../../../api/modules';
import apiClient from '../../../api/client';
import { PageContainer, PageTitle, ActionButton, Icon, FormField } from '../../../components/ui';


let idCounter = 0;
const generateId = () => {
    idCounter += 1;
    return `temp_${idCounter}`;
};

/* add 08-06 */
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
        } catch  {
          console.log('There is no question data yet for this module, starting fresh.');
        }

        if (!ignore) {
          setModule(moduleData);
          setQuestions(existingQuestions);
        }
      } catch (err) {
        if (!ignore) setError(err.message || ' Failed to load module or questions');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
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
        { id: generateId() + 1, text: '', is_correct: true, order: 1 },
        { id: generateId() + 2, text: '', is_correct: false, order: 2 }
      ]
    };
    setQuestions([...questions, newQ]);
  };

  // delete question
  const handleRemoveQuestion = (qIndex) => {
    if (!window.confirm('are you sure you want to delete this question?')) return;
    const newQs = [...questions];
    newQs.splice(qIndex, 1);
    setQuestions(newQs);
  };

  // update question field
  const updateQuestion = (qIndex, field, value) => {
    const newQs = [...questions];
    newQs[qIndex][field] = value;
  
    if (field === 'question_type') {
      newQs[qIndex].choices = value === 'TRUE_FALSE' 
        ? [ /* add true/false options */ ]
        : [
            { id: generateId(), text: '', is_correct: false, order: 1  },
            { id: generateId(), text: '', is_correct: false, order: 2  }
          ];
    }
    setQuestions(newQs);
  };

  const handleAddChoice = (qIndex) => {
    const newQs = [...questions];
    newQs[qIndex].choices.push( {
      id: Date.now(),
      text: '',
      is_correct: false,
      order: newQs[qIndex].choices.length + 1
    });
    setQuestions(newQs);
  };


  const handleRemoveChoice = (qIndex, cIndex) => {
    const newQs = [...questions];
    newQs[qIndex].choices.splice(cIndex, 1);
    setQuestions(newQs);
  };


  const updateChoice = (qIndex, cIndex, field, value) => {
    const newQs = [...questions];
    

    if (field === 'is_correct' && newQs[qIndex].question_type === 'SINGLE') {
      newQs[qIndex].choices.forEach((c, i) => {
        c.is_correct = ( i === cIndex );
      });
    } else {
      newQs[qIndex].choices[cIndex][field] = value;
    }
    
    setQuestions(newQs);
  };
  const handleSaveAll = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.text.trim()) throw new Error(`Question ${i+1} is missing a description`);
        if (!q.choices.some(c => c.is_correct)) throw new Error(`Question ${i+1} does not have a correct answer selected`);
        if (q.choices.some(c => !c.text.trim())) throw new Error(`Question ${i+1} has an empty option`);
      }


      for (const q of questions) {
 
        

        const qPayload = {
          module: moduleId,
          text: q.text,
          question_type: q.question_type,
          explanation: q.explanation || '',
          points: Number(q.points),
          order: q.order
        };
        

        const createdQ = await apiClient.post('/questions/', qPayload);
        
        // create choices for the question
        for (const c of q.choices) {
          await apiClient.post('/choices/', {
            question: createdQ.id,
            text: c.text,
            is_correct: c.is_correct,
            order: c.order
          });
        }
      }

      setSuccess('The test has been saved successfully!');
      setTimeout(() => navigate('/owner/modules'), 1500);

    } catch (err) {
      setError(err.message || 'Failed to save the test - check if the backend API is available.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <PageContainer><Typography>loading...</Typography></PageContainer>;

  return (
    <PageContainer maxWidth="md">
      <Stack spacing={3}>
        <Box>
          <ActionButton variant="ghost" fullWidth={false} onClick={() => navigate('/owner/modules')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon.ArrowBack fontSize="small" /> Back to Manage Modules
            </Box>
          </ActionButton>
        </Box>

        <PageTitle 
          title="Manage Quiz" 
          subtitle={`Editing questions for: ${module?.title || ''}`} 
        />

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Box sx={{ display: 'flex', justifyContent:  'space-between', alignItems: 'center' }}>
          <Typography variant="h3">Questions ({questions.length})</Typography>
          <ActionButton fullWidth={false} onClick={handleAddQuestion}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon.Add fontSize="small" /> Add Question
            </Box>
          </ActionButton>
        </Box>


        <Stack spacing={3}>
          {questions.map((q, qIndex) => (
            <Paper key={q.id || qIndex} elevation={0} sx={{ p: 3 , border: '1px solid', borderColor: 'divider ',  borderRadius: 2 }}>
              <Stack spacing={2}>

                <Stack direction="row" spacing={2}  alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">Q{qIndex + 1}</Typography>
                  
                  <select 
                    value={q.question_type} 
                    onChange={(e) =>  updateQuestion(qIndex, 'question_type', e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px',  border: '1px solid #ccc' }}
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
                      style={{ width: '60px', padding:  '4px', border: '1px solid #ccc', borderRadius: '4px' }} 
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

                  </Typography>
                  <Stack spacing={1}>
                    {q.choices.map((c, cIndex) => (
                      <Stack key={c.id || cIndex} direction="row" spacing={1} alignItems="center">
                        {q.question_type === 'SINGLE' ? (
                          <Radio 
                            checked={c.is_correct} 
                            onChange={() => updateChoice(qIndex, cIndex, ' is_correct', true)} 
                            size="small"
                          />
                        ) : (
                          <Checkbox 
                            checked={c.is_correct} 
                            onChange={(e) => updateChoice(qIndex, cIndex, 'is_correct ', e.target.checked)} 
                            size="small"
                          />
                        )}
                        <FormField 
                          label={`Option ${cIndex + 1}`} 
                          value={c.text} 
                          onChange={(e) => updateChoice(qIndex, cIndex, 'text ', e.target.value)}
                          sx={{ flexGrow: 1 }}
                        />
                        <IconButton size="small" color="error " onClick={() => handleRemoveChoice(qIndex, cIndex)}>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <ActionButton onClick={handleSaveAll} loading={isSaving} loadingText="Saving...">
              Save All Questions
            </ActionButton>
          </Box>
        )}
      </Stack>
    </PageContainer>
  );
}

export default ManageQuizPage;