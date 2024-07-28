import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import './Feed.css';

const Feed = () => {
  const [query, setQuery] = useState("");
  const [exp, setExp] = useState("");
  const [post, setPost] = useState([]);

  const fetchPosts = async (searchQuery, experience) => {
    try {
      const response = await axios.get(`http://localhost:8080/posts`, {
        params: {
          text: searchQuery,
          exp: experience
        }
      });
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchInitialPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/allPosts`);
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching initial posts:", error);
    }
  };

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  const handleSearchClick = () => {
    fetchPosts(query, exp);
  };

  return (
    <Grid container spacing={2} className="feed-container">
      <Grid item xs={12}>
        <Button className="home-button" variant="outlined">
          <Link className="home-link" to="/">Home</Link>
        </Button>
        <Box className="search-box">
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            className="search-field"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            value={exp}
            displayEmpty
            className="search-field"
            onChange={(e) => setExp(e.target.value)}
          >
            <MenuItem value="">All Experience Levels</MenuItem>
            <MenuItem value={0}>0 years</MenuItem>
            <MenuItem value={1}>1 year</MenuItem>
            <MenuItem value={2}>2 years</MenuItem>
            <MenuItem value={3}>3 years</MenuItem>
            <MenuItem value={4}>4 years</MenuItem>
            <MenuItem value={5}>5+ years</MenuItem>
          </Select>
          <Button 
            className="search-button"
            variant="contained" 
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </Box>
      </Grid>
      {post &&
        post.map((p) => (
          <Grid key={p.id} item xs={12} md={6} lg={4}>
            <Card className="post-card">
              <Typography variant="h5" className="post-title">
                {p.profile}
              </Typography>
              <Typography className="post-description">
                Description: {p.desc}
              </Typography>
              <Typography className="post-exp">
                Years of Experience: {p.exp} years
              </Typography>
              <Typography className="post-skills-title">
                Skills:
              </Typography>
              <div className="post-skills">
                {p.techs.map((s, i) => (
                  <Typography key={i} className="post-skill">
                    {s}
                  </Typography>
                ))}
              </div>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default Feed;
