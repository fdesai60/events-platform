const db = require("../../db-setup/connection");

const googleIdToDelete = "google-oauth-id-13";

//test db query
db.query(`DELETE FROM users WHERE google_id = $1 RETURNING *`, [googleIdToDelete])
  .then(result => {
    if (result.rows.length > 0) {
      console.log("Deleted user:", result.rows[0]);
    } else {
      console.log("No user found with that google_id");
    }
  })
  .catch(err => console.error("Error deleting user:", err));


