// src/App.jsx
import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Store validation erros
  const [errors, setErrors] = useState({});

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

    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Log form data / 打印表单数据
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    // Use form instead of div - can use enter
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <div>
        <label>Email</label>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <button type="submit">Login</button>
    </form>
  );
}

export default App;