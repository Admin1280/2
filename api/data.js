// pages/api/data.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('my-db');
    const collection = db.collection('data');

    switch (req.method) {
      case 'GET':
        const data = await collection.findOne({});
        res.status(200).json(data || {});
        break;
      case 'POST':
        await collection.updateOne({}, { $set: req.body }, { upsert: true });
        res.status(200).json({ success: true });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    await client.close();
  }
}