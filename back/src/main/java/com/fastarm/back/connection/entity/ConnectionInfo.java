package com.fastarm.back.connection.entity;

import com.fastarm.back.connection.enums.Mode;
import com.fastarm.back.connection.enums.Status;
import com.fastarm.back.karaoke.entity.Machine;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE connection_info SET status = 'DISCONNECT' WHERE id = ?")
@SQLRestriction("status != 'DISCONNECT'")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ConnectionInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id")
    private Machine machine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Mode mode;

    @PrePersist
    protected void onCreate() {
        status = Status.CONNECT;
    }

}
