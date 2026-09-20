import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { getActiveRules, validatePassword,} from '../../utils/passwordRules'

/* ---- Router 2-02 add strong password---- */
const LOGIN_FIELDS = [
  { name: 'email', label: 'Email', type: 'text', placeholder: 'Enter your email' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
];


//https://zod.dev/api?id=strings    https://react-hook-form.com/get-started
//https://blog.logrocket.com/build-a-password-generator-app-in-react-with-reusable-components/

const RULES = {
    email: [ 
        {test: (v) => !!v.trim(), message:'Email is required'},
        {test:(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Email format is invalid' },
    
    ],
};


function LoginPage() {
    //---router 2-02  rewrite, delete -> const [email, setEmail] = useState('');
    //---router 2-02  rewrite, delete ->const [password, setPassword] = useState('');
    //---router 2-02  rewrite, delete ->const [errors, setErrors] = useState({});
     const {login} = useAuth(); /* ---Router 2-02 add---- */
     const navigate = useNavigate();/* ---Router 2-02 add---- */

     const [form, setForm] = useState({email: '', password: ''});
     const [errors, setErrors] = useState({});
    // Loading state / 加载状态
    const [isLoading, setIsLoading] = useState(false);
    //Server error state / 服务器错误状态
    const [serverError, setServerError] = useState('');

    const updateField = (name, value) => { 
        setForm((prev) => ({ ...prev, [name]:value }));
     };

  //validation form, return errors object
    const validate = ( ) => { 
        const newErrors = {}
    
        /* ---Router 2-02 add---- */
        for (const rule of RULES.email) {
            if(!rule.test(form.email)){
                newErrors.email = rule.message;
                break;
            }
        }

        const pwdErr = validatePassword(form.password);
        if (pwdErr) newErrors.password = pwdErr;

         return newErrors;
    }


  // Handle form submit  / 处理表单提交
  const handleSubmit = async (e) => {       /* must use async */
    // Prevent page reload / 阻止页面刷新（浏览器默认行为）// importent
    e.preventDefault();

    setServerError(''); // Reset server error / 重置服务器错误


    const newErrors = validate();
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({}); 
        setIsLoading(true); // Set loading state / 设置加载状态
        // Log form data / 打印表单数据
        //console.log('Email:', email);
        //console.log('Password:', password);

        try {
            const result = await login(form);    /* login is an async function, return Promise.  MUST USE await */
            //console.log('Login successful:', result);
              if (result.requires2FA) {
                    navigate('/login/2fa', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }/* ---Router 2-02 add  , 2FA 3-01 ---- */

        } catch (error) {
            setServerError(error.message || 'An error occurred during login'); // Set server error / 设置服务器错误
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false); //stop Loading / 停止加载
        }

     };

  return (
    // Use form instead of div - can use enter
    <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

        {LOGIN_FIELDS.map((field) => (
            <div key={field.name}> <label> {field.label}</label> <input type={field.type} placeholder={field.placeholder} value={form[field.name]} onChange={(a)=>updateField(field.name, a.target.value)} disabled={isLoading} />
            {errors[field.name] && (<p>{errors[field.name]}</p>)
        }

        {/* pass word rule check */}
        {field.name === 'password' && (
            <ul> 
                {getActiveRules().map((rule) => { 
                    const passed = rule.test(form.password);
                    return (
                        <li key={rule.key}> {passed ? '✓' : '○'}{rule.label}</li>
                    )
                 })}
            </ul>
        )}
        </div>
  ))}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      <p>
        Do not have an account? <Link to="/register">Register</Link>
      </p>
    </form>
    );
}

export default LoginPage;