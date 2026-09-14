// src/App.jsx
import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle form submit / 处理表单提交
  const handleSubmit = (e) => {
    // Prevent page reload / 阻止页面刷新（浏览器默认行为）
    e.preventDefault();

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
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* type="submit" triggers form onSubmit / type="submit" 触发 form 的 onSubmit */}
      <button type="submit">Login</button>
    </form>
  );
}

export default App;