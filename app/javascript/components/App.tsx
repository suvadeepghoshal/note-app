import Home from './Home';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Note from './Note';

const App = () => (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="note" element={<Note />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
);
export default App;
