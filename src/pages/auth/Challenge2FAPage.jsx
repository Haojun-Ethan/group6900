import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getTempToken, get2FAFlow } from "../../utils/storage";
import CodeInput from "../../components/auth/CodeInput";



function Challenge2FAPage (){
    const {challenge2FA} = useAuth();
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
        const tempToken = getTempToken()
        const flow = get2FAFlow();
        if(!tempToken || flow !=='login') {
            navigate('/login',{replace:true});
        }
    },[navigate]);


   /*  Reconstrution in 3-05, delete it in 3-06
    const validateCode =(value) => { 
        if(!value) return 'Code is required';
        if(!/^\d{6}$/.test(value)) return 'Code must be digits';  
        return null;
    };
*/
    const handleSubmit = async (code) => { 
       await challenge2FA(code);
       navigate('/',{replace:true});
        };


     return(
        <div>
            <h1>Authentication</h1>
            <p>Please enter the 6-digit code from Okta.</p>
            <CodeInput onSubmit={handleSubmit} submitLabel="Verify"/>
            <p>Incorrect account! <a href="/login"/> Return to Login Page</p>
        </div>
       
    );

}


export default Challenge2FAPage;