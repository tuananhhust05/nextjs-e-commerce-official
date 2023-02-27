import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/outline';

import styles from './layout.module.css'
export default function Layout({ title, children }) {
  // take data from session 
  const { status, data: session } = useSession();
  // when state change => data display changes 
  const { state, dispatch } = useContext(Store);
  const { cart } = state; // take data from store 
  // count of product is sum of quantity 
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0)); // caculate sum 
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');  // delete Cookie data 
    dispatch({ type: 'CART_RESET' }); // delete data in store useContext 
    signOut({ callbackUrl: '/login' }); // logout and delete session 
  };

  const query = ''; // set find word 

  const router = useRouter();

  // search function 
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'} </title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/">
              <a className="text-lg font-bold">TraCo</a>
            </Link>
            <div className = {styles.option_header}>
              <form
                  onSubmit={submitHandler}
                  className={styles.search_btn}
                >
                  <button
                    className=""
                    type="submit"
                    id="button-addon2"
                  >
                    <SearchIcon className="h-5 w-5"></SearchIcon>
                  </button>
              </form>
              <Link href="/cart">
                <a className="p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className={`relative inline-block ${styles.profile_btn}`}>
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items style={{zIndex:"100"}} className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <div className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.footeritem}>
                        <div className={styles.text}>
                            <h2>Address</h2>
                            <p>Bằng liệt, Hoàng Liệt <br/>Hoàng Mai, Hà Nội </p>
                        </div>
                    </div>
                    <div className={styles.footeritem}>
                        <div className={styles.text}>
                            <h2>Contact</h2>
                            <p>Phone: 0339170155</p>
                            <p> Email: tuananhhust05@gmail.com</p>
                        </div>
                          
                    </div>
                </div>
                <hr style={{ margin:"3% 10%",width:"80%" }}/>
                <p style={{color:"white",margin:"15px"}}>@Copyright by TraCo</p>
            </div>
            <img src="https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=600" alt=".." className={styles.img_background_footer}/>
        </div>
      </div>

    </>
  );
}
