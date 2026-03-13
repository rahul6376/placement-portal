package com.example.backend.repository;

import com.example.backend.model.Order;
import com.example.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByTargetRoleOrderByTimestampDesc(Role targetRole);
}
