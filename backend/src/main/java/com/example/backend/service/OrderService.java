package com.example.backend.service;

import com.example.backend.model.Order;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public Order createOrder(Long senderId, Role targetRole, String title, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Admin sender not found"));

        Order order = Order.builder()
                .sender(sender)
                .targetRole(targetRole)
                .title(title)
                .content(content)
                .build();

        return orderRepository.save(order);
    }

    public List<Order> getOrdersForRole(Role role) {
        return orderRepository.findByTargetRoleOrderByTimestampDesc(role);
    }
    
    // Admins might want to see all orders they've ever sent
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
