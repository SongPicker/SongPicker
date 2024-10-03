package com.fastarm.back.member.entity;

import com.fastarm.back.member.enums.Gender;
import com.fastarm.back.member.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE member SET is_withdraw = true WHERE id = ?")
@SQLRestriction("is_withdraw != true")
@Getter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 16, nullable = false)
    private String loginId;

    @Column(length = 256, nullable = false)
    private String password;

    @Column(length = 16, nullable = false)
    private String name;

    @Column(length = 8, nullable = false)
    private String nickname;

    @Column(nullable = false)
    private LocalDate birth;

    @Column(length = 11, nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 512)
    private String profileImage;

    @Column(nullable = false)
    private Boolean isWithdraw;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime withdrawnAt;

    @PrePersist
    protected void onCreate() {
        isWithdraw = false;
    }
}

