
/**
 * Feature flag: require special character in password
 * @type {boolean}
 */
const PASSWORD_REQUIRE_SPECIAL = false; // if require special character

//https://blog.logrocket.com/react-hook-form-vs-react-19/
/**
 * @typedef {Object} PasswordRule
 * @property {string} key
 * @property {string} label     -Hint show to user
 * @property {(v: string) => boolean} test   - Check function
 * @property {boolean} enabled  - If this rule is active
 */

/**
 * All password rules
 * @type {PasswordRule[]}
 */

export const PASSWORD_RULES =[
    { key: 'length',  label: 'At least 8 characters',        test: (v) => v.length >= 8,          enabled: true },
    { key: 'upper',   label: 'Contains an uppercase letter', test: (v) => /[A-Z]/.test(v),        enabled: true },
    { key: 'lower',   label: 'Contains a lowercase letter',  test: (v) => /[a-z]/.test(v),        enabled: true },
    { key: 'digit',   label: 'Contains a number',            test: (v) => /\d/.test(v),           enabled: true },
    { key: 'special', label: 'Contains a special character', test: (v) => /[^A-Za-z0-9]/.test(v), enabled: PASSWORD_REQUIRE_SPECIAL },
];

/**
 * get only active rules
 * @returns 
 */

export const getActiveRules = ( ) => PASSWORD_RULES.filter((rr)=>rr.enabled);


/**
 * The failed password rules 
 * @param {string} value 
 * @returns {PasswordRule[]}
 */

export const getFailedPswRules= (value) => PASSWORD_RULES.filter((rr) => rr.enabled && !rr.test(value));

/**
 * 
 * @param {string} value    - Input Password
 * @returns {string | null} -Error msg & null
 */

export const validatePassword = (value) => { 
    if(!value) return 'Please enter password';

    const failed = getFailedPswRules(value);

    if(failed.length === 0) return null;

    return failed.map((rr) => rr.label).join(' /');
 }

