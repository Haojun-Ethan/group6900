/**
 * A short plain-text preview of a Markdown section body, for list views that show only a line or
 * two: drops headings, table rows, answer blocks and formatting symbols so they don't show as raw text.
 * @param {string} body
 * @returns {string}
 */
export function markdownPreview(body = '') {
    return body
        .replace(/```[\s\S]*?```/g, ' ')                  // answer / video / code blocks
        .split('\n')
        .filter((line) => !/^\s*(#{1,6}\s|\|)/.test(line))  // headings and table rows
        .join(' ')
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')              // images
        .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')            // links -> their text
        .replace(/^\s*>\s?/gm, '')
        .replace(/[*_`>]+/g, '')                           // bold, italics, code, quotes
        .replace(/(^|\s)(?:[-+]|\d+\.)\s+/g, '$1')         // list markers
        .replace(/\s+/g, ' ')
        .trim();
}
