import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { StoreProvider } from '../utils/Store'; // config store useContext 
import { useRouter } from 'next/router';
// import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// auto take session 
// data transform input: default 
// ...pageProp for child component 
// default data input and devide it to parts 
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {/* <PayPalScriptProvider deferLoading={true}> */}
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        {/* </PayPalScriptProvider> */}
      </StoreProvider>
    </SessionProvider>
  );
}

// where is children and adminOnly transform 
// this component is used for above component 
function Auth({ children, adminOnly }) {
  const router = useRouter(); // for redirect to an other page 
  const { status, data: session } = useSession({
    required: true,
    // check authenticate in session 
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  console.log("Dữ liệu test")
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // if adminOnly == fasle; user don'tt want to login as admin 
  // if adminOnly == true; user want to login as admin 
  // but we don't know where Component.auth.adminOnly is declared
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}

export default MyApp;
