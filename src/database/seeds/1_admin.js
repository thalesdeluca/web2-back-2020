const { Role, User } = require("../../models")

exports.seed = async function(knex) {
  const admin = await User.transaction(async trx => {
    const adminUser = await User.query(trx).insert({
      username: "admin",
      email: "admin@test.com",
      password: "123123123"
    })

    const role = await Role.query(trx).where("slug", "admin").first();

    return await adminUser.$relatedQuery("roles", trx).relate(role);

  })
}