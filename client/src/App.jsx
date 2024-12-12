import React from 'react';
import Hero from '../../client/src/components/Hero';
import MarqueeModern from './components/MarqueeModern'; // Uncomment if you need this later
import DragDrop from './components/DragDrop';
const App = () => {
  return (
    <div>
      <section>
        <Hero />
      </ section >
      <section>
        <MarqueeModern />
      </section>
      <section>
        <h1>Drag and Drop Image Upload</h1>
        <DragDrop />
      </section>
    </div>
  );
};

export default App;