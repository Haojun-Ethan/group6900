import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getTempToken, get2FAFlow,remove2FAFlow, removeTempToken } from "../../utils/storage";
import CodeInput from "../../components/auth/CodeInput";




function Challenge2FAPage (){
    const {challenge2FA,user} = useAuth();       /* debuge by 2FA---3-07*/
    const navigate = useNavigate;

    /*  Reconstrution in 3-05, delete it in 3-06
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);
    useEffect(( ) => { 
        inputRef.current?.focus();
     },
    []);
*/
    useEffect(( ) => { 
        // already logged, -> return to home/login page 
        if(user) { navigate('/',{repace:true});  return}  /* debuge by 2FA---3-07*/
        const tempToken = getTempToken()
        const flow = get2FAFlow();
        if(!tempToken || flow !=='login') {
            navigate('/login',{replace:true});
        }
    },[navigate, user]);     /* add user dependency; debuge by 2FA---3-07*/


   /*  Reconstrution in 3-05, delete it in 3-06
    const validateCode =(value) => { 
        if(!value) return 'Code is required';
        if(!/^\d{6}$/.test(value)) return 'Code must be digits';  
        return null;
    };
*/
    const handleSubmit = async (code) => { 
       try {
        await challenge2FA(code);
       navigate('/',{replace:true});
        } catch (err) {
            if (err.code === 'INVALID_TEMP_TOKEN'){
                navigate('/login',{replace:true});
                return;
            }
            throw err;
        }

        const handleSwichAccount=() => {     /* debuge by 2FA---3-07*/
            removeTempToken();
            remove2FAFlow();
         }

     return(
        <div>
            <h1>Authentication</h1>
            <p>Please enter the 6-digit code from Okta.</p>
            <CodeInput onSubmit={handleSubmit} submitLabel="Verify"/>
           {/* <p>Incorrect account! <a href="/login"/> Return to Login Page</p>* debug 2FA ---3-07 */}
            <p>Incorrect Account? {' '} <Link to="/login" onClick={handleSwichAccount}>  Return to Login Page</Link></p>
        </div>
       
    );
    }
}


export default Challenge2FAPage;