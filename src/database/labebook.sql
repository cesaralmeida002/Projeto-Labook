-- Active: 1680297762854@@127.0.0.1@3306

CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL, 
    password TEXT NOT NULL, 
    role TEXT NOT NULL, 
    create_at TEXT DEFAULT(DATETIME()));

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    creator_id TEXT NOT NULL, 
    content TEXT, 
    likes INTEGER DEFAULT(0) NOT NULL, 
    dislikes INTEGER DEFAULT(0) NOT NULL, 
    created_at TEXT DEFAULT(DATETIME()) NOT NULL, 
    updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id));

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL, 
    post_id TEXT NOT NULL, 
    like INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id));

SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM likes_dislikes;

INSERT INTO users (id, name, email, password, role)
VALUES ("us001", "Joao", "joao@email.com", "123456","admin"),
("us002", "Jose", "jose@email.com", "123456","normal");

INSERT INTO posts (id, creator_id, content)
VALUES ("po001", "us001", "teste Labebook-1"),
("po002", "us001", "teste Labebook-2"),
("po003", "us002", "teste Labebook-3.");
    SELECT * FROM users;
    SELECT * FROM posts;
    SELECT * FROM likes_deslikes;
