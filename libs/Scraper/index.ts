import nodeFetch from 'node-fetch';

import MongoDB from '../MongoDB';
import { Show, Cast, ApiCast } from '../Interfaces';
import { sortByBirthday, delay } from '../Utils';

const TVMAZE_API = 'https://api.tvmaze.com';

const getShows = async (page: Number) => {
  const res = await nodeFetch(`${TVMAZE_API}/shows?page=${page}`);
  if (res.status === 200) {
    const shows = await res.json();
    return shows.map(({ id }: Show) => id);
  }

  if (res.status === 429) {
    throw Error('429');
  }
  if (res.status === 404) {
    throw Error('404');
  }
  throw Error(res.status.toString());

};

const getShowWithCast = async (id: number): Promise<Show> => {
  const res = await nodeFetch(`${TVMAZE_API}/shows/${id}?embed=cast`);
  if (res.status === 200) {
    const { id, name, _embedded: { cast } } = await res.json();

    const castPersonSorted: Cast[] = cast
      .map(({ person: { id, name, birthday } }: ApiCast): Cast => ({ id, name, birthday }))
      .sort(sortByBirthday);

    return { id, name, cast: castPersonSorted };
  }
  if (res.status === 429) {
    throw Error('429');
  }
  if (res.status === 404) {
    throw Error('404');
  }
  throw Error(res.status.toString());

};

export const scrape = async () => {
  const { saveShow, close, getLastShowId } = await MongoDB();
  const lastShowId = await getLastShowId();
  let startingPage = Math.floor(lastShowId / 250);

  const saveOneShow = async (showId: number) => {
    const show: Show = await getShowWithCast(showId);
    await saveShow(show);
    console.log(`Show ${show.id}:${show.name} stored, sleeping for 550ms`);
    await delay(550);
  };

  let showIndexes = await getShows(startingPage);

  while (showIndexes) {

    for (let index = 0; index < showIndexes.length; index += 1) {
      const showId = showIndexes[index];
      if (lastShowId >= showId) {
        console.log(`Show ${showId} already processed`);
        continue;
      }

      try {
        await saveOneShow(showId);
      } catch (error) {
        console.log(error);
        process.exit(-1);
        // Note: Since for every request we are waiting 550ms we should, in theory, never get here.
        // Therefore I prefer to stop the system and get notified, cause to asses the
        // reason for the error.
        // That's why this code here is commented (and not tested)

        // if (error.message === '429') {
        //   console.log(`Rate limit hit, sleeping for 5s`);
        //   // if we hit a 429 we sleep for 5s
        //   // await delay(5000);
        //    console.log('Waited 5s, starting again');
        //   // await saveOneShow(showId);
        // }
      }
    }
    startingPage += 1;
    showIndexes = await getShows(startingPage);
  }
  console.log('Finished scraping');
};
