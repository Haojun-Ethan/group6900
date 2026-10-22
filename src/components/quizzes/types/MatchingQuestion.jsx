import { useState } from 'react';
import { Stack, Paper, Typography, Box, Chip, Grid } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

/**
 * Matching question - Check future: https://mui.com/material-ui/react-grid/  react-stack; react-paper; react-chip for layout
 *https://mui.com/material-ui/react-transfer-list/
 *https://mui.com/material-ui/react-paper/#variants
 *https://mui.com/material-ui/react-list/#simple-list

 * Interaction:
 *   1. Click a left item → selected (highlighted)
 *   2. Click a right item → establishes pair
 *   3. Click an already-paired item → unpair
 *   -----------
 *   1. 点击左侧项 → 选中
 *   2. 点击右侧项 → 建立配对
 *   3. 点击已配对项 → 取消配对
 *
 * Data shape  
 *   question.pairs = [ { id: 31, left: 'Phishing', right: 'Email attack' } ]
 *   value = { [leftPairId]: rightPairId }  // e.g. { 31: 32, 32: 31 }
 *
 * @param {Object} props
 * @param {object} props.question
 * @param {Object} props.value
 * @param {(v: object) => void} props.onChange
 * @param {boolean} [props.disabled]
 */
function MatchingQuestion({ question, value = {}, onChange, disabled = false }) {
    const pairs = question.pairs || [];

    const [rightItems] = useState(() =>   // Shuffle right column (stable per mount)- check 
        [...pairs].sort( () => Math.random()-0.5 )
    );

    const [selectedLeft, setSelectedLeft] = useState(null);

    const handleLeftClick = (pairId) => {
        if (disabled) return;


            if (value[pairId] != null)  { // This left item is already paired → unpair it
                const next = { ...value  };
                delete next[pairId];
                onChange(next);
                setSelectedLeft(null);
                return;
            }

        setSelectedLeft( pairId === selectedLeft? null : pairId);
    };

    const handleRightClick = (pairId) => {
        if (disabled) return;


            const existingLeft = Object.keys(value ).find((k) => value[k]=== pairId);             // This right item is already taken → free it
            if (existingLeft) {
                const next = {  ...value};

                delete next[existingLeft];

                onChange(next);
                return;
            }

        if (selectedLeft == null) return;    // No left selected → ignore

       
        const next = { ...value, [selectedLeft]: pairId };       // Establish pair

        onChange(next);
        setSelectedLeft(null);
    };

    return (
        <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tap a term on the left, then tap its match on the right.
        </Typography>

        <Grid container spacing={2}>

            {/* ******* Left */}

            <Grid item xs={6}>
            <Typography variant="caption" sx={{ mb:1, display:  'block', fontWeight: 600 }}>
                TERMS
            </Typography>
            <Stack spacing={1}>
                {pairs.map((pair) => {
                const isPaired = value[pair.id] != null;
                const isSelected = selectedLeft === pair.id;

                return (
                    <Paper
                    key={pair.id}
                    elevation={0}
                    onClick={() => handleLeftClick(pair.id)}
                    sx={{
                        p: 1.5,
                        border: '2px solid',
                        borderColor: isSelected ?'primary.main':isPaired ? 'primary.light' : 'divider',
                        backgroundColor: isSelected ? 'rgba(59, 91, 140,  0.06 )' : isPaired ? 'rgba( 59,  91, 140, 0.03)' : '#fff',
                        cursor: disabled ? 'default' : 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': disabled ? {} : { borderColor: 'primary.light' },
                    }}
                    >
                    <Typography variant="body1">{pair.left}</Typography>
                    </Paper>
                );
                })}
            </Stack>
            </Grid>

            {/* ******* Right */}

            
            <Grid item xs={6}>
            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                DESCRIPTIONS
            </Typography>
            <Stack spacing={1}>
                {rightItems.map((pair) => {
                const pairedToLeft = Object.keys(value).find((k) => value[k]===pair.id);
                const isPaired = !!pairedToLeft;

                return (
                    <Paper
                    key={pair.id}
                    elevation={0}
                    onClick={() => handleRightClick(pair.id)}
                    sx={{
                        p: 1.5,
                        border: '2px solid',
                        borderColor: isPaired ? 'primary.light' : 'divider',
                        backgroundColor: isPaired ? 'rgba(59, 91, 140, 0.03)' : '#fff',
                        cursor: disabled ? 'default' : 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': disabled ? {} : { borderColor: 'primary.light' },
                    }}
                    >
                    <Typography variant="body2">{pair.right}</Typography>
                    </Paper>
                );
                })}
            </Stack>
            </Grid>
        </Grid>

        {Object.keys(value).length > 0 && (
            <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}> Matched ({Object.keys(value).length}):  </Typography>
            <Stack direction="row" spacing={1 } sx={{ flexWrap:'wrap', gap: 1 }}>
                {Object.entries(value).map(([leftId, rightId]) => {

                    const left = pairs.find((p) => p.id === Number(leftId));
                    const right = pairs.find((p) => p.id === rightId);
                    return (
                        <Chip
                            key={leftId}
                            icon={<LinkIcon fontSize="small" />}
                            label={`${left?.left} → ${right?.right}`}
                            size="small"
                            onDelete={  disabled ? undefined : () => { const next = { ...value };
                                delete next[leftId];
                                onChange(next);
                                }
                            }
                        />
                    );

                })}
            </Stack>
            </Box>
        )}


        </Box>
    );
}


export default MatchingQuestion;