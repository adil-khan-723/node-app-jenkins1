import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://internal-alb-backend-664704932.ap-southeast-2.elb.amazonaws.com/api/message')
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Frontend-Backend Demo</h1>
      <p>{message ? message : 'Loading message...'}</p>
    </div>
  );
}

export default App;
