import { MongoClient } from 'mongodb';
import { Show } from '../Interfaces';

const mongodbURL = 'mongodb://localhost';
const dbName = 'tvmaze';

export default async () => {

  const dbClient = await MongoClient.connect(mongodbURL, { useNewUrlParser: true });
  const showCollection = await dbClient.db(dbName).collection('Shows');

  const saveShow = async ({ id, name, cast }: Show) =>
    showCollection.insertOne({ _id: id, id, name, cast }); // tslint:disable-line

  const getLastShowId = async (): Promise<number> => {
    const [lastShow] = await showCollection.find().sort({ _id: -1 }).limit(1).toArray();
    if (lastShow) {
      return lastShow._id;
    }
    return 0;
  };

  const getShows = async (skip: number, limit: number): Promise<Show[]> =>
    showCollection.find().skip(skip).limit(limit).project({ _id: 0 }).toArray();

  return {
    saveShow,
    getLastShowId,
    getShows,
    close: () => dbClient.close(),
  };

};
