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

  const [query, setQuery] = useState(''); // set find word 

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
              <a className="text-lg font-bold">amazona</a>
            </Link>
            <form
              onSubmit={submitHandler}
              className="mx-auto  hidden w-full justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5"></SearchIcon>
              </button>
            </form>
            <div>
              <Link href="/cart">
                <a className="p-2">
                  Cart
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
                <Menu as="div" className="relative inline-block">
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
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Amazona</p>
        </footer>
      </div>
    </>
  );
}
