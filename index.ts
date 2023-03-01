import mongoose from 'mongoose';
import dotenv from 'dotenv';
import main from './src/logic';
import app from './src/app';
import config from './src/config';
// const port = config.port;
dotenv.config();

const port = process.env.PORT || 5000;

mongoose
    .connect(config.mongooseURL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Listening to port ${port}`);
            main();
        });
    })
    .catch((err) => {
        console.log('err: ', err);
    });
