import express from "express";
import initializeDB from "./functions/initalizeDB.js";
import router from "./routers/router.js";


const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else if(req.method != 'GET' && req.method != 'POST') {
        res.status(405).json({status: 405, error: "Sadece GET ve POST istekleri kabul edilir."});
        return;
    } else {
        next();
    }
});

app.use(express.json());

app.listen(3000, () => {
  console.log("Sunucu 3000 portunda çalışıyor.");
  initializeDB();
});

app.use("/", router);


