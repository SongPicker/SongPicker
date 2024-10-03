package com.fastarm.back.connection.entity;

import com.fastarm.back.connection.enums.Mode;
import com.fastarm.back.connection.enums.Status;
import com.fastarm.back.karaoke.entity.Machine;
import com.fastarm.back.member.entity.Member;
import com.fastarm.back.team.entity.Team;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.Objects;

@Entity
@Getter
@SQLDelete(sql = "UPDATE connection_info SET status = 'DISCONNECT' where id = ?")
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ConnectionInfo that = (ConnectionInfo) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
