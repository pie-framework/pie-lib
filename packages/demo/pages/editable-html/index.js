// pages/client-only.js
import dynamic from 'next/dynamic';

const ClientOnlyPage = dynamic(() => import('./editable-html'), {
  ssr: false, // This disables server-side rendering
});

export default ClientOnlyPage;
