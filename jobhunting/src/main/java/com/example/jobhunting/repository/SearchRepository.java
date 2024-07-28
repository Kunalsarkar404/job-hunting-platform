package com.example.jobhunting.repository;

import com.example.jobhunting.model.Post;

import java.util.List;

public interface SearchRepository {

    List<Post> findByTextAndExperience(String text, Integer exp);
}
