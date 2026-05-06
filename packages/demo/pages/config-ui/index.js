import dynamic from 'next/dynamic';

const ClientOnlyPage = dynamic(() => import('./config-ui.js'), {
  ssr: false, // This disables server-side rendering
});

export default ClientOnlyPage;
