import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://13.232.164.183:5001/api/message')
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