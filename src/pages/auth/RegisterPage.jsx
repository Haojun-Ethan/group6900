import { useState } from "react";
import { getActiveRules, validatePassword } from "../../utils/passwordRules";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";





const REGISTER_FIELDS = [
    { name: 'name',            label: 'Name',             type: 'text',     placeholder: 'Enter your name' },
    { name: 'email',           label: 'Email',            type: 'text',     placeholder: 'Enter your email' },
    { name: 'password',        label: 'Password',         type: 'password', placeholder: 'Enter your password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password' },
];

const EMAIL_RULES = [
    { test: (v) => !!v.trim(), msg: 'Email is required' },
    { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Email format is invalid' },
];

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();


    const [form, setForm] = useState({
    name: '',
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

        if(!form.name.trim()) {
            newError.name = 'Name is required';
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
        try{
            // clean confirPassword before sending
            const {confirmPassword,...payload} = form;  /* debug   */

         
              const result = await register(payload);   

                    
                if (result.requires2FASetup) {   /* 2FA 3-01*/
                    navigate('/register/setup-2fa', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }    

        } catch (err) {
            setServerError(err.message || 'Registration failed!');
        } finally {
            setIsLoading(false);
        }
    };

    return(
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
                    <p>{errors[field.name]}</p>
                )}

                {/* Password rule checklist, only under password field / 密码规则清单，只在密码字段下 */}
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

            {/* Link to login  */}
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </form>
    );
    
}

export default RegisterPage