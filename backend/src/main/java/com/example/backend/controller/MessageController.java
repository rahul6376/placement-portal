package com.example.backend.controller;

import com.example.backend.model.Message;
import com.example.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Chat endpoint
    // PreAuthorize allows Admins or Coordinators to message, or anyone (Companies/Students) to reply
    @GetMapping("/conversation")
    public List<Message> getConversation(@RequestParam Long user1Id, @RequestParam Long user2Id) {
        return messageService.getConversation(user1Id, user2Id);
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest request) {
        Message message = messageService.sendMessage(request.getSenderId(), request.getReceiverId(), request.getContent());
        return ResponseEntity.ok(message);
    }
}

class MessageRequest {
    private Long senderId;
    private Long receiverId;
    private String content;

    // Getters and Setters
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
