const mysql = require("mysql2/promise");

const connectionPool = mysql.createPool({
	uri:
		process.env.db_uri || `msql://root:password@localhost:3306/revou_form`,
});

module.exports = { connectionPool };