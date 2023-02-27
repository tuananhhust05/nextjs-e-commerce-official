import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Home({TraditionalProduct,GiftProduct}) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };
  let listImage = [ 
     "/images/slide1.jpg",
     "/images/slide4.jpg"
  ]
  return (
    <Layout title="Home Page">
      <Carousel showThumbs={false} autoPlay>
        {listImage.map((product,key) => (
          <div key={key}>
              <a className="flex">
                <img style={{height:"500px"}} src={product} alt={product.split("/")[0]} />
              </a>
          </div>
        ))}
      </Carousel>
        <h2 className="h2 my-4">Traditional Product</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          { TraditionalProduct.products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            >
            </ProductItem>
          ))}
        </div>
        <h2 className="h2 my-4">Gift Product</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          { GiftProduct.products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            >
            </ProductItem>
          ))}
        </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  let products = await Product.find().lean();
  products = products.map(db.convertDocToObj);
  let listCategory = [];
  let listProduct = [];
  for(let i=0; i<products.length; i++){
      if(!listCategory.includes(products[i].category)){
          listCategory.push(products[i].category);
      }
  }
  for(let i=0; i<listCategory.length; i++){
    let term = {};
    term.category = listCategory[i];
    term.products = [];
    for(let j=0; j<products.length; j++){
        if(products[j].category == term.category){
            term.products.push(products[j]);
        }
    }
    listProduct.push(term);
  }
  let Traditional = {};
  let Gift = {};
  for(let i=0; i<listProduct.length; i++){
     if(listProduct[i].category == "Trandition product"){
        Traditional= listProduct[i]
     }
     if(listProduct[i].category == "Small gift"){
        Gift= listProduct[i]
     }
  }
  return {
    props: {
      TraditionalProduct: Traditional,
      GiftProduct:Gift
    },
  };
}
