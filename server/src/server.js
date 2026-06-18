import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { createDemoApp } from './demoApp.js';

dotenv.config();

const port = process.env.PORT || 5000;

const start = async () => {
  let app;

  try {
    await connectDb(process.env.MONGO_URI);
    app = createApp();
  } catch (error) {
    console.warn(`MongoDB unavailable (${error.message}). Starting demo API mode.`);
    app = createDemoApp();
  }

  app.listen(port, () => console.log(`BillPilot Pro API running on port ${port}`));
};

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
