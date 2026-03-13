package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.model.Role;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Only Admins can create official Orders/Broadcasts
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest request) {
        Role target = Role.valueOf(request.getTargetRole().toUpperCase());
        Order order = orderService.createOrder(request.getSenderId(), target, request.getTitle(), request.getContent());
        return ResponseEntity.ok(order);
    }

    // Users fetch orders based on their role
    @GetMapping("/role/{roleName}")
    public List<Order> getOrdersByRole(@PathVariable String roleName) {
        Role role = Role.valueOf(roleName.toUpperCase());
        return orderService.getOrdersForRole(role);
    }
    
    // Admins can view all orders
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}

class OrderRequest {
    private Long senderId;
    private String targetRole;
    private String title;
    private String content;

    // Getters and Setters
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
