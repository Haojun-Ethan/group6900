import { useState } from "react";
import { login } from "../../api/auth";

function LoginPage() {
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});


  // Loading state / 加载状态
  const [isLoading, setIsLoading] = useState(false);


  //Server error state / 服务器错误状态
    const [serverError, setServerError] = useState(null);

  //validation form, return errors object
  const validate = ( ) => { 
    const newErrors = {}
  

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Email is invalid';
    }


    //Password validation
    if (!password) {
      newErrors.password = 'Password is required';

    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    return newErrors;
  }


  // Handle form submit / 处理表单提交
  const handleSubmit = (e) => {
    // Prevent page reload / 阻止页面刷新（浏览器默认行为）
    e.preventDefault();

    setServerError(null); // Reset server error / 重置服务器错误


    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({}); 
    setIsLoading(true); // Set loading state / 设置加载状态
    // Log form data / 打印表单数据
    console.log('Email:', email);
    console.log('Password:', password);

    try {
        const result = login({ email, password });
        console.log('Login successful:', result);

    } catch (error) {
        setServerError(err.message || 'An error occurred during login'); // Set server error / 设置服务器错误
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

      <div>
        <label>Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {/* Show email error if exists / 如果有邮箱错误则显示 */}
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
    );
}

export default LoginPage;