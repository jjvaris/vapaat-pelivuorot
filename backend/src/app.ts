import express from 'express';
import compression from 'compression';
import cors from 'cors';
import state from './state';
import { start as startScraping } from './scraper';
import fs from 'fs';

const app = express();
const router = express.Router();

app.use(cors());
app.use(compression({ level: 1 }));
app.use(express.json());

app.use(router);

const mock = JSON.parse(fs.readFileSync('src/example-response.json', 'utf-8'));

startScraping();

router.get('/api/health', (req, res) => res.sendStatus(200));

router.get('/api/mock', (req, res) => res.send(mock));

router.get('/api/available-hours', (req, res) => res.send(state.get()));

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
