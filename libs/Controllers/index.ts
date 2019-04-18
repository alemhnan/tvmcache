import { Request, Response } from 'express';
import MongoDB from '../MongoDB';
import { Show } from '../Interfaces';
const started = new Date();

const PAGE_SIZE = 250;

let getShows: (skip: number, limit: number) => Promise<Show[]>;

(async () => {
  const mongoMethods = await MongoDB();
  getShows = mongoMethods.getShows;
})();

export let root = (req: Request, res: Response) => {
  const uptime = (Date.now() - Number(started)) / 1000;

  return res.json({ uptime });
};

export let shows = async (req: Request, res: Response) => {
  const page: number = Math.floor(Number(req.query.page)) || 0;

  const skip = page * PAGE_SIZE;
  const limit = PAGE_SIZE;

  try {
    const shows = await getShows(skip, limit);
    return res.json(shows);
  } catch (error) {
    console.log(error);
    return res.json([]);
  }
};
