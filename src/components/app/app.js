import { useState } from 'react';
import Popup from '../popup/popup';
import './app.css';

function App() {
  const [isPopupShow, setPopupShow] = useState(false);

  const closePopup = () => setPopupShow(false);

  const popup = isPopupShow ? <Popup onClose={closePopup} /> : null;

  return (
    <main className={`outside-digital-app ${isPopupShow ? "outside-digital-app--open" : ""}`}>
      <button className="tax-deduction-button" onClick={() => setPopupShow(true)}>Налоговый вычет</button>
      {popup}
    </main>
  );
}

export default App;
