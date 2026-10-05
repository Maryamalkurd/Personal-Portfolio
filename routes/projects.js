const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

router.get("/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY sort_order, id");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/projects", verifyToken, async (req, res) => {
  const { title, description, image_url, project_url, category, sort_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (title, description, image_url, project_url, category, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, image_url, project_url, category || "first", sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/projects/:id", verifyToken, async (req, res) => {
  const { title, description, image_url, project_url, category, sort_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects SET title=$1, description=$2, image_url=$3, project_url=$4, category=$5, sort_order=$6
       WHERE id=$7 RETURNING *`,
      [title, description, image_url, project_url, category || "first", sort_order || 0, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/projects/:id", verifyToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM projects WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;