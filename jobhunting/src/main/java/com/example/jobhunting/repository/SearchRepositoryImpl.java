package com.example.jobhunting.repository;

import com.example.jobhunting.model.Post;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class SearchRepositoryImpl implements SearchRepository {

    @Autowired
    private MongoClient mongoClient;

    @Autowired
    private MongoConverter converter;

    private static final int LIMIT = 5;

    @Override
    public List<Post> findByTextAndExperience(String text, Integer exp) {
        final List<Post> posts = new ArrayList<>();

        // Check if the injected dependencies are null
        if (mongoClient == null || converter == null) {
            throw new IllegalStateException("MongoClient and MongoConverter must be initialized");
        }

        try {
            MongoDatabase database = mongoClient.getDatabase("Jobhunting");
            MongoCollection<Document> collection = database.getCollection("JobPost");

            List<Document> pipeline = new ArrayList<>();
            pipeline.add(new Document("$search",
                    new Document("text",
                            new Document("query", text)
                                    .append("path", Arrays.asList("techs", "profile", "desc"))
                    )
            ));

            if (exp != null && exp > 0) {
                pipeline.add(new Document("$match",
                        new Document("exp", new Document("$eq", exp))
                ));
            }

            pipeline.add(new Document("$sort",
                    new Document("exp", 1L)
            ));
            pipeline.add(new Document("$limit", LIMIT));

            AggregateIterable<Document> result = collection.aggregate(pipeline);
            result.forEach(doc -> posts.add(converter.read(Post.class, doc)));

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to execute search", e);
        }

        return posts;
    }
}
