package com.fastarm.back.notification.repository;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.notification.entity.NotificationTeamInvite;
import com.fastarm.back.notification.enums.Status;
import com.fastarm.back.notification.enums.Type;
import com.fastarm.back.team.entity.Team;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationTeamInviteRepository  extends JpaRepository<NotificationTeamInvite, Long> {

    boolean existsByTeamAndReceiverIdAndStatus(Team team, Long receiverId, Status status);
    Optional<NotificationTeamInvite> findById(Long notificationId);
    @Query("""
           SELECT CASE WHEN COUNT(nt) > 0 THEN TRUE ELSE FALSE END 
           FROM Notification n JOIN NotificationTeamInvite nt ON n.id = nt.id
           WHERE n.type = :type AND n.receiver.id = :receiverId AND nt.status = :status
           """)
    boolean existsByTypeAndReceiverIdAndStatus(
            @Param("type") Type type,
            @Param("receiverId") Long receiverId,
            @Param("status") Status status);

}
