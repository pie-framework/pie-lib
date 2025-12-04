import dynamic from 'next/dynamic';

const ClientOnlyPage = dynamic(() => import('./editable-html-tip-tap'), {
  ssr: false, // This disables server-side rendering
});

export default ClientOnlyPage;
