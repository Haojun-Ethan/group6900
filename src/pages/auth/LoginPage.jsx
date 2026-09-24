import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import {  useNavigate } from "react-router-dom";
import { Stack, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AuthLayout from "../../components/ui/AuthLayout";
import { ActionButton, AlertMessage, FormField } from "../../components/ui";





//https://zod.dev/api?id=strings    https://react-hook-form.com/get-started
//https://blog.logrocket.com/build-a-password-generator-app-in-react-with-reusable-components/

/* const RULES = {
    email: [ 
        {test: (v) => !!v.trim(), message:'Email is required'},
        {test:(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Email format is invalid' },
    
    ],
};
*/
/* rewrite 5-01, add LOGIN_FIELDS */
const LOGIN_FIELDS = [
    {name:'username', label:'Username', type:'text', placeholder:'Enter your username'},
    {name:'password', label:'Password', type:'password', placeholder:'Enter your password'},
];


function LoginPage() {
    //---router 2-02  rewrite, delete -> const [email, setEmail] = useState('');
    //---router 2-02  rewrite, delete ->const [password, setPassword] = useState('');
    //---router 2-02  rewrite, delete ->const [errors, setErrors] = useState({});
     const {login} = useAuth(); /* ---Router 2-02 add---- */
     const navigate = useNavigate();/* ---Router 2-02 add---- */

     const [form, setForm] = useState({username:'', password: ''});
     const [errors, setErrors] = useState({});
    // Loading state / 加载状态
    const [isLoading, setIsLoading] = useState(false);
    //Server error state / 服务器错误状态
    const [serverError, setServerError] = useState('');

    const updateField = (name, value) => { 
        setForm((prev) => ({ ...prev, [name]:value }));
     };

     const validate = () => {
        const err = {};
        if (!form.username.trim()) {
            err.username = 'Username is required';
        }
        if (!form.password.trim()) {
            err.password = 'Password is required';
        }
        return err;
    };

  // Handle form submit  / 处理表单提交
  const handleSubmit = async (e) => {       /* must use async */
    // Prevent page reload 
    e.preventDefault();    /* Read from Fullstackopen,  this is important */
    if (isLoading) return; // Prevent duplicate submission /防重复提交

    setServerError(''); // Reset server error  /    重置服务器错误


    const err = validate();
    
        if (Object.keys(err).length > 0) {
            setErrors(err);
            return;
        }
        setErrors({}); 
        setIsLoading(true); // Set loading state 
        // Log form data 
        //console.log('Email:', email);
        //console.log('Password:', password);

        try {
            const result = await login(form);    /* login is an async function, return Promise.  MUST USE await */
            
            navigate(result.mfaRequired ? '/login/2fa' : '/', { replace: true }); /* ---Rewrite 5-01 ,Router 2-02 add  , 2FA 3-01 ---- */
        } catch (error) {
            setServerError(error.message || 'An error occurred during login'); // Set server error 
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false); //stop Loading 
        }

     };

  return (
    // Use form instead of div - can use enter
    /* MUI ----06-01*/
    <AuthLayout title="Login" subtitle="Welcome back. Please sign in.">
   
    <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
            {serverError && <AlertMessage type="error">{serverError}</AlertMessage>}

  
        {LOGIN_FIELDS.map((field) => (
            <FormField 
            key={field.name}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={(e)=> updateField(field.name,e.target.value)}
            error={errors[field.name]}
            disabled={isLoading}
            autoComplete={field.autoComplete}
            />

        ))}

        <ActionButton type="sumbie" loading={isFinite} loadingText="Loging in.."> Login </ActionButton>

        // eslint-disable-next-line no-undef
        <MuiLink 
            component={RouterLink}
            to="/register"
            underline="hover"
            sx={{ textAlign:'center', fontSize:'0,9rem'}}
          >
            Do not have an account? Register 
        </MuiLink>

     
      </Stack>
    </form>
     </AuthLayout>
    );
}

export default LoginPage;

/*    MUI ---6-01 rewrite
              <div key={field.name}> 
            <label> {field.label}</label> 
            <input type={field.type} placeholder={field.placeholder} value={form[field.name]} onChange={(a)=>updateField(field.name, a.target.value)} disabled={isLoading} />
            {errors[field.name] && <p style={{ color: 'red' }}>{errors[field.name]}</p>}
            </div>

             <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      <p>
        Do not have an account? <Link to="/register">Register</Link>
      </p>
            */