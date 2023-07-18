const express = require('express');

const app = express();

const db = require('./models');

const { Member } = db;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('URL should contain /api/..');
});

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMember = await Member.findAll({ where: { team } });
    res.send(teamMember);
  } else {
    const members = await Member.findAll();
    res.send(members);
  }
});

app.get('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status('404').send({ message: 'There is no member with the id!' });
  }
});

app.post('/api/members', async (req, res) => {
  const newMember = req.body;
  const member = Member.build(newMember);
  await member.save();
  /*
    create 메서드로 build + save 명령을 한 줄로 가능
    const member = await Member.create(newMember);
  */
  res.send(member);
});

// app.put('/api/members/:id', async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
//   const result = await Member.update(newInfo, { where: { id } });
//   console.log(result);
//   if (result[0]) {
//     res.send({ message: `${result[0]} row(s) affected` });
//   } else {
//     res.status('404').send({ message: 'There is no member with the id!' });
//   }
// });

app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
  } else {
    res.status('404').send({ message: 'There is no member with the id!' });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Member.destroy({ where: { id } });
  if (deletedCount) {
    res.send({ message: `${deletedCount} row(s) deleted` });
  } else {
    res.status('404').send({ message: 'There is no member with the id!' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening...');
});
