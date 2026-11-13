import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link as RouterLink } from 'react-router-dom';
import * as authApi from '../../api/auth';
import { validatePassword, getActiveRules } from '../../utils/passwordRules';

import { FormField, ActionButton, AlertMessage, Icon } from '../../components/ui';
import { Stack, Box, List, ListItem, ListItemIcon, ListItemText, Link as MuiLink } from '@mui/material';
import AuthLayout from '../../components/ui/AuthLayout';
import './RegisterPage.css';





const REGISTER_FIELDS = [
    { name: 'username',        label: 'Username',         type: 'text',     placeholder: 'Enter your username' },
    { name: 'email',           label: 'Email',            type: 'text',     placeholder: 'Enter your email' },
    { name: 'password',        label: 'Password',         type: 'password', placeholder: 'Enter your password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password' },
]; /* rewrite 5-01, change partial assignment name:username laber:username  */

const EMAIL_RULES = [
    { test: (v) => !!v.trim(), msg: 'Email is required' },
    { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Email format is invalid' },
];

function RegisterPage() {
    const navigate = useNavigate();


    const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    });

    /* same to LoginPage, and keep they at here */
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);   
    const [serverError, setServerError] = useState('');

    const updateField = (name,value) => {
        setForm((prev) => ({...prev, [name]:value}));
     }

    // The similarity rule compares the password with these.
    const passwordContext = { username: form.username, email: form.email };

     const validate = ( ) => { 
        const newError = {};

        if(!form.username.trim()) {
            newError.username = 'Username is required';   //* debuge .name issue,   6-03 */
        }

        for(const rule of EMAIL_RULES) {
            if(!rule.test(form.email)) {
                newError.email=rule.msg;
                break;
            }
        }

        // Same rules as the backend's password validators (see utils/passwordRules.js).
        const pwdErr = validatePassword(form.password, passwordContext);
        if(pwdErr) newError.password = pwdErr;

        //confirm password
        if(!form.confirmPassword) {
            newError.confirmPassword = 'Please confirm your password';

        } else if (form.confirmPassword !== form.password) {
            newError.confirmPassword = "Passwords don't match";
        }

        return newError;
    };

    const handleSubmit = async (ee) => { 
        ee.preventDefault();
        setServerError('');

        const newErr = validate();
        if(Object.keys(newErr).length > 0) {
            setErrors(newErr);
            return;
        }
        setErrors({});

        setIsLoading(true);
        try{ /* rewrite 5-01, try */
            
            await authApi.register({
                username: form.username,
                email: form.email,
                password: form.password
            });
            // The login page shows a "registered" message and fills in the username.
            navigate('/login', { replace: true, state: { registered: true, username: form.username } });
        } catch (err) {
            // Show the backend's messages under the matching fields (e.g. "This password is too common.",
            // "A user with that username already exists."); anything else goes in the banner.
            const fieldErrors = {};
            for (const name of ['username', 'email', 'password']) {
                const messages = err.fieldErrors?.[name];
                if (messages) fieldErrors[name] = [].concat(messages).join(' ');
            }

            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                setServerError(err.message || 'Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    };
 
    return(
    <AuthLayout className="register-page" title="Register" subtitle="Create your account.">     {/* debug  title="Regiser"*/}
        <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
                {serverError && <AlertMessage type="error">{serverError}</AlertMessage>}

                {REGISTER_FIELDS.map((field) => (
                    <Box key={field.name}>
                        <FormField 
                        label={field.label}
                        type={field.type}
                        value={form[field.name]}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        error={errors[field.name]}
                        disabled={isLoading}
                        />

                        {field.name ==="password" && form.password.length > 0 && (
                            <List dense sx={{mt:1,pl:1}}>
                                {getActiveRules().map((rule) => {
                                const passed = rule.test(form.password, passwordContext);
                                return (
                                <ListItem key={rule.key} disableGutters sx={{ py: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 28 }}>
                                    {passed
                                        ? <Icon.CheckCircle fontSize="small" color="success" />
                                        : <Icon.RadioButtonUnchecked fontSize="small" sx={{ color: 'text.disabled' }} />}
                                    </ListItemIcon>
                                    <ListItemText
                                    primary={rule.label}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        color: passed ? 'success.main' : 'text.secondary',
                                    }}
                                    />
                                </ListItem>
                                );
                            })}
                            </List>
                        )}
                    </Box>
                    ))}

                    <ActionButton type="submit" loading={isLoading} loadingText="Registering...">
                        Register
                    </ActionButton>

                    <MuiLink
                        component={RouterLink}
                        to="/login"
                        underline="hover"
                        sx={{ textAlign: 'center', fontSize: '0.9rem' }}
                    >
                        Already have an account? Login
                    </MuiLink>
                    </Stack>
        </form>
    </AuthLayout>
  );
}

export default RegisterPage;

