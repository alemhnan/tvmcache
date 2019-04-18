# TV Maze Cache


The application is set in two parts, the scraper and the API. The application use MongoDB as database.

To run the scraper: `npm run scraper`

It will start to build the local cache. It will store in the database every show, with the cast ordered by birthday, sleeping 550ms between calls. It's safe to stop and restart the scraper since it will start from the last downloaded show.



To run the API: `npm run start`


There are two endpoints:

#### [GET] `/`
Returns the uptime in seconds

#### [GET] `/shows?page={N}`
Returns the shows paginated by 250. To request a specific page use the query parameter `page` (e.g. `/shows?page=23`).
It will return an empty array if there are no shows (same behaviour of the TV Maze API).


### TODO

- Move the secrets into enviroment variables(e.g. database credentials). Now they are statically set in the code;
- Replace `console.log` statements with the `debug` module;
- Use a proper repository (or similar) pattern;
- Better data layout (e.g. the cast could be stored in its own collection and referenced by id;
- Add a build phase to run directly with node, now we are running with `ts-node`;
- Add tests of course;

