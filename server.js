const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get("/", async (req,res, next) => {
    try {
        res.json(await db.select("*").from("accounts"));
    } catch (err) {
        next(err);
    }
});

server.get("/:id", async (req,res, next) => {
    try {
        res.json(await db("accounts").where("id", req.params.id).first());
    } catch (err) {
        next(err);
    }
});

server.post("/", async (req, res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        };

        const [id] = await db("accounts").insert(payload);

        res.json(await db("accounts").where("id", id).first());

    } catch (err) {
        next(err);
    }
});

server.put("/:id", async (req,res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        };
        
        await db("accounts").where("id", req.params.id).update(payload);

        res.json(await db("accounts").where("id", req.params.id).first());
        
    } catch (err) {
        next(err);
    }
});

server.delete("/:id", async (req, res, next) => {
    try {
        res.json(await db("accounts").where("id", req.params.id).del());
    } catch (err) {
        next(err);
    }
});


server.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({message: "Something went wrong"})
});

module.exports = server;