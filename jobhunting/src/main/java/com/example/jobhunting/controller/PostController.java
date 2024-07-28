package com.example.jobhunting.controller;

import com.example.jobhunting.repository.PostRepository;
import com.example.jobhunting.model.Post;
import com.example.jobhunting.repository.SearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostRepository repo;

    @Autowired
    private SearchRepository srepo;

    @ApiIgnore
    @RequestMapping(value = "/")
    public void redirect(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui.html");
    }

    @GetMapping("/allPosts")
    @CrossOrigin
    public ResponseEntity<List<Post>> getAllPosts() {
        try {
            List<Post> posts = repo.findAll();
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> search(
            @RequestParam String text,
            @RequestParam(required = false) Integer exp) {
        try {
            if (exp == null || exp == 0) {
                exp = null; // To ensure findByTextAndExperience method treats it as not provided
            }
            List<Post> posts = srepo.findByTextAndExperience(text, exp);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/post")
    public ResponseEntity<Object> addPost(@RequestBody Post post) {
        try {
            Post savedPost = repo.save(post);
            return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
