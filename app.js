const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const items = require("./data.json");

const PORT = 3000;

const app = express();
const server = http.Server(app);
const ioServer = socketio(server);

let currentIndex = 0;

let isMasterConnected = false;

ioServer.on("connection", (socket) => {
    let isMaster = false;
    console.log(`connected: ${socket.id}`);

    socket.on("disconnect", () => {
        if (isMaster) {
            isMasterConnected = false;
            console.log(`master disconnected: ${socket.id}`);
        }
        else {
            console.log(`disconnected: ${socket.id}`);
        }
    });

    socket.on("connect_master", () => {
        if (isMasterConnected) {
            socket.disconnect();
            return;        
        }

        isMaster = true;
        isMasterConnected = true;     
        currentIndex = 0;   
        console.log(`master found: ${socket.id}`);
        socket.on("active_item_changed", (itemIndex) => {
            currentIndex = itemIndex;
            console.log(`show item: ${itemIndex}`);
            socket.broadcast.emit('show_item', itemIndex);
        })
        socket.emit("init_data", items, currentIndex);
        socket.broadcast.emit("show_item", currentIndex);
    });

    socket.on("connect_slave", () => {
        socket.emit("init_data", items, currentIndex);
    });
});

app.use("/", express.static(path.join(__dirname, "client")));

server.listen(PORT, () => {
    console.log(`listening on 0.0.0.0:${PORT}`);
})