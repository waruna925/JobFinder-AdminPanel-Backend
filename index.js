import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jobVacancyRouter from './routes/jobVacancyRouter.js';

const app = express();

//mongodb+srv://admin:<db_password>@cluster0.lgxco4u.mongodb.net/?appName=Cluster0
mongoose.connect("mongodb+srv://admin:1234@cluster0.lgxco4u.mongodb.net/?appName=Cluster0").then(() => {
    console.log("Connected to the database")
})
    .catch(() => {
        console.log("Database connection Failed")
    })

app.use(bodyParser.json());
app.use('/api/job',jobVacancyRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});