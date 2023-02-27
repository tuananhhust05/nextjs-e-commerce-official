import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (!session.user)) {
    return res.status(401).send('signin required');
  }
  if(!session.user.isAdmin){
     return res.status(401).send('you are not allowed');
  }
  await db.connect();

  await Order.updateOne({_id:req.query.id},{$set:{isPaid:true,paidAt:new Date()}});
  await db.disconnect();
  return res.status(200).send('paid');
};

export default handler;