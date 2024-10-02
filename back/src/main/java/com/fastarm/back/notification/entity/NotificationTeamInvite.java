package com.fastarm.back.notification.entity;

import com.fastarm.back.notification.enums.Status;
import com.fastarm.back.team.entity.Team;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@SuperBuilder
@DiscriminatorValue("NOTIFICATIONTEAMINVITE")
public class NotificationTeamInvite extends Notification{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Enumerated(EnumType.STRING)
    private Status status;

    public void accept() {
        this.status = Status.ACCEPT;
    }

    public void reject() {
        this.status = Status.REJECT;
    }

}
