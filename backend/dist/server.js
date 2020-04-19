"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const Express = require("express");
const app = Express();
const server = http.createServer(app);
const io = socket_io_1.default(server);
server.listen(3001);
// Create grid
const widthPoints = 20;
const heightPoints = 20;
const randRange = (minimum, maximum) => Math.random() * (maximum - minimum) + minimum;
let grid = [...new Array(widthPoints * heightPoints)]
    .fill(0)
    .map((_, index) => [Math.floor(index / widthPoints), index % widthPoints])
    .map(([xPosition, yPosition]) => [xPosition / widthPoints, yPosition / heightPoints])
    .map(([xPosition, yPosition]) => {
    let jitter = [randRange(-0.05, 0.05), randRange(-0.05, 0.05)];
    return [xPosition + jitter[0], yPosition + jitter[1]];
});
let lengths = grid.map(() => 0);
io.on('connection', (socket) => {
    lengths = grid.map(() => 0);
    socket.emit('updateClientGrid', grid);
    socket.on('updateServerLengths', (updatedLengths) => {
        if (updatedLengths.length !== lengths.length) {
            return;
        }
        lengths = updatedLengths;
    });
    // Grow
    setInterval(() => {
        lengths = lengths.map((length) => Math.min(length + 0.0001, 1000));
        socket.emit('updateClientLengths', lengths);
    }, 100);
    socket.on('disconnect', () => console.log('Client disconnected'));
});
// const cellWidth = 0.01 * maxDimension;
// const cellHeight = 0.01 * maxDimension;
// const thickness = 0.003 * maxDimension;
// const positionJitterRange = 0.005 * maxDimension;
// const growthMin = 0.00003 * maxDimension;
// const growthMax = 0.00008 * maxDimension;
// const lengthMin = 0.01 * maxDimension;
// const lengthMax = 0.028 * maxDimension;
// const directionLeft = -0.1;
// const directionRight = 0.8;
// const directions: Vector[] = positions.map(() => [randRange(directionLeft, directionRight), 1]);
// const growthRates = positions.map(() => randRange(growthMin, growthMax));
// const maximumLengths = grid.map(() => randRange(lengthMin, lengthMax));
//# sourceMappingURL=server.js.map