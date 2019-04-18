import { Request, Response } from 'express';
import MongoDB from '../Repositories/MongoDB';
import { Show } from '../Interfaces';

let getShows: () => Promise<Show[]>;

(async () => {
  const mongoMethods = await MongoDB();
  getShows = mongoMethods.getShows;
})();

export let root = (req: Request, res: Response) => res.send('Hello');

export let shows = async (req: Request, res: Response) => {
  const shows = await getShows();
  return res.json(shows);
};
