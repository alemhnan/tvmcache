import { MongoClient } from 'mongodb';
import { Show } from '../Interfaces';

const mongodbURL = 'mongodb://localhost';
const dbName = 'tvmaze';

export default async () => {

  const dbClient = await MongoClient.connect(mongodbURL, { useNewUrlParser: true });
  const showCollection = await dbClient.db(dbName).collection('Shows');

  const saveShow = async (show: Show) =>
    showCollection.insertOne(Object.assign(show, { _id: show.id }));

  const getLastShowId = async (): Promise<number> => {
    const [lastShow] = await showCollection.find().sort({ _id: -1 }).limit(1).toArray();
    if (lastShow) {
      return lastShow._id;
    }
    return 0;
  };

  const getShows = async (): Promise<Show[]> => {
    console.log('rana');
    return showCollection.find().sort({ _id: -1 }).limit(5).toArray();
  };
  return {
    saveShow,
    getLastShowId,
    getShows,
    close: () => dbClient.close(),
  };

};
