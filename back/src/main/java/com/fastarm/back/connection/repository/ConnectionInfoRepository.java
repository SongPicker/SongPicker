package com.fastarm.back.connection.repository;

import com.fastarm.back.connection.entity.ConnectionInfo;
import com.fastarm.back.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConnectionInfoRepository extends JpaRepository<ConnectionInfo, Long> {
    List<ConnectionInfo> findListByMember(Member member);

    @Query("""
        SELECT ci
        From ConnectionInfo ci
        JOIN FETCH ci.machine
        Where ci.member = :member
    """)
    Optional<ConnectionInfo> findByMemberFetchMachine(Member member);

    Optional<ConnectionInfo> findByMember(Member member);

    void deleteAllByMember(Member member);
}
