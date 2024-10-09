package com.fastarm.back.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public List<Object> getListData(String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public Object getListDataByIndex(String key, long index) {
        return redisTemplate.opsForList().index(key, index);
    }

    public void removeFromList(String key, Object value) {
        redisTemplate.opsForList().remove(key, 1, value);
    }

    public void deleteData(String key) {
        redisTemplate.delete(key);
    }

}
