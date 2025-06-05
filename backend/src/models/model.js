const db = require("../../db-setup/connection");

// The user_id to delete
const userIdToDelete = 2;

db.query(`DELETE FROM users WHERE user_id = $1 RETURNING *`, [userIdToDelete])
  .then(result => {
    if (result.rows.length > 0) {
      console.log("Deleted user:", result.rows[0]);
    } else {
      console.log("No user found with that user_id");
    }
  })
  .catch(err => console.error("Error deleting user:", err));