package com.fastarm.back.team.repository;

import com.fastarm.back.member.entity.Member;
import com.fastarm.back.team.dto.TeamDetailDto;
import com.fastarm.back.team.dto.TeamDetailMemberDto;
import com.fastarm.back.team.dto.TeamDto;
import com.fastarm.back.team.entity.Team;
import com.fastarm.back.team.entity.TeamMember;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByMemberId(Long memberId);
    List<TeamMember> findByTeamId(Long teamId);
    int countByTeamId(Long teamId);

    boolean existsByTeamAndMember(Team team, Member member);
    Optional<TeamMember> findByTeamIdAndMemberId(Long teamId, Long memberId);

    @Query("""
            SELECT new com.fastarm.back.team.dto.TeamDto(
                t.id,
                t.teamImage,
                t.name,
                size(t.teamMembers)
            )
            FROM TeamMember tm
            JOIN tm.team t
            WHERE tm.member.id = :memberId
    """
    )
    List<TeamDto> findTeamsWithMemberCountByMemberId(@Param("memberId") Long memberId);


    @Query("""
        SELECT new com.fastarm.back.team.dto.TeamDetailMemberDto(m.profileImage, m.nickname)
        FROM TeamMember tm
        JOIN tm.member m
        WHERE tm.team.id = :teamId
    """)
    List<TeamDetailMemberDto> findMembersByTeamId(@Param("teamId") Long teamId);
}
