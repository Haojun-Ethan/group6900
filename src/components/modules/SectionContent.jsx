import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Box, Typography, Link, Button, Paper, Collapse,
    Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
} from '@mui/material';

/*
 * Renders a section body written in Markdown (GitHub flavour: tables, lists, links, images).
 *
 * Extras on top of Markdown:
 *   ```answer ... ```   an exercise answer, hidden behind a "Show answer" button
 *   a bare YouTube link on its own line becomes an embedded video
 *   a bare image URL on its own line becomes an image (older section bodies used this)
 *
 * Raw HTML in the body is NOT rendered (react-markdown's default), and javascript: links are
 * stripped, so text written by module owners can't inject scripts into learners' browsers (XSS).
 */

const YOUTUBE = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})\S*$/;
const IMAGE_URL = /^https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg)(?:\?\S*)?$/i;

/** Turn the older "bare URL on its own line" style into Markdown, outside code blocks. */
const preprocess = (text) => {
    let inFence = false;

    return text.split('\n').map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('```')) inFence = !inFence;
        if (inFence) return line;

        const video = YOUTUBE.exec(trimmed);
        if (video) return '```youtube\n' + video[1] + '\n```';
        if (IMAGE_URL.test(trimmed)) return `![](${trimmed})`;
        return line;
    }).join('\n');
};

/** The language and text of a fenced code block, from react-markdown's syntax tree. */
const codeBlock = (node) => {
    const code = node?.children?.[0];
    const className = [].concat(code?.properties?.className || []);
    const language = className.find((c) => String(c).startsWith('language-'))?.slice('language-'.length);
    const text = (code?.children || []).map((child) => child.value || '').join('');
    return { language, text };
};

function AnswerReveal({ text }) {
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ my: 2 }}>
            <Button variant="outlined" size="small" onClick={() => setOpen((v) => !v)}>
                {open ? 'Hide answer' : 'Show answer'}
            </Button>
            <Collapse in={open}>
                <Paper elevation={0} sx={{
                    mt: 1.5, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'success.light',
                    backgroundColor: 'rgba(76, 140, 90, 0.06)',
                }}>
                    <Markdown text={text} />
                </Paper>
            </Collapse>
        </Box>
    );
}

function YouTubeEmbed({ id }) {
    return (
        <Box sx={{ my: 2, position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2 }}>
            <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title="YouTube video player"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </Box>
    );
}

const isExternal = (href = '') => /^https?:\/\//i.test(href);

// Map Markdown elements to MUI components. `node` is dropped so it isn't passed to the DOM.
/* eslint-disable no-unused-vars */
const components = {
    h1: ({ node, ...props }) => <Typography variant="h2" sx={{ mt: 3, mb: 1.5 }} {...props} />,
    h2: ({ node, ...props }) => <Typography variant="h3" sx={{ mt: 3, mb: 1.5 }} {...props} />,
    h3: ({ node, ...props }) => <Typography variant="h3" sx={{ mt: 3, mb: 1.5, fontSize: '1.15rem' }} {...props} />,
    h4: ({ node, ...props }) => <Typography variant="h4" sx={{ mt: 2, mb: 1 }} {...props} />,
    p: ({ node, ...props }) => <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.8 }} {...props} />,
    a: ({ node, href, ...props }) => (
        <Link href={href} underline="hover"
            {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props} />
    ),
    ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 3, mb: 1.5, '& li': { mb: 0.5, lineHeight: 1.7 } }} {...props} />,
    ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 3, mb: 1.5, '& li': { mb: 0.5, lineHeight: 1.7 } }} {...props} />,
    blockquote: ({ node, ...props }) => (
        <Box component="blockquote" sx={{
            m: 0, mb: 1.5, pl: 2, py: 0.5, borderLeft: '4px solid', borderColor: 'primary.light',
            color: 'text.secondary', '& p:last-child': { mb: 0 },
        }} {...props} />
    ),
    img: ({ node, alt, ...props }) => (
        <Box component="img" alt={alt || ''} loading="lazy" sx={{
            display: 'block', maxWidth: '100%', mx: 'auto', my: 2, borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }} {...props} />
    ),
    table: ({ node, ...props }) => (
        <TableContainer component={Paper} elevation={0} sx={{ my: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table size="small" {...props} />
        </TableContainer>
    ),
    thead: ({ node, ...props }) => <TableHead sx={{ backgroundColor: 'rgba(59, 91, 140, 0.06)' }} {...props} />,
    tbody: ({ node, ...props }) => <TableBody {...props} />,
    tr: ({ node, ...props }) => <TableRow {...props} />,
    th: ({ node, style, ...props }) => <TableCell sx={{ fontWeight: 700, verticalAlign: 'top' }} {...props} />,
    td: ({ node, style, ...props }) => <TableCell sx={{ verticalAlign: 'top', lineHeight: 1.6 }} {...props} />,
    code: ({ node, ...props }) => (
        <Box component="code" sx={{ px: 0.5, py: 0.25, borderRadius: 0.5, backgroundColor: '#f5f5f7', fontFamily: 'monospace', fontSize: '0.9em' }} {...props} />
    ),
    pre: ({ node, children }) => {
        const { language, text } = codeBlock(node);

        if (language === 'answer') return <AnswerReveal text={text.trim()} />;
        if (language === 'youtube') return <YouTubeEmbed id={text.trim()} />;

        return (
            <Box component="pre" sx={{ p: 2, my: 2, borderRadius: 1, backgroundColor: '#f5f5f7', overflowX: 'auto', fontSize: '0.875rem' }}>
                {children}
            </Box>
        );
    },
};
/* eslint-enable no-unused-vars */

function Markdown({ text }) {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {preprocess(text)}
        </ReactMarkdown>
    );
}

function SectionContent({ text }) {
    if (!text) return null;

    return (
        <Box sx={{ typography: 'body1', '& > :first-of-type': { mt: 0 } }}>
            <Markdown text={text} />
        </Box>
    );
}

export default SectionContent;
