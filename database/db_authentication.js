import database from "../mySQLDatabaseConnection.js";

export const register = async (username, password) => {
  const query = `
        INSERT INTO users (username, password)
        VALUES (:username, :password)
      `;
  const params = { username, password };
  try {
    const result = await database.query(query, params);
    return result[0].insertId !== undefined;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const login = async (username) => {
  const query = `
        SELECT *
        FROM users
        WHERE username = :username
    `;
  const params = { username };
  try {
    const result = await database.query(query, params);
    return result[0][0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const updateScore = async (user_id, score) => {
  const query = `
        UPDATE users
        SET score = :score
        WHERE user_id = :user_id
        `;
  const params = { user_id, score };
  try {
    const result = await database.query(query, params);
    return result[0].affectedRows === 1;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getScore = async (user_id) => {
  const query = `
            SELECT score
            FROM users
            WHERE user_id = :user_id
            `;
  const params = { user_id };
  try {
    const result = await database.query(query, params);
    return result[0][0];
  } catch (e) {
    console.log(e);
    return null;
  }
};
