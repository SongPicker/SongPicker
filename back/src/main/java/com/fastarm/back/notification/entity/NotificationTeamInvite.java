package com.fastarm.back.notification.entity;

import com.fastarm.back.notification.enums.Status;
import com.fastarm.back.team.entity.Team;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@NoArgsConstructor
@Getter
public class NotificationTeamInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    public void accept() {
        this.status = Status.ACCEPT;
    }

    public void reject() {
        this.status = Status.REJECT;
    }

    @Builder
    public NotificationTeamInvite(Team team, Notification notification) {
        this.team = team;
        this.notification = notification;
        this.status = Status.WAIT;
    }

}
