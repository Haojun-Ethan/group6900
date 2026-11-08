/*
 * Password rules shown on the register page. They mirror the backend's Django validators
 * (AUTH_PASSWORD_VALIDATORS in settings.py), so a password that passes here passes there too:
 *
 *   MinimumLengthValidator           at least 8 characters
 *   NumericPasswordValidator         not only digits
 *   UserAttributeSimilarityValidator not too similar to the username or email
 *   CommonPasswordValidator          not in Django's list of ~20,000 common passwords
 *
 * The common-password list is too big to ship to the browser, so only a short sample is checked
 * here; the backend has the final say and its message is shown under the field.
 */

export const MIN_LENGTH = 8;

// A few of the most common passwords, for instant feedback. The backend checks the full list.
const COMMON_SAMPLE = new Set([
    'password', 'password1', 'password123', 'passw0rd', 'qwerty', 'qwerty123', 'qwertyuiop',
    'letmein', 'welcome', 'welcome1', 'admin', 'admin123', 'iloveyou', 'monkey', 'dragon',
    'football', 'baseball', 'sunshine', 'princess', 'abc12345', 'abcd1234', 'trustno1',
    'starwars', 'superman', 'whatever', 'computer', 'michelle', 'jennifer', 'shadow123',
]);

/** Roughly Django's similarity check: the password contains, or is contained in, a user attribute. */
const tooSimilar = (password, attributes) => {
    const pw = password.toLowerCase();

    return attributes
        .filter(Boolean)
        .flatMap((attr) => {
            const value = attr.toLowerCase();
            // Django also compares each part of the attribute, e.g. "jane" and "doe" in "jane.doe@x.com".
            return [value, ...value.split(/\W+/)];
        })
        .filter((part) => part.length >= 3)
        .some((part) => pw.includes(part) || (pw.length >= 3 && part.includes(pw)));
};

/**
 * @typedef {Object} PasswordRule
 * @property {string} key
 * @property {string} label  hint shown to the user
 * @property {(password: string, context: {username?: string, email?: string}) => boolean} test
 */

/** @type {PasswordRule[]} */
export const PASSWORD_RULES = [
    {
        key: 'length',
        label: `At least ${MIN_LENGTH} characters`,
        test: (v) => v.length >= MIN_LENGTH,
    },
    {
        key: 'numeric',
        label: 'Not only numbers',
        test: (v) => v.length > 0 && !/^\d+$/.test(v),
    },
    {
        key: 'similar',
        label: 'Not similar to your username or email',
        test: (v, ctx = {}) => v.length > 0 && !tooSimilar(v, [ctx.username, ctx.email]),
    },
    {
        key: 'common',
        label: 'Not a commonly used password',
        test: (v) => v.length > 0 && !COMMON_SAMPLE.has(v.toLowerCase()),
    },
];

export const getActiveRules = () => PASSWORD_RULES;

/**
 * @param {string} value
 * @param {{username?: string, email?: string}} [context]
 * @returns {PasswordRule[]} the rules this password fails
 */
export const getFailedPswRules = (value, context = {}) => PASSWORD_RULES.filter((rule) => !rule.test(value, context));

/**
 * @param {string} value
 * @param {{username?: string, email?: string}} [context]
 * @returns {string | null} error message, or null when every rule passes
 */
export const validatePassword = (value, context = {}) => {
    if (!value) return 'Please enter a password';

    const failed = getFailedPswRules(value, context);
    return failed.length === 0 ? null : failed.map((rule) => rule.label).join(' / ');
};
