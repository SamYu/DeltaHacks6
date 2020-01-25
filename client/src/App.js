import React, { useEffect, useState } from 'react';

function App() {
  const [test, setTest] = useState(null);
  useEffect(() => {
    const res = fetch('/test')
                  .then(res => res.json())
                  .then(myJson => setTest(myJson.message));
  });
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {test}
        </p>
      </header>
    </div>
  );
}

export default App;
