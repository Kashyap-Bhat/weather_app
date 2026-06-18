package com.weather.dashboard.repository;

import com.weather.dashboard.model.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findAllByUserIdOrderBySearchedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
