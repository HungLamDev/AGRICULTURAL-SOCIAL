let users = [];

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
      console.log("User updated:", existingUser);
    } else {
      users.push({
        id: user._id,
        socketId: socket.id,
        followers: user.followers || [],
      });
      console.log("New user added:", user);
    }
    console.log("Current users:", users);
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
  // Comments
  socket.on("createComment", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

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
};

module.exports = SocketServer;
