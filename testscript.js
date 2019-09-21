const db = require('./models');
const uuid = require('uuid/v4');

const moment = require('moment');

const { User, UserSession } = db;

(async () => {
  try {
    const user = await User.create({
      company_id: 1,
      name: 'New User',
      role: 'user',
      email: `new.user${uuid()}@a.com`,
      password: 'NICE_HASH',
    });

    const res = await user.destroy();
  } catch (e) {
    console.log(e);
  }

  db.sequelize.close();
})();