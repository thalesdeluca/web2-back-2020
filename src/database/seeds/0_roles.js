const { Role } = require("../../models")

exports.seed = async function(knex) {
  const roles = await Role.transaction(async trx => {
    const userRole = await Role.query(trx).insert({
      name: "User",
      slug: "user"
    })

    return await Role.query(trx).insert({
      name: "Admin",
      slug: "admin"
    })
  })
}