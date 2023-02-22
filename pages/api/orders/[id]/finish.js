// /api/orders/:id
import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await db.connect();

  await Order.updateOne({_id:req.query.id},{$set:{isPaid:true,isDelivered:true,deliveredAt:new Date(),paidAt:new Date()}});
  await db.disconnect();
  return res.status(200).send('paid');
};

export default handler;