const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

const pool = new Pool({
  user: "postgres",
  password: "aree456#",
  host: "localhost",
  port: 5432,
  database: "blog-app",
});

const secretKey = "jwtSecretKey";
const refreshTokenSecretKey = 'key'

function generateRefreshToken(user) {
  const payload = {
    userId: user.id,
  };
  const options = {
    expiresIn: "30d", // You can adjust the expiration time for refresh tokens
  };
  return jwt.sign(payload, refreshTokenSecretKey, options);
}

function generateToken(user) {
  const payload = {
    userId: user.id,
  };
  const options = {
    expiresIn: "7d", 
  };
  return jwt.sign(payload, secretKey, options);
}

function verifyToken(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", ""); 

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      console.error("Token verification error:", err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decodedToken;
    next();
  });
}




// signup
app.post('/signup', (req, res) => {
  const pg = 'INSERT INTO signup (fname, lname, username, pnumber, email, password, cpassword) VALUES ($1, $2, $3, $4, $5, $6, $7)';
  const values = [
    req.body.fname,
    req.body.lname,
    req.body.username,
    req.body.pnumber,
    req.body.email,
    req.body.password,
    req.body.cpassword,
  ];

  pool.query(pg, values, (err, data) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error inserting data' });
    }
    return res.json(data);
  });
});

app.post("/login", (req, res) => {
  const pg = "SELECT * FROM signup WHERE email = $1 AND password = $2";
  const values = [req.body.email, req.body.password];

  pool.query(pg, values, (err, data) => {
    if (err) {
      console.error("Error querying data:", err);
      return res.status(500).json({ error: "Error querying data" });
    }

    if (data && data.rows.length > 0) {
      const user = data.rows[0];
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      return res.json({ token,refreshToken });
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  });
});
app.post("/token/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  jwt.verify(refreshToken, refreshTokenSecretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // You can also check if the user still exists in your database here

    const token = generateToken(user);
    return res.json({ token });
  });
});
// Fetch all blog posts
app.get("/api/allBlogs", async (req, res) => {
  try {
    const query = "SELECT * FROM blogs where status = 'publish' ";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    res.status(500).json({ error: "Error fetching all blogs" });
  }
});
app.use(verifyToken)

app.post("/api/saveBlog", async (req, res) => {
    try {
      const { title, content, status, image_url } = req.body;
      const authorId = req.user.userId; // Assuming you have the user's ID in the token
  
      // Insert the new blog post into the database, including the author's ID
      const query =
        "INSERT INTO blogs (title, content, status, image_url, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const values = [title, content, status, image_url, authorId];
  
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Error creating blog post" });
    }
  });
  

app.put("/api/editBlog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const query =
      "UPDATE blogs SET title = $1, content = $2, status = $3 WHERE id = $4 RETURNING *";
    const values = [title, content, status, id];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error editing blog:", error);
    res.status(500).json({ error: "Error editing blog" });
  }
});



app.get("/api/allDrafts", async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you have the user's ID in the token
    const query = "SELECT * FROM blogs WHERE status = 'draft' AND author_id = $1";
    const values = [userId];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching draft blogs:", error);
    res.status(500).json({ error: "Error fetching draft blogs" });
  }
});

// Fetch published blog posts for the current user
app.get("/api/published", async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you have the user's ID in the token
    const query = "SELECT * FROM blogs WHERE status = 'publish' AND author_id = $1";
    const values = [userId];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    res.status(500).json({ error: "Error fetching published blogs" });
  }
});


// Search for blog posts based on a keyword
app.get("/api/search", async (req, res) => {
  try {
    const { keyword } = req.query;
    const query = "SELECT * FROM blogs WHERE title ILIKE $1 OR content ILIKE $1";
    const values = [`%${keyword}%`];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching for blog posts:", error);
    res.status(500).json({ error: "Error searching for blog posts" });
  }
});

// Delete a blog post by its ID
app.delete("/api/deleteBlog/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM blogs WHERE id = $1";
    const values = [id];

    await pool.query(query, values);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Error deleting blog" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
