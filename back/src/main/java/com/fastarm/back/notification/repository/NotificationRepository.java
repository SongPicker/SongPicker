package com.fastarm.back.notification.repository;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.notification.controller.dto.NotificationResponse;
import com.fastarm.back.notification.entity.Notification;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("""
            SELECT new com.fastarm.back.notification.controller.dto.NotificationResponse(n.id, n.isRead, n.content) 
            FROM Notification n 
            WHERE n.receiver = :member AND n.isDeleted = false 
            ORDER BY n.createdAt ASC
            """)
    List<NotificationResponse> findAllByReceiver(@Param("member") Member member);

    boolean existsByReceiverAndIsReadFalse(Member receiver);
}
