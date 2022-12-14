const pool = require('../utils/pool.js');
module.exports = class Review {
  id;
  user_id;
  stars;
  detail;

  constructor({ id, user_id, stars, detail }) {
    this.id = id;
    this.user_id = user_id;
    this.stars = stars;
    this.detail = detail;
  }
  static async insert({ userId, restaurantId, stars, detail }) {
    const { rows } = await pool.query(
      `INSERT INTO reviews
    (user_id, restaurant_id, stars, detail)
    VALUES ($1, $2, $3, $4)
    RETURNING *`, [userId, restaurantId, stars, detail]
    );
    return new Review(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE from reviews
      WHERE id = $1
      RETURNING *`, [id]
    );
    return new Review(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      'SELECT * from reviews WHERE id = $1;', [id]
    );
    if (!rows[0]) return null;
    return new Review(rows[0]);
  }
};
