import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Autocomplete,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import './Create.css';

const initial = { profile: "", exp: 0, jobType: "", desc: "", techs: [] };

const Create = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const skillSets = {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Vue.js"],
    backend: ["Java", "Python", "Node.js", "Spring Framework", "Django"],
    fullstack: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    java: ["Java", "Spring Framework", "Hibernate", "Maven", "JUnit"],
    ai: ["Python", "TensorFlow", "PyTorch", "Keras", "Scikit-learn"],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.profile || !form.exp || !form.jobType || !form.desc || form.techs.length === 0) {
      setError('Please fill all the fields correctly.');
      return;
    }
    fetch("http://localhost:8080/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (response.ok) {
          setOpen(true);
          setTimeout(() => navigate('/employee/'), 1500);
        } else {
          setError("Failed to create post.");
        }
      })
      .catch((error) => {
        setError("Error: " + error);
      });
  };

  const { profile, exp, jobType, desc, techs } = form;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      ...(name === 'jobType' && { techs: [] }),
    }));
  };

  const handleTechChange = (event, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      techs: value,
    }));
  };

  return (
    <Paper className="create-container" elevation={3}>
      <Typography className="title" align="center" variant="h5">
        Create New Post
      </Typography>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box className="form-container">
          <TextField
            type="string"
            className="input-field"
            required
            onChange={handleChange}
            name="profile"
            label="Job Profile"
            variant="outlined"
            value={profile}
          />
          <TextField
            type="number"
            className="input-field"
            required
            onChange={handleChange}
            name="exp"
            label="Years of Experience"
            variant="outlined"
            value={exp}
          />
          <TextField
            type="string"
            className="input-field"
            required
            multiline
            rows={4}
            onChange={handleChange}
            name="desc"
            label="Job Description"
            variant="outlined"
            value={desc}
          />
          <TextField
            select
            className="input-field"
            required
            onChange={handleChange}
            name="jobType"
            label="Select Job Type"
            variant="outlined"
            value={jobType}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="frontend">Frontend Developer</MenuItem>
            <MenuItem value="backend">Backend Developer</MenuItem>
            <MenuItem value="fullstack">Fullstack Developer</MenuItem>
            <MenuItem value="devops">DevOps Engineer</MenuItem>
            <MenuItem value="java">Java Developer</MenuItem>
            <MenuItem value="ai">AI Developer</MenuItem>
          </TextField>
          {jobType && (
            <Autocomplete
              className="input-field"
              multiple
              options={skillSets[jobType]}
              getOptionLabel={(option) => option}
              value={techs}
              onChange={handleTechChange}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Skills" placeholder="Select Skills" />
              )}
            />
          )}
          <Box display="flex" justifyContent="center">
            <Button
              className="submit-button"
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </Box>
      </form>
      <Snackbar open={open} autoHideDuration={2000}>
        <Alert severity="success">Post created successfully!</Alert>
      </Snackbar>
      {error && (
        <Snackbar open autoHideDuration={2000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Paper>
  );
};

export default Create;
