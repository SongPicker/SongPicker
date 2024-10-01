package com.fastarm.back.notification.entity;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.notification.enums.Type;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
@SQLDelete(sql = "UPDATE notification SET is_deleted = true WHERE id = ?")
@Where(clause = "is_deleted = false")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id",nullable = false)
    private Member receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id",nullable = false)
    private Member sender;

    @Column(nullable = false, length = 128)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name="is_read", nullable = false)
    private Boolean isRead;

    @Column(name="is_deleted", nullable = false)
    private Boolean isDeleted;

    @Enumerated(EnumType.STRING)
    private Type type;

    @OneToOne(mappedBy = "notification", fetch = FetchType.LAZY)
    private NotificationTeamInvite notificationTeamInvite;

    public void read() {
        this.isRead = true;
    }
    public void delete() {
        this.isDeleted = true;
    }

    @Builder
    public Notification(Member receiver, Member sender, String content,Type type) {
        this.receiver = receiver;
        this.sender = sender;
        this.content = content;
        this.type = type;
        this.isRead = false;
        this.isDeleted = false;
    }
}
