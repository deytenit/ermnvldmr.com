import { createRoot } from 'react-dom/client';

import { ExpLayout } from '../components/ExpLayout';
import { QRiosity } from '../components/QRiosity';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <ExpLayout>
      <QRiosity />
    </ExpLayout>
  );
}
