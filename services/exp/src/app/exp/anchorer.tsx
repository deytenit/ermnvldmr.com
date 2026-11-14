import { createRoot } from 'react-dom/client';

import { Anchorer } from '../../components/Anchorer';
import { ExpLayout } from '../../components/ExpLayout';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <ExpLayout>
      <Anchorer />
    </ExpLayout>
  );
}
