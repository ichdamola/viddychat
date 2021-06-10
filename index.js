const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server,{
        cors: {
            origin: "*",
            motheds: ["GET", "POST"],
        }
    });

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
    res.send('Server is running...');
  });

  io.on("connection", function(socket){
      socket.emit("me", socket.id);

      socket.on("disconnect", function(){
          socket.broadcast.emit("callended");
      });

      socket.on("calluser", function ({ userToCall, signalData, from, name }){
          io.to(userToCall).emit("calluser", { signal: signalData, from, name});
      });

      socket.on("answercall", function(data){
          io.to(data.to).emit("callaccepted", data.signal);
      })
  });


  server.listen(PORT, function (){
      console.log(`Server listening on PORT ${PORT}`);
  })