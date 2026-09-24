import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link as RouterLink } from 'react-router-dom';
import * as authApi from '../../api/auth';
import { validatePassword, getActiveRules } from '../../utils/passwordRules';

import { FormField, ActionButton, AlertMessage, Icon } from '../../components/ui';
import { Stack, Box, List, ListItem, ListItemIcon, ListItemText, Link as MuiLink } from '@mui/material';
import AuthLayout from '../../components/ui/AuthLayout';





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

        const pwdErr = validatePassword(form.password)      // shared rules with -passwordrules
        if(pwdErr) newError.password = pwdErr;

        //confirm password
        if(!form.confirmPassword) {
            newError.confirmPassword = 'Please confirm your password!';

        } else if (form.confirmPassword !== form.password) {
            newError.confirmPassword = 'Password incorrect';
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
            navigate('/login', {replace:true});  
        } catch (err) {
            setServerError(err.message || 'Registration failed!');
        } finally {
            setIsLoading(false);
        }
    };
 
    return(
      <AuthLayout title="Register" subtitle="Create your account.">     {/* debug  title="Regiser"*/}
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
                                const passed = rule.test(form.password);
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


/*   MUI ---6-01 rewrite
  <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

            {REGISTER_FIELDS.map((field) => (
                <div key={field.name}>
                <label>{field.label}</label>
                <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    disabled={isLoading}
                />
                {errors[field.name] && (
                    <p style={{color:'red'}}>{errors[field.name]}</p>
                )}

               
                {field.name === 'password' && (
                    <ul style={{ fontSize: 12, color: '#666', marginTop: 4, paddingLeft: 16 }}>
                    {getActiveRules().map((rule) => {
                        const passed = rule.test(form.password);
                        return (
                        <li key={rule.key} style={{ color: passed ? 'green' : '#999' }}>
                            {passed ? '✓' : '○'} {rule.label}
                        </li>
                        );
                    })}
                    </ul>
                )}
                </div>
            ))}

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
            </button>

        
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </form>
*/