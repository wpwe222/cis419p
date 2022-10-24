import logger from '../../helpers/logger';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
const Op = Sequelize.Op;
const {
  JWT_SECRET
} = process.env;

export default function resolver() {
  const {
    db
  } = this;
  const {
    Post,
    User,
    Chat,
    Message
  } = db.models;

  const resolvers = {
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      lastMessage(chat, args, context) {
        return chat.getMessages({
          limit: 1,
          order: [
            ['id', 'DESC']
          ]
        }).then((message) => {
          return message[0];
        });
      },
      messages(chat, args, context) {
        return chat.getMessages({
          order: [
            ['id', 'ASC']
          ]
        });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
    },
    RootQuery: {
      usersSearch(root, {
        page,
        limit,
        text
      }, context) {
        if (text.length < 3) {
          return {
            users: []
          };
        }
        var skip = 0;
        if (page && limit) {
          skip = page * limit;
        }
        var query = {
          order: [
            ['createdAt', 'DESC']
          ],
          offset: skip,
        };
        if (limit) {
          query.limit = limit;
        }
        query.where = {
          username: {
            [Op.like]: '%' + text + '%'
          }
        };
        return {
          users: User.findAll(query)
        };
      },
      postsFeed(root, {
        page,
        limit
      }, context) {
        var skip = 0;

        if (page && limit) {
          skip = page * limit;
        }

        var query = {
          order: [
            ['createdAt', 'DESC']
          ],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }

        return {
          posts: Post.findAll(query)
        };
      },
      posts(root, args, context) {
        return Post.findAll({
          order: [
            ['createdAt', 'DESC']
          ]
        });
      },
      chats(root, args, context) {
        return Chat.findAll({
          include: [{
              model: User,
              required: true,
              through: {
                where: {
                  userId: context.user.id
                }
              },
            },
            {
              model: Message,
            }
          ],
        });
      },
      chat(root, {
        chatId
      }, context) {
        return Chat.findByPk(chatId, {
          include: [{
              model: User,
              required: true,
            },
            {
              model: Message,
            }
          ],
        });
      },
      currentUser(root, args, context) {
        return context.user;
      },
    },
    RootMutation: {
      signup(root, {
        email,
        password,
        username
      }, context) {
        return User.findAll({
          where: {
            [Op.or]: [{
              email
            }, {
              username
            }]
          },
          raw: true,
        }).then(async (users) => {
          if (users.length) {
            throw new Error('User already exists');
          } else {
            return bcrypt.hash(password, 10).then((hash) => {
              return User.create({
                email,
                password: hash,
                username,
                activated: 1,
              }).then((newUser) => {
                const token = JWT.sign({
                  email,
                  id: newUser.id
                }, 



"Asdadfafasdfasdfsadfsadfsadfasdfasdfasddddddddddddddddddddddddddddsadffffffffffvadfadfasdfasssssssss1231231231231231321231231231"

, {
                  expiresIn: '1d'
                });
                return {
                  token
                };
              });
            });
          }
        });
      },
      login(root, {
        email,
        password
      }, context) {
        return User.findAll({
          where: {
            email
          },
          raw: true
        }).then(async (users) => {
          if (users.length = 1) {
            const user = users[0];
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
              throw new Error('Password does not match');
            }
            const token = JWT.sign({
              email,
              id: user.id
            }, 


"Asdadfafasdfasdfsadfsadfsadfasdfasdfasddddddddddddddddddddddddddddsadffffffffffvadfadfasdfasssssssss1231231231231231321231231231"


, {
              expiresIn: '1d'
            });

            return {
              token
            };
          } else {
            throw new Error("User not found");
          }
        });
      },
      addChat(root, {
        chat
      }, context) {
        return Chat.create().then((newChat) => {
          return Promise.all([
            newChat.setUsers(chat.users),
          ]).then(() => {
            logger.log({
              level: 'info',
              message: 'Message was created',
            });
            return newChat;
          });
        });
      },
      addMessage(root, {
        message
      }, context) {
        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(usersRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => {
              logger.log({
                level: 'info',
                message: 'Message was created',
              });
              return newMessage;
            });
          });
        });
      },
      addPost(root, {
        post
      }, context) {
        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Post.create({
            ...post,
          }).then((newPost) => {
            return Promise.all([
              newPost.setUser(usersRow.id),
            ]).then(() => {
              logger.log({
                level: 'info',
                message: 'Post was created',
              });
              return newPost;
            });
          });
        });
      },
      deletePost(root, {
        postId
      }, context) {
        return Post.destroy({
          where: {
            id: postId
          }
        }).then(function (rows) {
          if (rows === 1) {
            logger.log({
              level: 'info',
              message: 'Post ' + postId + 'was deleted',
            });
            return {
              success: true
            };
          }
          return {
            success: false
          };
        }, function (err) {
          logger.log({
            level: 'error',
            message: err.message,
          });
        });
      },
    },
  };

  return resolvers;
}
