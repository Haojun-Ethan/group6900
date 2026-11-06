
import {Box, Typography} from "@mui/material";

function SectionContent({text}) {
    if (!text) return null;

    const lines = text.split('\n');

    return (
        <Box sx={{ lineHeight:1.8, typography: 'body1'}}>

            {lines.map((line,index) => { 
                /*
                    https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
                */
                const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;

                const ytMatch = youtubeRegex.exec(line);

                if (ytMatch && ytMatch[1]) {
                    const videoId = ytMatch[1].split('&')[0]; // get only the id
                    return (
                        <Box key={index } sx={{ my: 2, position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2 }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </Box>
                    );
                }

                                const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
                const imgMatch = imageRegex.exec(line);

                if (imgMatch && imgMatch[1]) {
                    return (
                        <Box key={index} sx={{ my: 2, textAlign: 'center' }}>
                            <img 
                                src={imgMatch[1]} 
                                alt="module content" 
                                style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                            />
                        </Box>
                    );
                }



                if (line.trim() === '') {
                    return <Box key={index} sx={{ height: 12 }} />; 
                }

                return (
                    <Typography key={index} variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                        {line}
                    </Typography>
                );
             })}
        </Box>
    )
}

export default SectionContent;