let users = [];

const EditData = (data, id, call) => {
  const newData = data.map((item) =>
    item.id === id ? { ...item, call } : item
  );
  return newData;
};

const SocketServer = (socket) => {
  //connect and disconnect user
  socket.on("joinUser", (user) => {
    if (!user || !user._id) {
      console.log("Invalid user data received:", user);
      return;
    }
    const existingUser = users.find((u) => u.id === user._id);
    if (existingUser) {
      existingUser.socketId = socket.id;
      existingUser.followers = user.followers || [];
    } else {
      users.push({
        id: user._id,
        socketId: socket.id,
        followers: user.followers || [],
      });
    }
  });

  socket.on("disconnect", () => {
    const data = users.find((user) => user.socketId === socket.id);
    if (data) {
      const clients = users.filter((user) =>
        data.followers.find((item) => item._id === user.id)
      );

      if (clients.length > 0) {
        clients.forEach((client) => {
          socket.to(`${client.socketId}`).emit("CheckUserOffline", data.id);
        });
      }
      if (data.call) {
        const callUser = users.find((user) => user.id === data.call);
        if (callUser) {
          users = EditData(users, callUser.id, null);
          socket.to(`${callUser.socketId}`).emit("callerDisconnect");
        }
      }
    }

    users = users.filter((user) => user.socketId !== socket.id);
  });

  socket.on("likePost", (newPost) => {
    const followers = Array.isArray(newPost.user.followers)
      ? newPost.user.followers.map((f) => f._id)
      : [];
    const ids = [...followers, newPost.user._id].filter(
      (id) => typeof id === "string"
    );
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("likeToClient", newPost);
      });
    }
  });

  socket.on("unlikePost", (newPost) => {
    const followers = Array.isArray(newPost.user.followers)
      ? newPost.user.followers.map((f) => f._id)
      : [];
    const ids = [...followers, newPost.user._id].filter(
      (id) => typeof id === "string"
    );
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unlikeToClient", newPost);
      });
    }
  });

  socket.on("createComment", (newPost) => {
    console.log("newPost", newPost);
    const ids = [...newPost.user.followers, newPost.user._id];
    console.log("ids", ids);
    const clients = users.filter((user) => ids.includes(user.id));
    console.log("clients", clients);

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
      });
    }
  });

  socket.on("deleteComment", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
      });
    }
  });

  // follow
  socket.on("follow", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    console.log("follow user", user);
    user && socket.to(`${user.socketId}`).emit("followToClient", newUser);
  });

  socket.on("unfollow", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    console.log("unfollow user", user);
    user && socket.to(`${user.socketId}`).emit("unfollowToClient", newUser);
  });

  // notify
  socket.on("createNotify", (msg) => {
    const client = users.filter((user) => msg.recipients.includes(user.id));
    if (client.length > 0) {
      client.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
      });
    }
  });

  socket.on("removeNotify", (msg) => {
    console.log("msg", msg);
    const client = users.filter((user) => msg.recipients.includes(user.id));
    console.log("client", client);
    if (client.length > 0) {
      client.forEach((client) => {
        socket.to(`${client.socketId}`).emit("removeNotifyToClient", msg);
      });
    }
  });
  // message
  socket.on("addMessage", (msg) => {
    console.log(msg);
    const user = users.find((user) => user.id === msg.recipient);
    user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
  });
  // check use online // offline
  socket.on("checkUserOnline", (data) => {
    const following = users.filter((user) =>
      data?.following?.find((item) => item._id === user.id)
    );

    socket.emit("checkUserOnlineToMe", following);

    const clients = users.filter((user) =>
      data?.followers?.find((item) => item._id === user.id)
    );

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("checkUserOnlineToClient", data._id);
      });
    }
  });

  // call user
  socket.on("callUser", (data) => {
    users = EditData(users, data.sender, data.recipient);

    const client = users.find((user) => user.id === data.recipient);

    if (client) {
      if (client.call) {
        socket.emit("userBusy", data);
        users = EditData(users, data.sender, null);
      } else {
        users = EditData(users, data.recipient, data.sender);
        socket.to(`${client.socketId}`).emit("callUserToClient", data);
      }
    }
  });
  socket.on("endCall", (data) => {
    const client = users.find((user) => user.id === data.sender);
    if (client) {
      socket.to(`${client.socketId}`).emit("endCallToClient", data);
      users = EditData(users, client.id, null);
      if (client.call) {
        const clientCall = users.find((user) => user.id === client.call);
        clientCall &&
          socket.to(`${clientCall.socketId}`).emit("endCallToClient", data);
        users = EditData(users, client.call, null);
      }
    }
  });
};

module.exports = SocketServer;
