
CREATE TABLE IF NOT EXISTS "Tasks" (
  id  serial primary key,
  content varchar(1000) NOT NULL,
  timestamp integer,
  parent_id integer,
  parent char(30),
  is_completed boolean,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE 
);

INSERT INTO tasks (id, content, timestamp, parent_id) VALUES
(96, 'Welcome to HackFlowy!', 1365610846, 0),
(99, 'An open-source WorkFlowy clone', 1365610837, 0),
(101, 'Built using Backbone + Socket.IO', 1365610824, 0),
(102, 'I pulled this together in a few hours to learn Backbone', 1365610861, 0),
(104, 'Feel free to try it out and hack on it', 1365610859, 0),
(106, 'Good Luck!', 1365610865, 0);
